/* global __dirname, module */

module.exports = {
  presets: [
    '@babel/env',
    ['@babel/react', {
      runtime: 'automatic',
    }],
    ['../../index', {
      mimicCreateReactApp: {
        pathsRelativeTo: __dirname,
        pathsTransform: (path) => `some/prefix/${path}`,
      },
    }],
  ],
};
