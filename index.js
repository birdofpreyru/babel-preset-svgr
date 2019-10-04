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
        }
        return parser(code, opts);
      },
    }],
  };
};
