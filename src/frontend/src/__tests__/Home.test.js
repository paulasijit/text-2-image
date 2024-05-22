import React from 'react';
import { render, screen } from '@testing-library/react';
import Home from '../HomePage';

test('renders Home component', () => {
  render(<Home />);
  const linkElement = screen.getByText(/Why use us?/i);
  expect(linkElement).toBeInTheDocument();
});

test('renders Home component', () => {
    render(<Home />);
    const linkElement = screen.getByText(/Why use us?/i);
    expect(linkElement).toBeInTheDocument();
  });