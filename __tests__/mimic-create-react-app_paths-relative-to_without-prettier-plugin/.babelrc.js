module.exports = {
  presets: [
    '@babel/env',
    ["@babel/react", {
      "runtime": "automatic"
    }],
    ['../../index', {
      mimicCreateReactApp: {
        pathsRelativeTo: __dirname,
      },
      svgr: {
        plugins: [
          '@svgr/plugin-svgo',
          '@svgr/plugin-jsx',
        ],
      },
    }],
  ],
};
