![NPM monthly downloads](https://img.shields.io/npm/dm/@dr.pogodin/babel-preset-svgr?style=plastic)

# Babel Preset SVGR

[SVGR](https://github.com/smooth-code/svgr) is the most popular library for
inclusion of SVG graphics into React applications (~1.8M weekly downloads).
It provides SVGR Webpack loader, Node API, and CLI tool, but there was no
way before to use it with Babel (see https://github.com/smooth-code/svgr/issues/306,
https://github.com/smooth-code/svgr/issues/252).

This preset provides the way to transform SVG files into React components with
SVGR and Babel. It works with any Babel setup (Babel CLI, `@babel/node`,
`@babel/register`, Webpack `babel-loader`). If you use Hot Module Reloading
in React, SVGs processed with this preset are correctly reloaded when changed.

### Content
- [Setup](#setup)
- [Under the hood](#under-the-hood)
- [Compatibility with Create React App](#compatibility-with-create-react-app)

### Setup

1.  Install the preset `npm install --save-dev @dr.pogodin/babel-preset-svgr`
    (depending on your setup, you may need to use `--save` flag to save it as
    a regular dependency, rather than a development one).

2.  Adds the preset to your Babel config, e.g.
    ```json
    {
      "presets": [
        "@babel/env",
        "@babel/react",
        "@dr.pogodin/babel-preset-svgr"
      ]
    }
    ```

3.  Instruct Babel to transform SVG files.

    - If you use Webpack and `babel-loader`, add SVG rule inside Webpack config
      as:
      ```js
      module.exports = {
        module: {
          rules: [{
            test: /\.(jsx?|svg)$/
            exclude: [/node_modules/],
            loader: 'babel-loader',
            options: {
              /* babel-loader options */
            }
          }]
        }
      }
      ```
      With such setup you don't need to use `@svgr/webpack` loader for SVG files,
      Babel will take care about everything.

    - If you use `@babel/node`, or `@babel/register` you need to add `.svg` into
      their `extensions` option. For `@babel/node` use the flag
      `--extensions '.js','.jsx','.svg'`, for `@babel/register` use
      `extensions: ['.js', '.jsx', '.svg']` array inside the options object.

    - If you use Babel CLI and specify individual file(s) to compile, it will
      work out of the box for SVGs. If you use it to compile entire directories
      you'll need a dedicated compilation pass for SVG files with the flags
      `--extensions '.svg' --keep-file-extensions`. In this dedicated pass
      Babel will only compile SVG assets, and it will keep their extensions.
      In a separate pass you'll compile JS(X) files as usual. The dedicated
      pass is necessary, as Babel currently either replaces all output file
      extensions to `.js`, or keeps all original ones. In our case we need
      to keep `.svg` extensions only.

### Under the Hood

This preset wraps the standard Babel parser into a simple logic that checks
for `.svg` extensions of input, and if met, it runs input code through SVGR
before passing it to the Babel parser. For other file types it just passes
the code into Babel parser directly.

If your project already depends on a customized Babel parser, you can pass
its path into `parser` option of this preset. It will `require()` and use
your parser then.

You also can pass in custom SVGR options via `svgr` field.

Example of options usage:

```json
{
  "presets": [
    "@babel/env",
    "@babel/react",
    ["@dr.pogodin/babel-preset-svgr", {
      "parser": "custom-babel-parser",
      "mimicCreateReactApp": true,
      "svgr": {
        "plugins": []
      }
    }]
  ]
}
```

### Compatibility with Create React App

Create React App set ups webpack to transform SVG components in the following
way:

- The react component itself is exported as `ReactComponent` named export.
- The original SVG path is exported as the default export.

Thus, the users export SVG assets like:
```js
import originalPath, { ReactComponent } from './asset.svg';
```

This preset mimics such behavior when `mimicCreateReactApp` option is set:
```json
{
  "presets": [
    "@babel/env",
    "@babel/react",
    ["@dr.pogodin/babel-preset-svgr", {
      "mimicCreateReactApp": true
    }]
  ]
}
```