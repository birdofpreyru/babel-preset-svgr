const path = require('path');
const { parse } = require('@babel/parser');
const svgr = require('@svgr/core').default.sync;

module.exports = function plugin(api, ops) {
  let parser = parse;
  if (ops.parser) {
    /* eslint-disable global-require, import/no-dynamic-require */
    parser = require(ops.parser);
    parser = parser.default || parser;
    /* eslint-enable global-require, import/no-dynamic-require */
  }

  return {
    plugins: [{
      parserOverride(codeOrSvg, opts) {
        let code = codeOrSvg;
        if (opts.sourceFileName.endsWith('.svg')) {
          code = svgr(codeOrSvg, ops.svgr || {
            plugins: [
              '@svgr/plugin-svgo',
              '@svgr/plugin-jsx',
              '@svgr/plugin-prettier',
            ],
          });

          /* Create React App setup for SVG images returns transformed React
           * component as `ReactComponent` export, and the original SVG path
           * as the default export. */
          if (ops.mimicCreateReactApp) {
            let sourcePath = opts.sourceFileName;
            if (ops.mimicCreateReactApp.pathsRelativeTo) {
              sourcePath = path.relative(
                ops.mimicCreateReactApp.pathsRelativeTo,
                sourcePath,
              );
            }
            if (ops.mimicCreateReactApp.pathsTransform) {
              sourcePath = ops.mimicCreateReactApp.pathsTransform(sourcePath);
            }
            code = code.replace(
              /export default SvgComponent;\n$/,
              `export const ReactComponent = SvgComponent;
              export default "${sourcePath}";`,
            );
          }
        }
        return parser(code, opts);
      },
    }],
  };
};
