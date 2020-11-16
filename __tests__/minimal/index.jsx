/**
 * Tests the preset used without any options.
 */

import ReactDOM from 'react-dom/server';

import Logo from './logo.svg';

test('SVG import works as expected', () => {
  const code = ReactDOM.renderToString(<Logo />);
  expect(code).toMatchSnapshot();
});
