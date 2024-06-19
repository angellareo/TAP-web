const { getScores, calculateScore, calculateMetrics, calculateSkewness, calculateKurtosis, calculateTotalPossibleScore } = require('../app');

test('calculateScore should calculate the correct score', () => {
  const line = ' AABBCCABCC';
  const key = 'AABBCCABCC';
  const include = 'YYYYYYYYYY';
  const offset = 1;

  const score = calculateScore(line, key, include, offset);
  expect(score).toBe(10);
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
  expect(metrics.meanScore).toBeCloseTo(6.0, 0.15);
  expect(metrics.medianScore).toBe(7);
  expect(metrics.stdDev).toBeCloseTo(2.16, 2);
  expect(metrics.variance).toBeCloseTo(4.6667, 4);
  expect(metrics.skewness).toBeCloseTo(-0.595, 3);
  expect(metrics.kurtosis).toBeCloseTo(-1.5, 1);
});

test('calculateSkewness should calculate correct skewness', () => {
  const scores = [3, 8, 7];
  const mean = 6;
  const stdDev = 2.16;

  const skewness = calculateSkewness(scores, mean, stdDev);
  expect(skewness).toBeCloseTo(-0.595, 3);
});

test('calculateKurtosis should calculate correct kurtosis', () => {
  const scores = [3, 8, 7];
  const mean = 6;
  const stdDev = 2.16;

  const kurtosis = calculateKurtosis(scores, mean, stdDev);
  expect(kurtosis).toBeCloseTo(-1.5, 1);
});

