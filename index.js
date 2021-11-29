const { parse } = require('@babel/parser');
const { transform } = require('@svgr/core');

/**
 * Clones the specified object field (or assigns an empty object to the field,
 * if it does not exist), and returns the cloned field value.
 *
 * BEWARE: It mutates the object.
 *
 * @param {object} obj
 * @param {string} field
 * @return {object}
 */
function cloneFieldOfObjectType(obj, field) {
  /* eslint-disable no-param-reassign */
  obj[field] = obj[field] ? { ...obj[field] } : {};
  /* eslint-enable no-param-reassign */
  return obj[field];
}

module.exports = function plugin(api, ops) {
  let parser = parse;
  if (ops.parser) {
    /* eslint-disable global-require, import/no-dynamic-require */
    parser = require(ops.parser);
    parser = parser.default || parser;
    /* eslint-enable global-require, import/no-dynamic-require */
  }

  let svgrOptions = ops.svgr || {
    plugins: [
      '@svgr/plugin-svgo',
      '@svgr/plugin-jsx',
      '@svgr/plugin-prettier',
    ],
    svgoConfig: {
      plugins: [{
        name: 'preset-default',
        params: {
          overrides: {
            removeViewBox: false,
          },
        },
      }],
    },
  };

  const mimicCraOps = {};
  if (ops.mimicCreateReactApp) {
    Object.assign(mimicCraOps, ops.mimicCreateReactApp);
    svgrOptions = { ...svgrOptions };
    let d = cloneFieldOfObjectType(svgrOptions, 'jsx');
    d = cloneFieldOfObjectType(d, 'babelConfig');
    d.plugins = [
      [`${__dirname}/src/mimic-cra`, mimicCraOps],
      ...d.plugins || [],
    ];
  }

  return {
    plugins: [{
      parserOverride(codeOrSvg, opts) {
        let code = codeOrSvg;
        if (opts.sourceFileName.endsWith('.svg')) {
          mimicCraOps.sourceFileName = opts.sourceFileName;
          code = transform.sync(codeOrSvg, svgrOptions, {
            componentName: 'SvgComponent',
            filePath: opts.sourceFileName,
          });
        }
        return parser(code, opts);
      },
    }],
  };
};
