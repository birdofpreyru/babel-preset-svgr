/**
 * Tests the preset used without any options.
 */

import React from 'react';
import ReactDOM from 'react-dom/server';

import logoPath, { ReactComponent } from './logo.svg';

const EXPECTED_LOGO_PATH = 'some/prefix/logo.svg';

test('SVG import works as expected', () => {
  expect(logoPath).toBe(EXPECTED_LOGO_PATH);
  const code = ReactDOM.renderToString(<ReactComponent />);
  expect(code).toMatchSnapshot();
});
