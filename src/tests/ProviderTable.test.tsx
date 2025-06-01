import '@testing-library/jest-dom';
import { render, fireEvent, screen } from '@testing-library/react';
import ProviderTable from '../components/ProviderTable';
import sampleProviders from '../assets/sample-data.json';

describe('ProviderTable', () => {
  it('renders the table and input', () => {
    render(<ProviderTable providers={sampleProviders} removeProviders={jest.fn()} />);
    expect(screen.getByText('Provider Table')).toBeInTheDocument();
    expect(screen.getByTestId('regex-input')).toBeInTheDocument();
  });

  it('filters table rows based on input', () => {
    render(<ProviderTable providers={sampleProviders} removeProviders={jest.fn()} />);
    const input = screen.getByTestId('regex-input');
    fireEvent.change(input, { target: { value: 'Mike' } });
    expect(screen.getAllByText('Mike').length).toBeGreaterThan(0);
  });

  it('sorts by last name ascending and descending', () => {
    render(<ProviderTable providers={sampleProviders} removeProviders={jest.fn()} />);
    const header = screen.getByTestId('header-last_name');
    let rows = screen.getAllByRole('row');
    // The first data row should have the alphabetically first last name (default)
    expect(rows[1].children[1].textContent).toBe(
      [...rows].slice(1).map(row => row.children[1].textContent).sort()[0]
    );
    fireEvent.click(header);
    rows = screen.getAllByRole('row');
    // The first data row should now have the alphabetically last last name
    expect(rows[1].children[1].textContent).toBe(
      [...rows].slice(1).map(row => row.children[1].textContent).sort().reverse()[0]
    );
  });

  it('can select and deselect individual rows', () => {
    render(<ProviderTable providers={sampleProviders} removeProviders={jest.fn()} />);
    const firstCheckbox = screen.getByTestId('select-row-0') as HTMLInputElement;
    expect(firstCheckbox.checked).toBe(false);
    fireEvent.click(firstCheckbox);
    expect(firstCheckbox.checked).toBe(true);
    fireEvent.click(firstCheckbox);
    expect(firstCheckbox.checked).toBe(false);
  });

  it('can select and deselect all rows', () => {
    render(<ProviderTable providers={sampleProviders} removeProviders={jest.fn()} />);
    const selectAll = screen.getByTestId('select-all') as HTMLInputElement;
    fireEvent.click(selectAll);
    const checkboxes = sampleProviders.map((_, idx) =>
      screen.getByTestId(`select-row-${idx}`) as HTMLInputElement
    );
    checkboxes.forEach(cb => expect(cb.checked).toBe(true));
    fireEvent.click(selectAll);
    checkboxes.forEach(cb => expect(cb.checked).toBe(false));
  });

  it('calls removeProviders with selected indexes when Remove Selected is clicked', () => {
    const removeProviders = jest.fn();
    render(<ProviderTable providers={sampleProviders} removeProviders={removeProviders} />);
    const firstCheckbox = screen.getByTestId('select-row-0');
    fireEvent.click(firstCheckbox);
    const removeBtn = screen.getByTestId('remove-btn');
    fireEvent.click(removeBtn);
    expect(removeProviders).toHaveBeenCalledWith([0]);
  });

  it('disables Remove Selected button when no rows are selected', () => {
    render(<ProviderTable providers={sampleProviders} removeProviders={jest.fn()} />);
    const removeBtn = screen.getByTestId('remove-btn');
    expect(removeBtn).toBeDisabled();
  });

  it('enables Remove Selected button when at least one row is selected', () => {
    render(<ProviderTable providers={sampleProviders} removeProviders={jest.fn()} />);
    const firstCheckbox = screen.getByTestId('select-row-0');
    fireEvent.click(firstCheckbox);
    const removeBtn = screen.getByTestId('remove-btn');
    expect(removeBtn).not.toBeDisabled();
  });
});