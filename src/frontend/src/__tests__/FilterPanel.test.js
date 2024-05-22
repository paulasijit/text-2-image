import React from 'react';
import { render, screen } from '@testing-library/react';
import FilterPanel from '../FilterPanel';

test('renders "Filter" text in FilterPanel component', () => {
    render(<FilterPanel />);
    const filterTextElement = screen.getByText(/Filter/i);
    expect(filterTextElement).toBeInTheDocument();
});
