import React from 'react';
import { render, screen } from '@testing-library/react';
import CodeGuardAI from './CodeGuard';

test('renders learn react link', () => {
  render(<CodeGuardAI />);
  const linkElement = screen.getByText(/learn react/i);
  expect(linkElement).toBeInTheDocument();
});
