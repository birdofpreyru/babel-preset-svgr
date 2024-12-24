/** @jest-environment jsdom */

import { useEffect, useRef } from 'react';

import { render } from '@testing-library/react';

import Logo from './logo.svg';

function Component() {
  const ref = useRef();
  useEffect(() => {
    expect(ref.current).toBeDefined();
  });
  return <Logo ref={ref} />;
}

test('`ref` prop is supported', () => {
  const { asFragment } = render(<Component />);
  expect(asFragment()).toMatchSnapshot();
});
