import "@testing-library/jest-dom";
import { render, fireEvent, screen } from "@testing-library/react";
import ProviderList from "../components/ProviderList";
import sampleProviders from "../assets/sample-data.json";
import { UNIQUE_SAMPLE_PROVIDERS } from "../constants";

describe("ProviderList", () => {
  it("renders the list and input", () => {
    render(<ProviderList providers={sampleProviders} onRemove={jest.fn()} />);
    expect(screen.getByText("Provider List")).toBeInTheDocument();
    expect(screen.getByTestId("regex-input")).toBeInTheDocument();
  });

  it("filters table rows based on input", () => {
    render(<ProviderList providers={sampleProviders} onRemove={jest.fn()} />);
    // Switch to table view
    fireEvent.click(screen.getByTestId("toggle-view-btn"));
    // Initially, all providers should be visible
    expect(screen.getByText("Nate")).toBeInTheDocument();
    // Filter by first name 'Mike'
    const input = screen.getByTestId("regex-input");
    fireEvent.change(input, { target: { value: "Mike" } });
    // After filtering, only providers with 'Mike' in their name should be visible
    expect(screen.getAllByText("Mike").length).toBeGreaterThan(0);
    expect(screen.queryByText("Nate")).toBeNull();
  });

  it("sorts by last name ascending and descending", () => {
    render(<ProviderList providers={sampleProviders} onRemove={jest.fn()} />);
    // Switch to table view
    fireEvent.click(screen.getByTestId("toggle-view-btn"));
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

  it("shows and updates sort key select and toggles sort direction with button", () => {
    render(<ProviderList providers={sampleProviders} onRemove={jest.fn()} />);
    const sortKeySelect = screen.getByTestId(
      "sort-key-select"
    ) as HTMLSelectElement;
    const sortDirectionToggle = screen.getByTestId(
      "sort-direction-toggle"
    ) as HTMLButtonElement;

    // Default values
    expect(sortKeySelect.value).toBe("last_name");
    expect(sortDirectionToggle).toHaveTextContent("▲");

    // Change sort key to first_name
    fireEvent.change(sortKeySelect, { target: { value: "first_name" } });
    expect(sortKeySelect.value).toBe("first_name");

    // Toggle sort direction to descending
    fireEvent.click(sortDirectionToggle);
    expect(sortDirectionToggle).toHaveTextContent("▼");

    // Toggle back to ascending
    fireEvent.click(sortDirectionToggle);
    expect(sortDirectionToggle).toHaveTextContent("▲");
  });

  it("sorts table rows according to selected sort key and direction", () => {
    render(<ProviderList providers={sampleProviders} onRemove={jest.fn()} />);
    // Switch to table view
    fireEvent.click(screen.getByTestId("toggle-view-btn"));
    const sortKeySelect = screen.getByTestId(
      "sort-key-select"
    ) as HTMLSelectElement;
    const sortDirectionToggle = screen.getByTestId(
      "sort-direction-toggle"
    ) as HTMLButtonElement;

    // Sort by first_name ascending
    fireEvent.change(sortKeySelect, { target: { value: "first_name" } });
    let rows = screen.getAllByRole("row");
    const firstNamesAsc = [...rows]
      .slice(1)
      .map((row) => row.children[2].textContent);
    const sortedAsc = [...firstNamesAsc].sort();
    expect(firstNamesAsc).toEqual(sortedAsc);

    // Sort by first_name descending
    fireEvent.click(sortDirectionToggle);
    rows = screen.getAllByRole("row");
    const firstNamesDesc = [...rows]
      .slice(1)
      .map((row) => row.children[2].textContent);
    const sortedDesc = [...firstNamesDesc].sort().reverse();
    expect(firstNamesDesc).toEqual(sortedDesc);
  });

  it("renders list view by default and toggles to table view", () => {
    render(<ProviderList providers={sampleProviders} onRemove={jest.fn()} />);
    // Table view should be default
    expect(screen.getByTestId("toggle-view-btn")).toHaveTextContent(
      "Table View"
    );

    // List should be in the document
    expect(screen.getByTestId("provider-list")).toBeInTheDocument();

    // Toggle to table view
    fireEvent.click(screen.getByTestId("toggle-view-btn"));
    expect(screen.getByTestId("toggle-view-btn")).toHaveTextContent(
      "List View"
    );

    // Table should be in the document
    expect(screen.getByTestId("provider-table")).toBeInTheDocument();
  });

  it("shows empty state when no providers match the filter", () => {
    render(<ProviderList providers={sampleProviders} onRemove={jest.fn()} />);
    const input = screen.getByTestId("regex-input");
    fireEvent.change(input, { target: { value: "zzzzzzzz" } });
    expect(screen.getByText(/no providers match/i)).toBeInTheDocument();
  });

  it("renders each provider in table view", () => {
    render(
      <ProviderList providers={UNIQUE_SAMPLE_PROVIDERS} onRemove={jest.fn()} />
    );
    // Switch to table view
    fireEvent.click(screen.getByTestId("toggle-view-btn"));
    // Each provider should have a row in the table (excluding header)
    const rows = screen.getAllByRole("row").slice(1);
    expect(rows.length).toBe(UNIQUE_SAMPLE_PROVIDERS.length);
    UNIQUE_SAMPLE_PROVIDERS.forEach((provider) => {
      expect(screen.getByText(provider.first_name)).toBeInTheDocument();
      expect(screen.getByText(provider.last_name)).toBeInTheDocument();
      expect(screen.getByText(provider.email_address)).toBeInTheDocument();
      expect(screen.getByText(provider.specialty)).toBeInTheDocument();
      expect(screen.getByText(provider.practice_name)).toBeInTheDocument();
    });
  });

  it("renders each provider in list view", () => {
    render(
      <ProviderList providers={UNIQUE_SAMPLE_PROVIDERS} onRemove={jest.fn()} />
    );
    // List view is default
    UNIQUE_SAMPLE_PROVIDERS.forEach((provider) => {
      expect(
        screen.getByText(provider.last_name + ", " + provider.first_name)
      ).toBeInTheDocument();
      expect(screen.getByText(provider.email_address)).toBeInTheDocument();
      expect(screen.getByText(provider.specialty)).toBeInTheDocument();
      expect(screen.getByText(provider.practice_name)).toBeInTheDocument();
    });
  });
});
