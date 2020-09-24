module.exports = {
  presets: [
    '@babel/env',
    '@babel/react',
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
