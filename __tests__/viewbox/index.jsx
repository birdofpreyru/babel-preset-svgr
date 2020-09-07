/**
 * Tests the preset used without any options.
 */

import React from 'react';
import ReactDOM from 'react-dom/server';

import Logo1 from './logo-1.svg';
import Logo2 from './logo-2.svg';

test('SVG import works as expected', () => {
  let code = ReactDOM.renderToString(<Logo1 />);
  expect(code).toMatchSnapshot();
  code = ReactDOM.renderToString(<Logo2 />);
  expect(code).toMatchSnapshot();
});
