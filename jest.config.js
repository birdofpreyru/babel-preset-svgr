module.exports = {
  testMatch: ['<rootDir>/__tests__/**/*.js?(x)'],
  testPathIgnorePatterns: [
    '/node_modules/',
    '.babelrc.js',
  ],
  transform: {
    '\\.(jsx?|svg)$': ['babel-jest'],
  },
};
