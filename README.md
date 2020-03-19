![Latest NPM Release](https://img.shields.io/npm/v/@dr.pogodin/babel-preset-svgr.svg)
![Master Build Status](https://img.shields.io/circleci/project/github/birdofpreyru/babel-preset-svgr/master.svg?label=master)
![Dev Build Status](https://img.shields.io/circleci/project/github/birdofpreyru/babel-preset-svgr/develop.svg?label=develop)
![NPM monthly downloads](https://img.shields.io/npm/dm/@dr.pogodin/babel-preset-svgr)
[![Donate](https://img.shields.io/badge/PayPal-Gratuity_Is_Greately_Appreciated-brightgreen?logo=paypal)](https://www.paypal.com/cgi-bin/webscr?cmd=_s-xclick&hosted_button_id=WTB2P9S2WVB8N)

# Babel Preset SVGR

[SVGR](https://github.com/smooth-code/svgr) is the most popular library for
SVG images embed into React applications (~1.8M weekly downloads).
It provides SVG Webpack loader, Node API, and CLI tool, but there was no
way before to use it with Babel (see https://github.com/smooth-code/svgr/issues/306,
https://github.com/smooth-code/svgr/issues/252).

This preset allows to transform SVG files into React components with
SVGR and Babel. It works with any Babel setup (Babel CLI, `@babel/node`,
`@babel/register`, Webpack `babel-loader`). If you use Hot Module Reloading
in React, SVGs handled by this preset are correctly reloaded when changed.

### Content
- [Setup](#setup)
- [Under the hood](#under-the-hood)
- [Compatibility with Create React App](#compatibility-with-create-react-app)
- [Gratuity Is Greately Appreciated](#gratuity-is-greately-appreciated)

### Setup

1.  Install the preset `npm install --save-dev @dr.pogodin/babel-preset-svgr`
    (depending on your setup, you may need to use `--save` flag to save it as
    a regular dependency, rather than the development one).

2.  Add the preset to your Babel config, e.g.
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
      to keep `.svg` extensions only
      ([corresponding feature request in the Babel repo](https://github.com/babel/babel/issues/10551)).

### Under the Hood

This preset wraps the standard Babel parser into a simple logic which checks
for `.svg` extensions of input, and if met, it runs the input code through SVGR
before passing it to the Babel parser. For other file types it passes
the code directly into Babel parser.

If your project already depends on a customized Babel parser, you can provide
its path via the `parser` option of this preset. It will `require()` and use
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

By default this preset uses these SVGR options, following the library
recommendations:

```json
{
  "plugins": [
    "@svgr/plugin-svgo",
    "@svgr/plugin-jsx",
    "@svgr/plugin-prettier"
  ]
}
```

### Compatibility with Create React App

Create React App sets up webpack to transform SVG components in the following
way:

- The React component itself is exported as `ReactComponent` named export.
- The original SVG path is exported as the default export.

Thus, users import SVG assets like:
```js
import originalPath, { ReactComponent } from './asset.svg';
```

This preset mimics such behavior when `mimicCreateReactApp` option is set:
```js
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

By default, `originalPath` will be equal to the absolute path of each asset.
In some cases you may want in different, and to cover such cases an object with
additional options can be passed to `mimicCreateReactApp`:
```js
// .babelrc.js

module.exports = {
  presets: [
    '@babel/env',
    '@babel/react',
    ['@dr.pogodin/babel-preset-svgr', {
      mimicCreateReactApp: {
        pathsRelativeTo: __dirname,
        pathsTransform: (path) => `some/prefix/${path}`,
      },
    }],
  ],
};
```

- If `pathsRelativeTo` option is set, `originalPath` will be relative to its
  value. If `pathsRelativeTo` is relative, it is resolved from the current
  working directory.
- If `pathsTransform` options is set, it should be a function which takes one
  argument - the `originalPath`, and returns the path that should be output into
  the transformed SVG.

Of course, `__dirname` and functions can be used only inside JS variation of
Babel config, thus the example above displays `.babelrc.js` file, which can be
used instead of `.babelrc` starting from Babel@7.

### Gratuity Is Greately Appreciated

Should this preset be helpful to you, consider to make a donation to
the developer. Your support is greately appreciated and will help me to
work on my other open source projects:

- [React Global State](https://www.npmjs.com/package/@dr.pogodin/react-global-state)
- [React Themes](https://www.npmjs.com/package/@dr.pogodin/react-themes)
- [React Utils](https://www.npmjs.com/package/@dr.pogodin/react-utils)
- [React Starter](https://github.com/birdofpreyru/react-starter)

[![Donate](https://www.paypalobjects.com/en_US/ES/i/btn/btn_donateCC_LG.gif)](https://www.paypal.com/cgi-bin/webscr?cmd=_s-xclick&hosted_button_id=WTB2P9S2WVB8N)