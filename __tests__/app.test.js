const { getDataFromFile, getScores, calculateScore, calculateSkewness, calculateKurtosis, calculateTotalPossibleScore, calculateQuickExamineeResults } = require('../src/js/controller/dataProcessors.js');
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