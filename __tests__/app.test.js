const { getScores, calculateScore, calculateMetrics, calculateSkewness, calculateKurtosis, calculateTotalPossibleScore } = require('../app');

test('calculateScore should calculate the correct score', () => {
  const line = ' AABBCCABCC';
  const key = 'AABBCCABCC';
  const include = 'YYYYYYYYYY';
  const offset = 1;

  const score = calculateScore(line, key, include, offset);
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

test('calculateMetrics should calculate correct metrics', () => {
  const data = ' ACBAABAABA\n AAABABABCC\n AACCCCABCC';
  const key = 'AABBCCABCC';
  const include = 'YYYYYYYYYY';
  const numberOfStudents = 3;
  const offset = 1;

  const totalPossibleScore = calculateTotalPossibleScore(include);
  const scores = getScores(data, numberOfStudents, key, include, offset);
  const metrics = calculateMetrics(scores);

  expect(metrics.numExaminees).toBe(3);
  expect(totalPossibleScore).toBe(10);
  expect(metrics.minScore).toBe(3);
  expect(metrics.maxScore).toBe(8);
  expect(metrics.mean).toBeCloseTo(6.0, 0.15);
  expect(metrics.median).toBe(7);
  expect(metrics.stdDevPop).toBeCloseTo(2.16, 1);
  expect(metrics.varPop).toBeCloseTo(4.6667, 4);
  expect(metrics.skewness).toBeCloseTo(-0.595, 3);
  expect(metrics.kurtosis).toBeCloseTo(-1.5, 1);
});