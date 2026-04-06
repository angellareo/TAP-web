const { getDataFromFile, getScores, calculateScore, calculateSkewness, calculateKurtosis, calculateTotalPossibleScore, calculateQuickExamineeResults, processData, validateInputs } = require('../src/js/controller/dataProcessors.js');
const fs = require('fs');
const path = require('path');

test('calculateScore should calculate the correct score', () => {
  const line = 'AABBCCABCC';
  const key = 'AABBCCABCC';
  const include = 'YYYYYYYYYY';

  const score = calculateScore(line, key);
  const totalScore = calculateTotalPossibleScore(include);
  expect(score).toBe(totalScore);
});

test('calculateSkewness should calculate correct skewness', () => {
  const scores = [3, 8, 7];
  const mean = 6;
  const stdDevPop = 2.16;

  numExaminees = scores.length;
  const skewness = calculateSkewness(scores, numExaminees, mean, stdDevPop);
  expect(skewness).toBeCloseTo(-0.595, 3);
});

test('calculateKurtosis should calculate correct kurtosis', () => {
  const scores = [3, 8, 7];
  const mean = 6;
  const stdDevPop = 2.16;

  numExaminees = scores.length;
  const kurtosis = calculateKurtosis(scores, numExaminees, mean, stdDevPop)-3; // The -3 is to compare kurtosis with normal distribution
  expect(kurtosis).toBeCloseTo(-1.5, 1);
});

test('getDataFromFile should process data correctly', () => {
    const filePath = path.join(__dirname, '../data/test2.dat');
    const data = fs.readFileSync(filePath, 'utf8');
    const {
      title,
      comments,
      numberOfStudents,
      numberOfItems,
      offset,
      key,
      options,
      include,
      studentData
    } = getDataFromFile(data);

    const totalPossibleScore = calculateTotalPossibleScore(include);
    const scores = getScores(studentData, key, include, offset);
    const metrics = calculateQuickExamineeResults(scores);

    expect(metrics.numExaminees).toBe(10);
    expect(totalPossibleScore).toBe(10);
    expect(metrics.minScore).toBe(3);
    expect(metrics.maxScore).toBe(9);
    expect(metrics.mean).toBeCloseTo(5.4, 0.15);
    expect(metrics.median).toBe(5);
    expect(metrics.stdDevPop).toBeCloseTo(1.855, 0.01);
    expect(metrics.varPop).toBeCloseTo(3.440, 0.01);
    expect(metrics.skewness).toBeCloseTo(0.722, 0.01);
    expect(metrics.kurtosis).toBeCloseTo(-0.761, 0.01);
  });

test('processData with test.dat data produces correct statistics', () => {
  // Data taken from data/test.dat (12 students, 10 items, include excludes item 1)
  const studentData = [
    'ACBAABAABA', 'AAABABABCC', 'AACBCCABCC', 'ACBABBAABA',
    'AAABABABCC', 'AAAACCABCC', 'ACBACCAABA', 'AAABABCBCC',
    'CCABACABCC', 'AABBCCAACC', 'AAAACCABCC', 'AAABCBABCC',
  ];

  const { totalPossibleScore, fscores } = processData(
    0, 'ACBAABAABC', '4444444444', 'NYYYYYYYYY', studentData
  );

  // Structural checks
  expect(totalPossibleScore).toBe(9);   // 9 Y's in include
  expect(fscores.length).toBe(12);

  // Examinee summary — values cross-checked against ref/results.txt
  const ex = JSON.parse(sessionStorage.getItem('examineeResults'));
  expect(ex.numExaminees).toBe(12);
  expect(ex.minScore).toBe(2);
  expect(ex.maxScore).toBe(8);
  expect(ex.mean).toBeCloseTo(4.25, 2);
  expect(ex.median).toBe(4);
  expect(ex.stdDevPop).toBeCloseTo(1.738, 2);
  expect(ex.skewness).toBeCloseTo(0.946, 2);
  expect(ex.kurtosis).toBeCloseTo(-0.263, 2);

  // Per-item results should be stored and have 9 entries (item 1 excluded)
  const items = JSON.parse(sessionStorage.getItem('perItemResults'));
  expect(items.length).toBe(9);

  // Item 9 (key C) is a known problem item: disc = -1.00, adj pt biserial < 0
  const item9 = items[8];
  expect(item9.discIndex).toBeCloseTo(-1.0, 1);
  expect(item9.isProblem).toBe(true);
});

test('validateInputs rejects mismatched lengths', () => {
  expect(validateInputs('ABCD', '4444', 'YYYY', 4)).toBe(true);
  expect(validateInputs('ABC',  '4444', 'YYYY', 4)).toBe(false);  // key too short
  expect(validateInputs('ABCD', '444',  'YYYY', 4)).toBe(false);  // options too short
  expect(validateInputs('ABCD', '4444', 'YYY',  4)).toBe(false);  // include too short
});