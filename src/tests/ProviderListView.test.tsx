import "@testing-library/jest-dom";
import { render, fireEvent, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import ProviderListView from "../components/ProviderListView";
import { UNIQUE_SAMPLE_PROVIDERS } from "../constants";

function getDefaultProps(overrides = {}) {
  return {
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

describe("ProviderListView", () => {
  it("renders provider rows and checkboxes", () => {
    render(<ProviderListView {...getDefaultProps()} />);
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
    render(<ProviderListView {...getDefaultProps()} />);
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
    render(<ProviderListView {...getDefaultProps({ handleSelect })} />);
    fireEvent.click(screen.getByTestId("select-row-0"));
    expect(handleSelect).toHaveBeenCalledWith(0);
  });

  it("calls handleSelectAll when select-all checkbox is clicked", () => {
    const handleSelectAll = jest.fn();
    render(<ProviderListView {...getDefaultProps({ handleSelectAll })} />);
    fireEvent.click(screen.getByTestId("select-all"));
    expect(handleSelectAll).toHaveBeenCalled();
  });

  it("calls handleCellDoubleClick when a field is double-clicked", async () => {
    const user = userEvent.setup();
    const handleCellDoubleClick = jest.fn();
    render(
      <ProviderListView {...getDefaultProps({ handleCellDoubleClick })} />
    );
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
      <ProviderListView
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
      <ProviderListView
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

  it("renders specialty and practice_name fields for each provider", () => {
    render(<ProviderListView {...getDefaultProps()} />);
    UNIQUE_SAMPLE_PROVIDERS.forEach((provider, idx) => {
      expect(screen.getByTestId(`cell-${idx}-specialty`)).toHaveTextContent(
        provider.specialty
      );
      expect(screen.getByTestId(`cell-${idx}-practice_name`)).toHaveTextContent(
        provider.practice_name
      );
    });
  });

  it("calls handleCellDoubleClick for specialty and practice_name on double click", async () => {
    const user = userEvent.setup();
    const handleCellDoubleClick = jest.fn();
    render(
      <ProviderListView {...getDefaultProps({ handleCellDoubleClick })} />
    );
    // Specialty
    const specialtyCell = screen.getByTestId("cell-0-specialty");
    await user.dblClick(specialtyCell);
    expect(handleCellDoubleClick).toHaveBeenCalledWith(
      0,
      "specialty",
      UNIQUE_SAMPLE_PROVIDERS[0].specialty
    );
    // Practice Name
    const practiceCell = screen.getByTestId("cell-0-practice_name");
    await user.dblClick(practiceCell);
    expect(handleCellDoubleClick).toHaveBeenCalledWith(
      0,
      "practice_name",
      UNIQUE_SAMPLE_PROVIDERS[0].practice_name
    );
  });

  it("renders input for specialty and practice_name when editingCell matches", () => {
    // Specialty
    render(
      <ProviderListView
        {...getDefaultProps({
          editingCell: { row: 0, col: "specialty" },
          cellInput: "EditSpecialty",
        })}
      />
    );
    const specialtyInput = screen.getByTestId("cell-input-0-specialty");
    expect(specialtyInput).toBeInTheDocument();
    expect(specialtyInput).toHaveValue("EditSpecialty");

    // Practice Name
    render(
      <ProviderListView
        {...getDefaultProps({
          editingCell: { row: 0, col: "practice_name" },
          cellInput: "EditPractice",
        })}
      />
    );
    const practiceInput = screen.getByTestId("cell-input-0-practice_name");
    expect(practiceInput).toBeInTheDocument();
    expect(practiceInput).toHaveValue("EditPractice");
  });

  it("calls handleCellInputChange, handleCellInputBlur, and handleCellInputKeyDown for specialty and practice_name inputs", () => {
    const handleCellInputChange = jest.fn();
    const handleCellInputBlur = jest.fn();
    const handleCellInputKeyDown = jest.fn();

    // Specialty
    render(
      <ProviderListView
        {...getDefaultProps({
          editingCell: { row: 0, col: "specialty" },
          cellInput: "EditSpecialty",
          handleCellInputChange,
          handleCellInputBlur,
          handleCellInputKeyDown,
        })}
      />
    );
    const specialtyInput = screen.getByTestId("cell-input-0-specialty");
    fireEvent.change(specialtyInput, { target: { value: "NewSpecialty" } });
    expect(handleCellInputChange).toHaveBeenCalled();

    fireEvent.blur(specialtyInput);
    expect(handleCellInputBlur).toHaveBeenCalledWith(0, "specialty");

    fireEvent.keyDown(specialtyInput, { key: "Enter", code: "Enter" });
    expect(handleCellInputKeyDown).toHaveBeenCalled();

    // Practice Name
    render(
      <ProviderListView
        {...getDefaultProps({
          editingCell: { row: 0, col: "practice_name" },
          cellInput: "EditPractice",
          handleCellInputChange,
          handleCellInputBlur,
          handleCellInputKeyDown,
        })}
      />
    );
    const practiceInput = screen.getByTestId("cell-input-0-practice_name");
    fireEvent.change(practiceInput, { target: { value: "NewPractice" } });
    expect(handleCellInputChange).toHaveBeenCalled();

    fireEvent.blur(practiceInput);
    expect(handleCellInputBlur).toHaveBeenCalledWith(0, "practice_name");

    fireEvent.keyDown(practiceInput, { key: "Enter", code: "Enter" });
    expect(handleCellInputKeyDown).toHaveBeenCalled();
  });
});
