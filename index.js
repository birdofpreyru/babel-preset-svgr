/* global __dirname, module, require */

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

module.exports = function (api, ops) {
  let parser = parse;
  if (ops.parser) {
    /* eslint-disable import/no-dynamic-require */
    parser = require(ops.parser);
    parser = parser.default || parser;
    /* eslint-enable import/no-dynamic-require */
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

  {
    // SVGR 6.5.0 (adopted in the v1.5.0 of this preset) added role="img"
    // attribute to generated SVGs, which was considered a breaking change.
    // However, SVGR 6.5.1 reverted that, and removed role attrbute from
    // generated SVGs, unless opted-in explicitly via svgProps.role option.
    // To avoid unnecessary revert of a breaking change, we just default
    // svgProps.role option to "img", thus keeping adding role="img" by default.
    const p = svgrOptions.svgProps;
    if (!p) svgrOptions.svgProps = { role: 'img' };
    else if (p.role === undefined) p.role = 'img';
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
