import "@testing-library/jest-dom";
import { render, fireEvent, screen } from "@testing-library/react";
import RegexInput from "../components/RegexInput";

describe("RegexInput", () => {
  it("renders without error when no regex is provided", () => {
    const handleChange = jest.fn();
    render(<RegexInput value="" onChange={handleChange} />);
    expect(screen.getByTestId("regex-input")).toBeInTheDocument();
  });

  it("calls onChange when input changes", () => {
    const handleChange = jest.fn();
    render(<RegexInput value="" onChange={handleChange} />);
    fireEvent.change(screen.getByTestId("regex-input"), {
      target: { value: "abc" },
    });
    expect(handleChange).toHaveBeenCalledWith("abc");
  });

  it("shows error message when input does not match regex", () => {
    const handleChange = jest.fn();
    render(
      <RegexInput
        value="123"
        onChange={handleChange}
        regex={/^[a-zA-Z]+$/}
        errorMessage="Only letters allowed"
      />
    );
    const input = screen.getByTestId("regex-input");
    fireEvent.blur(input);
    expect(screen.getByTestId("error-message-input")).toHaveTextContent(
      "Only letters allowed"
    );
  });

  it("does not show error message when input matches regex", () => {
    const handleChange = jest.fn();
    render(
      <RegexInput
        value="abc"
        onChange={handleChange}
        regex={/^[a-zA-Z]+$/}
        errorMessage="Only letters allowed"
      />
    );
    const input = screen.getByTestId("regex-input");
    fireEvent.blur(input);
    expect(screen.queryByTestId("error-message-input")).toBeNull();
  });

  it("calls onBlur when input is blurred", () => {
    const handleBlur = jest.fn();
    render(<RegexInput value="abc" onChange={() => {}} onBlur={handleBlur} />);
    const input = screen.getByTestId("regex-input");
    fireEvent.blur(input);
    expect(handleBlur).toHaveBeenCalled();
  });

  it("calls onKeyDown when key is pressed", () => {
    const handleKeyDown = jest.fn();
    render(
      <RegexInput value="abc" onChange={() => {}} onKeyDown={handleKeyDown} />
    );
    const input = screen.getByTestId("regex-input");
    fireEvent.keyDown(input, { key: "Enter", code: "Enter" });
    expect(handleKeyDown).toHaveBeenCalled();
  });

  it("shows error as a popover when usePopover is true", () => {
    const handleChange = jest.fn();
    render(
      <RegexInput
        value="123"
        onChange={handleChange}
        regex={/^[a-zA-Z]+$/}
        errorMessage="Only letters allowed"
        usePopover
      />
    );
    const input = screen.getByTestId("regex-input");
    fireEvent.blur(input);
    expect(screen.getByTestId("popover-error-input")).toHaveTextContent(
      "Only letters allowed"
    );
  });

  it("does not show popover error if input is valid with usePopover", () => {
    const handleChange = jest.fn();
    render(
      <RegexInput
        value="abc"
        onChange={handleChange}
        regex={/^[a-zA-Z]+$/}
        errorMessage="Only letters allowed"
        usePopover
      />
    );
    const input = screen.getByTestId("regex-input");
    fireEvent.blur(input);
    expect(screen.queryByTestId("popover-error-input")).toBeNull();
  });

  it("resets touched if value is cleared/reset from parent", () => {
    const handleChange = jest.fn();
    const { rerender } = render(
      <RegexInput
        value="bad!"
        onChange={handleChange}
        regex={/^[a-zA-Z]+$/}
        errorMessage="Only letters allowed"
      />
    );
    const input = screen.getByTestId("regex-input");
    // Blur to set touched and show error
    fireEvent.blur(input);
    expect(screen.getByTestId("error-message-input")).toBeInTheDocument();

    // Now reset value from parent (simulate parent clearing the input)
    rerender(
      <RegexInput
        value=""
        onChange={handleChange}
        regex={/^[a-zA-Z]+$/}
        errorMessage="Only letters allowed"
      />
    );
    // Error message should disappear because touched is reset
    expect(screen.queryByTestId("error-message-input")).toBeNull();
  });
});
