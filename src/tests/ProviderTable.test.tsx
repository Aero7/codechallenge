import "@testing-library/jest-dom";
import { render, fireEvent, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import ProviderTable from "../components/ProviderTable";
import type { ProviderData } from "../App";
import { UNIQUE_SAMPLE_PROVIDERS } from "../constants";

function getDefaultProps(overrides = {}) {
  return {
    columns: [
      "last_name",
      "first_name",
      "email_address",
      "specialty",
      "practice_name",
    ] as (keyof ProviderData)[],
    sortedData: UNIQUE_SAMPLE_PROVIDERS.map((provider, idx) => ({
      provider,
      idx,
    })),
    selected: new Set<number>(),
    handleSelect: jest.fn(),
    handleSelectAll: jest.fn(),
    handleSort: jest.fn(),
    getSortIndicator: jest.fn(),
    editingCell: null,
    cellInput: "",
    handleCellDoubleClick: jest.fn(),
    handleCellInputChange: jest.fn(),
    handleCellInputBlur: jest.fn(),
    handleCellInputKeyDown: jest.fn(),
    ...overrides,
  };
}

describe("ProviderTable", () => {
  it("renders provider rows and checkboxes", () => {
    render(<ProviderTable {...getDefaultProps()} />);
    // Should render both providers' names
    expect(screen.getByText("Anderson")).toBeInTheDocument();
    expect(screen.getByText("Bennett")).toBeInTheDocument();
    // Should render checkboxes for each row
    expect(screen.getByTestId("select-row-0")).toBeInTheDocument();
    expect(screen.getByTestId("select-row-1")).toBeInTheDocument();
    // Should render select-all checkbox
    expect(screen.getByTestId("select-all")).toBeInTheDocument();
  });

  it("renders each provider", () => {
    render(<ProviderTable {...getDefaultProps()} />);
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

  it("calls handleSelect when a row checkbox is clicked", () => {
    const handleSelect = jest.fn();
    render(<ProviderTable {...getDefaultProps({ handleSelect })} />);
    fireEvent.click(screen.getByTestId("select-row-0"));
    expect(handleSelect).toHaveBeenCalledWith(0);
  });

  it("calls handleSelectAll when select-all checkbox is clicked", () => {
    const handleSelectAll = jest.fn();
    render(<ProviderTable {...getDefaultProps({ handleSelectAll })} />);
    fireEvent.click(screen.getByTestId("select-all"));
    expect(handleSelectAll).toHaveBeenCalled();
  });

  it("calls handleSort when a header is clicked", () => {
    const handleSort = jest.fn();
    render(<ProviderTable {...getDefaultProps({ handleSort })} />);
    fireEvent.click(screen.getByTestId("header-last_name"));
    expect(handleSort).toHaveBeenCalledWith("last_name");
  });

  it("calls handleCellDoubleClick when a field is double-clicked", async () => {
    const user = userEvent.setup();
    const handleCellDoubleClick = jest.fn();
    render(<ProviderTable {...getDefaultProps({ handleCellDoubleClick })} />);
    const cell = screen.getByTestId("cell-0-last_name");
    await user.dblClick(cell);
    expect(handleCellDoubleClick).toHaveBeenCalledWith(
      0,
      "last_name",
      "Anderson"
    );
  });

  it("renders input for editing when editingCell matches", () => {
    render(
      <ProviderTable
        {...getDefaultProps({
          editingCell: { row: 0, col: "last_name" },
          cellInput: "EditMe",
        })}
      />
    );
    const input = screen.getByTestId("cell-input-0-last_name");
    expect(input).toBeInTheDocument();
    expect(input).toHaveValue("EditMe");
  });

  it("calls handleCellInputChange, handleCellInputBlur, and handleCellInputKeyDown on input events", () => {
    const handleCellInputChange = jest.fn();
    const handleCellInputBlur = jest.fn();
    const handleCellInputKeyDown = jest.fn();
    render(
      <ProviderTable
        {...getDefaultProps({
          editingCell: { row: 0, col: "last_name" },
          cellInput: "EditMe",
          handleCellInputChange,
          handleCellInputBlur,
          handleCellInputKeyDown,
        })}
      />
    );
    const input = screen.getByTestId("cell-input-0-last_name");
    fireEvent.change(input, { target: { value: "NewValue" } });
    expect(handleCellInputChange).toHaveBeenCalled();

    fireEvent.blur(input);
    expect(handleCellInputBlur).toHaveBeenCalledWith(0, "last_name");

    fireEvent.keyDown(input, { key: "Enter", code: "Enter" });
    expect(handleCellInputKeyDown).toHaveBeenCalled();
  });
});
