/**
 * Babel plugin for SVGR's @svgr/plugin-jsx. It transforms exports of JSX
 * components created from SVGs to follow the pattern used by Create React App:
 * - The SVG component is exposed as a named ReactComponent export;
 * - Path of the original SVG is exposed as the default export.
 */

/* global module, require */

const path = require('path');

/**
 * Deduces the source path to inject into the component.
 * @param {object} ops Plugin options.
 * @return {string} Source path to inject.
 */
function deduceSourcePath(ops) {
  let sourcePath = ops.sourceFileName;
  if (ops.pathsRelativeTo) {
    sourcePath = path.relative(ops.pathsRelativeTo, sourcePath);
  }
  if (ops.pathsTransform) {
    sourcePath = ops.pathsTransform(sourcePath);
  }
  return sourcePath;
}

module.exports = function /* MimicCRA */ ({ types: t }) {
  return {
    visitor: {
      ExportDeclaration(p, state) {
        const { name } = p.node.declaration;
        const sourcePath = deduceSourcePath(state.opts);
        p.replaceWith(
          t.exportDefaultDeclaration(t.stringLiteral(sourcePath)),
        );
        p.insertAfter(
          t.exportNamedDeclaration(
            null,
            [
              t.exportSpecifier(
                t.identifier(name),
                t.identifier('ReactComponent'),
              ),
            ],
          ),
        );
        p.stop();
      },
    },
  };
};
