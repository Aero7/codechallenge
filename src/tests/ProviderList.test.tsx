import "@testing-library/jest-dom";
import { render, fireEvent, screen } from "@testing-library/react";
import ProviderList from "../components/ProviderList";
import sampleProviders from "../assets/sample-data.json";
import userEvent from "@testing-library/user-event";

describe("ProviderList", () => {
  it("renders the list and input", () => {
    render(
      <ProviderList
        providers={sampleProviders}
        onRemove={jest.fn()}
        onUpdateProviders={jest.fn()}
      />
    );
    expect(screen.getByText("Provider List")).toBeInTheDocument();
    expect(screen.getByTestId("regex-input")).toBeInTheDocument();
  });

  it("filters table rows based on input", () => {
    render(
      <ProviderList
        providers={sampleProviders}
        onRemove={jest.fn()}
        onUpdateProviders={jest.fn()}
      />
    );
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
    render(
      <ProviderList
        providers={sampleProviders}
        onRemove={jest.fn()}
        onUpdateProviders={jest.fn()}
      />
    );
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
    render(
      <ProviderList
        providers={sampleProviders}
        onRemove={jest.fn()}
        onUpdateProviders={jest.fn()}
      />
    );
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
    render(
      <ProviderList
        providers={sampleProviders}
        onRemove={jest.fn()}
        onUpdateProviders={jest.fn()}
      />
    );
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
    render(
      <ProviderList
        providers={sampleProviders}
        onRemove={onRemove}
        onUpdateProviders={jest.fn()}
      />
    );
    const firstCheckbox = screen.getByTestId("select-row-0");
    fireEvent.click(firstCheckbox);
    const removeBtn = screen.getByTestId("remove-btn");
    fireEvent.click(removeBtn);
    expect(onRemove).toHaveBeenCalledWith([0]);
  });

  it("disables Remove Selected button when no rows are selected", () => {
    render(
      <ProviderList
        providers={sampleProviders}
        onRemove={jest.fn()}
        onUpdateProviders={jest.fn()}
      />
    );
    const removeBtn = screen.getByTestId("remove-btn");
    expect(removeBtn).toBeDisabled();
  });

  it("enables Remove Selected button when at least one row is selected", () => {
    render(
      <ProviderList
        providers={sampleProviders}
        onRemove={jest.fn()}
        onUpdateProviders={jest.fn()}
      />
    );
    const firstCheckbox = screen.getByTestId("select-row-0");
    fireEvent.click(firstCheckbox);
    const removeBtn = screen.getByTestId("remove-btn");
    expect(removeBtn).not.toBeDisabled();
  });

  it("shows and updates sort key select and toggles sort direction with button", () => {
    render(
      <ProviderList
        providers={sampleProviders}
        onRemove={jest.fn()}
        onUpdateProviders={jest.fn()}
      />
    );
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
    render(
      <ProviderList
        providers={sampleProviders}
        onRemove={jest.fn()}
        onUpdateProviders={jest.fn()}
      />
    );
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
    render(
      <ProviderList
        providers={sampleProviders}
        onRemove={jest.fn()}
        onUpdateProviders={jest.fn()}
      />
    );
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
    render(
      <ProviderList
        providers={sampleProviders}
        onRemove={jest.fn()}
        onUpdateProviders={jest.fn()}
      />
    );
    const input = screen.getByTestId("regex-input");
    fireEvent.change(input, { target: { value: "zzzzzzzz" } });
    expect(screen.getByText(/no providers match/i)).toBeInTheDocument();
  });

  it("allows editing a cell in table view and updates the provider", async () => {
    const user = userEvent.setup();
    const onUpdateProviders = jest.fn();
    render(
      <ProviderList
        providers={sampleProviders}
        onRemove={jest.fn()}
        onUpdateProviders={onUpdateProviders}
      />
    );
    // Switch to table view
    fireEvent.click(screen.getByTestId("toggle-view-btn"));

    // Double click the first provider's first_name cell
    const cell = screen.getByTestId("cell-0-first_name");
    await user.dblClick(cell);

    // Should show input with current value
    const input = screen.getByTestId("cell-input-0-first_name");
    expect(input).toBeInTheDocument();

    // Change value and blur (simulate edit)
    await user.clear(input);
    await user.type(input, "EditedName");
    fireEvent.blur(input);

    // onUpdateProviders should be called with updated value
    expect(onUpdateProviders).toHaveBeenCalled();
    const updatedProviders = onUpdateProviders.mock.calls[0][0];
    expect(updatedProviders[0].first_name).toBe("EditedName");
  });

  it("allows editing a field in list view and updates the provider", async () => {
    const user = userEvent.setup();
    const onUpdateProviders = jest.fn();
    render(
      <ProviderList
        providers={sampleProviders}
        onRemove={jest.fn()}
        onUpdateProviders={onUpdateProviders}
      />
    );
    // List view is default

    // Double click the first provider's last_name in list view
    const cell = screen.getByTestId("cell-0-last_name");
    await user.dblClick(cell);

    // Should show input with current value
    const input = screen.getByTestId("cell-input-0-last_name");
    expect(input).toBeInTheDocument();

    // Change value and blur (simulate edit)
    await user.clear(input);
    await user.type(input, "EditedLast");
    fireEvent.blur(input);

    // onUpdateProviders should be called with updated value
    expect(onUpdateProviders).toHaveBeenCalled();
    const updatedProviders = onUpdateProviders.mock.calls[0][0];
    expect(updatedProviders[0].last_name).toBe("EditedLast");
  });

  it("cancels editing and does not save changes when Escape is pressed in edit cell", async () => {
    const user = userEvent.setup();
    const onUpdateProviders = jest.fn();
    render(
      <ProviderList
        providers={sampleProviders}
        onRemove={jest.fn()}
        onUpdateProviders={onUpdateProviders}
      />
    );
    // Switch to table view
    fireEvent.click(screen.getByTestId("toggle-view-btn"));

    // Double click the first provider's first_name cell
    const cell = screen.getByTestId("cell-0-first_name");
    await user.dblClick(cell);

    // Should show input with current value
    const input = screen.getByTestId("cell-input-0-first_name");
    expect(input).toBeInTheDocument();

    // Change value but press Escape instead of blur
    await user.clear(input);
    await user.type(input, "ShouldNotSave");
    fireEvent.keyDown(input, { key: "Escape", code: "Escape" });

    // Input should disappear and onUpdateProviders should NOT be called
    expect(screen.queryByTestId("cell-input-0-first_name")).not.toBeInTheDocument();
    expect(onUpdateProviders).not.toHaveBeenCalled();
  });
});
