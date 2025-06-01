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
});
