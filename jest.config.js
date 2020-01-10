module.exports = {
  testMatch: ['<rootDir>/__tests__/**/*.js?(x)'],
  testPathIgnorePatterns: [
    '/node_modules/',
  ],
  transform: {
    '\\.(jsx?|svg)$': ['babel-jest'],
  },
};
