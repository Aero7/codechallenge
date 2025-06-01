import '@testing-library/jest-dom';
import { render, fireEvent, screen } from '@testing-library/react';
import ProviderTable from '../components/ProviderTable';
import sampleProviders from '../assets/sample-data.json';

describe('ProviderTable', () => {
  it('renders the table and input', () => {
    render(<ProviderTable providers={sampleProviders} />);
    expect(screen.getByText('Provider Table')).toBeInTheDocument();
    expect(screen.getByTestId('regex-input')).toBeInTheDocument();
  });

  it('filters table rows based on input', () => {
    render(<ProviderTable providers={sampleProviders} />);
    const input = screen.getByTestId('regex-input');
    fireEvent.change(input, { target: { value: 'Mike' } });
    expect(screen.getAllByText('Mike').length).toBeGreaterThan(0);
  });

  it('sorts by last name ascending and descending', () => {
    render(<ProviderTable providers={sampleProviders} />);
    const header = screen.getByTestId('header-last_name');
    let rows = screen.getAllByRole('row');
    console.log([...rows].slice(1).map(row => row.children[0].textContent)); // Log last names for debugging

    // The first data row should have the alphabetically first last name (default)
    expect(rows[1].children[0].textContent).toBe(
      [...rows].slice(1).map(row => row.children[0].textContent).sort()[0]
    );

    fireEvent.click(header);
    rows = screen.getAllByRole('row');
    console.log([...rows].slice(1).map(row => row.children[0].textContent)); // Log last names for debugging

    // The first data row should now have the alphabetically last last name
    expect(rows[1].children[0].textContent).toBe(
      [...rows].slice(1).map(row => row.children[0].textContent).sort().reverse()[0]
    );
  });
});