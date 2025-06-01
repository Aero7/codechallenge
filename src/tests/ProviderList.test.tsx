import "@testing-library/jest-dom";
import { render, fireEvent, screen } from "@testing-library/react";
import ProviderList from "../components/ProviderList";
import sampleProviders from "../assets/sample-data.json";

describe("ProviderList", () => {
  it("renders the table and input", () => {
    render(<ProviderList providers={sampleProviders} onRemove={jest.fn()} />);
    expect(screen.getByText("Provider List")).toBeInTheDocument();
    expect(screen.getByTestId("regex-input")).toBeInTheDocument();
  });

  it("filters table rows based on input", () => {
    render(<ProviderList providers={sampleProviders} onRemove={jest.fn()} />);
    const input = screen.getByTestId("regex-input");
    fireEvent.change(input, { target: { value: "Mike" } });
    expect(screen.getAllByText("Mike").length).toBeGreaterThan(0);
  });

  it("sorts by last name ascending and descending", () => {
    render(<ProviderList providers={sampleProviders} onRemove={jest.fn()} />);
    const header = screen.getByTestId("header-last_name");
    let rows = screen.getAllByRole("row");
    // The first data row should have the alphabetically first last name (default)
    expect(rows[1].children[1].textContent).toBe(
      [...rows]
        .slice(1)
        .map((row) => row.children[1].textContent)
        .sort()[0]
    );
    fireEvent.click(header);
    rows = screen.getAllByRole("row");
    // The first data row should now have the alphabetically last last name
    expect(rows[1].children[1].textContent).toBe(
      [...rows]
        .slice(1)
        .map((row) => row.children[1].textContent)
        .sort()
        .reverse()[0]
    );
  });

  it("can select and deselect individual rows", () => {
    render(<ProviderList providers={sampleProviders} onRemove={jest.fn()} />);
    const firstCheckbox = screen.getByTestId(
      "select-row-0"
    ) as HTMLInputElement;
    expect(firstCheckbox.checked).toBe(false);
    fireEvent.click(firstCheckbox);
    expect(firstCheckbox.checked).toBe(true);
    fireEvent.click(firstCheckbox);
    expect(firstCheckbox.checked).toBe(false);
  });

  it("can select and deselect all rows", () => {
    render(<ProviderList providers={sampleProviders} onRemove={jest.fn()} />);
    const selectAll = screen.getByTestId("select-all") as HTMLInputElement;
    fireEvent.click(selectAll);
    const checkboxes = sampleProviders.map(
      (_, idx) => screen.getByTestId(`select-row-${idx}`) as HTMLInputElement
    );
    checkboxes.forEach((cb) => expect(cb.checked).toBe(true));
    fireEvent.click(selectAll);
    checkboxes.forEach((cb) => expect(cb.checked).toBe(false));
  });

  it("calls onRemove with selected indexes when Remove Selected is clicked", () => {
    const onRemove = jest.fn();
    render(<ProviderList providers={sampleProviders} onRemove={onRemove} />);
    const firstCheckbox = screen.getByTestId("select-row-0");
    fireEvent.click(firstCheckbox);
    const removeBtn = screen.getByTestId("remove-btn");
    fireEvent.click(removeBtn);
    expect(onRemove).toHaveBeenCalledWith([0]);
  });

  it("disables Remove Selected button when no rows are selected", () => {
    render(<ProviderList providers={sampleProviders} onRemove={jest.fn()} />);
    const removeBtn = screen.getByTestId("remove-btn");
    expect(removeBtn).toBeDisabled();
  });

  it("enables Remove Selected button when at least one row is selected", () => {
    render(<ProviderList providers={sampleProviders} onRemove={jest.fn()} />);
    const firstCheckbox = screen.getByTestId("select-row-0");
    fireEvent.click(firstCheckbox);
    const removeBtn = screen.getByTestId("remove-btn");
    expect(removeBtn).not.toBeDisabled();
  });

  it("shows and updates sort key and direction dropdowns", () => {
    render(<ProviderList providers={sampleProviders} onRemove={jest.fn()} />);
    const sortKeySelect = screen.getByTestId(
      "sort-key-select"
    ) as HTMLSelectElement;
    const sortDirectionSelect = screen.getByTestId(
      "sort-direction-select"
    ) as HTMLSelectElement;

    // Default values
    expect(sortKeySelect.value).toBe("last_name");
    expect(sortDirectionSelect.value).toBe("asc");

    // Change sort key to first_name
    fireEvent.change(sortKeySelect, { target: { value: "first_name" } });
    expect(sortKeySelect.value).toBe("first_name");

    // Change sort direction to descending
    fireEvent.change(sortDirectionSelect, { target: { value: "desc" } });
    expect(sortDirectionSelect.value).toBe("desc");

    // Changing sort key should reset direction to asc if implemented that way,
    // but in our code, it only changes the key, so direction stays as set.
    fireEvent.change(sortKeySelect, { target: { value: "email_address" } });
    expect(sortKeySelect.value).toBe("email_address");
    expect(sortDirectionSelect.value).toBe("desc");
  });

  it("sorts table rows according to selected sort key and direction", () => {
    render(<ProviderList providers={sampleProviders} onRemove={jest.fn()} />);
    const sortKeySelect = screen.getByTestId(
      "sort-key-select"
    ) as HTMLSelectElement;
    const sortDirectionSelect = screen.getByTestId(
      "sort-direction-select"
    ) as HTMLSelectElement;

    // Sort by first_name ascending
    fireEvent.change(sortKeySelect, { target: { value: "first_name" } });
    fireEvent.change(sortDirectionSelect, { target: { value: "asc" } });
    let rows = screen.getAllByRole("row");
    const firstNamesAsc = [...rows]
      .slice(1)
      .map((row) => row.children[2].textContent);
    const sortedAsc = [...firstNamesAsc].sort();
    expect(firstNamesAsc).toEqual(sortedAsc);

    // Sort by first_name descending
    fireEvent.change(sortDirectionSelect, { target: { value: "desc" } });
    rows = screen.getAllByRole("row");
    const firstNamesDesc = [...rows]
      .slice(1)
      .map((row) => row.children[2].textContent);
    const sortedDesc = [...firstNamesDesc].sort().reverse();
    expect(firstNamesDesc).toEqual(sortedDesc);
  });
});
