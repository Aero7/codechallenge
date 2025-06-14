import "@testing-library/jest-dom";
import { render, fireEvent, screen } from "@testing-library/react";
import ProviderForm, { REQUIRED_FIELDS } from "../components/ProviderForm";
import {
  PROVIDER_FIELD_TITLES,
  PROVIDER_INPUT_ERROR_MESSAGES,
} from "../constants";

const fillForm = (fields: Record<string, string>) => {
  Object.entries(fields).forEach(([key, value]) => {
    const input = screen.getByPlaceholderText(
      new RegExp(key.replace("_", " "), "i")
    ) as HTMLInputElement;
    fireEvent.change(input, { target: { value } });
    fireEvent.blur(input);
  });
};

describe("ProviderForm", () => {
  it("renders all input fields and submit button", () => {
    render(<ProviderForm onSubmit={jest.fn()} />);
    expect(screen.getByPlaceholderText(/last name/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/first name/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/email address/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/specialty/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/practice name/i)).toBeInTheDocument();
    expect(screen.getByTestId("submit-btn")).toBeInTheDocument();
  });

  it("shows error messages for invalid input", () => {
    render(<ProviderForm onSubmit={jest.fn()} />);
    fireEvent.change(screen.getByPlaceholderText(/email address/i), {
      target: { value: "invalid" },
    });
    fireEvent.blur(screen.getByPlaceholderText(/email address/i));
    expect(
      screen.getByText(PROVIDER_INPUT_ERROR_MESSAGES["email_address"])
    ).toBeInTheDocument();
  });

  it("shows error messages for required fields when empty", () => {
    render(<ProviderForm onSubmit={jest.fn()} />);
    // Touch and blur required fields without entering values
    REQUIRED_FIELDS.forEach((field) => {
      const input = screen.getByPlaceholderText(PROVIDER_FIELD_TITLES[field]);
      fireEvent.blur(input);
      expect(screen.getByTestId("error-message-" + field)).toBeInTheDocument();
    });
  });

  it("enables submit button only when all required fields are filled", () => {
    render(<ProviderForm onSubmit={jest.fn()} />);
    expect(screen.getByTestId("submit-btn")).toBeDisabled();

    // Missing required field
    fillForm({
      last_name: "",
      first_name: "John",
      email_address: "john@smith.com",
      specialty: "Cardiology",
      practice_name: "Smith Clinic",
    });
    expect(screen.getByTestId("submit-btn")).toBeDisabled();

    // Missing required field
    fillForm({
      last_name: "Smith",
      first_name: "",
      email_address: "john@smith.com",
      specialty: "Cardiology",
      practice_name: "Smith Clinic",
    });
    expect(screen.getByTestId("submit-btn")).toBeDisabled();

    // Missing required field
    fillForm({
      last_name: "Smith",
      first_name: "John",
      email_address: "",
      specialty: "Cardiology",
      practice_name: "Smith Clinic",
    });
    expect(screen.getByTestId("submit-btn")).toBeDisabled();

    // All required fields filled and valid
    fillForm({
      last_name: "Smith",
      first_name: "John",
      email_address: "john@smith.com",
      specialty: "Cardiology",
      practice_name: "Smith Clinic",
    });
    expect(screen.getByTestId("submit-btn")).not.toBeDisabled();
  });

  it("calls onSubmit with correct data when form is valid and submitted", () => {
    const handleSubmit = jest.fn();
    render(<ProviderForm onSubmit={handleSubmit} />);
    fillForm({
      last_name: "Smith",
      first_name: "John",
      email_address: "john@smith.com",
      specialty: "Cardiology",
      practice_name: "Smith Clinic",
    });
    fireEvent.click(screen.getByTestId("submit-btn"));
    expect(handleSubmit).toHaveBeenCalledWith({
      last_name: "Smith",
      first_name: "John",
      email_address: "john@smith.com",
      specialty: "Cardiology",
      practice_name: "Smith Clinic",
    });
  });

  it("clears the form after successful submit", () => {
    const handleSubmit = jest.fn();
    render(<ProviderForm onSubmit={handleSubmit} />);
    fillForm({
      last_name: "Smith",
      first_name: "John",
      email_address: "john@smith.com",
      specialty: "Cardiology",
      practice_name: "Smith Clinic",
    });
    fireEvent.click(screen.getByTestId("submit-btn"));
    expect(
      (screen.getByPlaceholderText(/last name/i) as HTMLInputElement).value
    ).toBe("");
  });

  it("disables submit button when any required field is invalid", () => {
    render(<ProviderForm onSubmit={jest.fn()} />);

    // Invalid email
    fillForm({
      last_name: "Smith",
      first_name: "John",
      email_address: "not-an-email",
      specialty: "Cardiology",
      practice_name: "Smith Clinic",
    });
    expect(screen.getByTestId("submit-btn")).toBeDisabled();

    // Invalid first name (too short)
    fillForm({
      last_name: "Smith",
      first_name: "J",
      email_address: "john@smith.com",
      specialty: "Cardiology",
      practice_name: "Smith Clinic",
    });
    expect(screen.getByTestId("submit-btn")).toBeDisabled();

    // Invalid last name (wriong characters)
    fillForm({
      last_name: "@-1Smith",
      first_name: "John",
      email_address: "john@smith.com",
      specialty: "Cardiology",
      practice_name: "Smith Clinic",
    });
    expect(screen.getByTestId("submit-btn")).toBeDisabled();
  });
});
