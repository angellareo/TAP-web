/**
 * fileParser.js
 * Parses .tap (original TAP app format) and .dat / .tapw (webapp format) files.
 * No external dependencies.
 */

// ─── Format detection ─────────────────────────────────────────────────────────

function isTapFormat(data) {
    return data.trimStart().startsWith('TAP:') || /Answer Key\s*=/i.test(data);
}

// ─── Original TAP app format (.tap) ──────────────────────────────────────────

/**
 * Header lines use  Key = Value  syntax.
 * Lines with no '=' character are treated as student response rows.
 * Footer lines (# Grades, #Alternatives …) also contain '=' and are silently absorbed.
 */
function getDataFromTapFile(data) {
    const lines = data.split('\n');
    const header = {};
    const studentRows = [];

    for (const rawLine of lines) {
        const line = rawLine.trim();
        if (!line || line.startsWith('TAP:')) continue;
        const eqIdx = line.indexOf('=');
        if (eqIdx > 0) {
            header[line.substring(0, eqIdx).trim().toLowerCase()] = line.substring(eqIdx + 1).trim();
        } else {
            studentRows.push(line);
        }
    }

    const title            = header['title']          || '';
    const comments         = header['comments']        || '';
    const numberOfItems    = parseInt(header['# items']);
    const offset           = parseInt(header['label length']) || 0;
    const key              = header['answer key']      || '';
    const options          = header['# options']       || '';
    const include          = header['item analyzed']   || '';
    const numberOfStudents = parseInt(header['# examinees']) || studentRows.length;

    if (!numberOfItems || !key) return null;

    const studentData = studentRows.slice(0, numberOfStudents);
    if (studentData.length !== numberOfStudents ||
        studentData.some(line => (line.length - offset) !== numberOfItems)) {
        return null;
    }

    return { title, comments, offset, key, options, include, studentData };
}

// ─── Webapp format (.dat / .tapw) ────────────────────────────────────────────

/**
 * Header lines use  key: value  syntax.
 * The special key "data:" marks the start of student response rows.
 * Surrounding quotes on string values are stripped for legacy .dat compatibility.
 */
function getDataFromDatFile(data) {
    const lines = data.split('\n');
    const dataObject = {};
    let dataIndex = -1;

    lines.forEach((line, index) => {
        const colonIdx = line.indexOf(':');
        if (colonIdx < 0) return;
        const key   = line.substring(0, colonIdx).trim();
        const value = line.substring(colonIdx + 1).trim().replace(/^"|"$/g, '');
        if (key === 'data') {
            dataIndex = index + 1;
        } else if (key) {
            dataObject[key] = value;
        }
    });

    const title            = dataObject.title    || '';
    const comments         = dataObject.comments || '';
    const numberOfStudents = parseInt(dataObject.nstudents);
    const numberOfItems    = parseInt(dataObject.nitems);
    const offset           = parseInt(dataObject.noffset) || 0;
    const key              = dataObject.key;
    const options          = dataObject.options;
    const include          = dataObject.include;

    if (dataIndex < 0 || !numberOfItems || !numberOfStudents || !key) return null;

    const studentData = lines
        .slice(dataIndex, dataIndex + numberOfStudents)
        .map(l => l.replace(/\r$/, ''));

    if (studentData.length !== numberOfStudents ||
        studentData.some(line => (line.length - offset) !== numberOfItems)) {
        return null;
    }

    return { title, comments, offset, key, options, include, studentData };
}

// ─── Public entry point ───────────────────────────────────────────────────────

/** Auto-detects format and delegates to the correct parser. */
function getDataFromFile(data) {
    return isTapFormat(data) ? getDataFromTapFile(data) : getDataFromDatFile(data);
}

module.exports = { isTapFormat, getDataFromTapFile, getDataFromDatFile, getDataFromFile };
