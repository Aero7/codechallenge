import "@testing-library/jest-dom";
import { render, screen } from "@testing-library/react";
import App from "../App";

// Mock localStorage
const localStorageMock = (() => {
  let store: Record<string, string> = {};
  return {
    getItem: (key: string) => store[key] || null,
    setItem: (key: string, value: string) => {
      store[key] = value;
    },
    clear: () => {
      store = {};
    },
    removeItem: (key: string) => {
      delete store[key];
    },
  };
})();

Object.defineProperty(window, "localStorage", {
  value: localStorageMock,
});

jest.mock("../components/ProviderList", () => (props: any) => (
  <div data-testid="provider-table">{JSON.stringify(props.providers)}</div>
));

jest.mock("../assets/sample-data.json", () => [
  {
    last_name: "Test",
    first_name: "User",
    email_address: "test@user.com",
    specialty: "Testing",
    practice_name: "Test Practice",
  },
]);

describe("App", () => {
  beforeEach(() => {
    window.localStorage.clear();
  });

  it("renders the title", () => {
    render(<App />);
    expect(screen.getByText("Provider Directory")).toBeInTheDocument();
  });

  it("loads providers from sample data if localStorage is empty", () => {
    render(<App />);
    expect(screen.getByTestId("provider-table")).toHaveTextContent("Test");
  });

  it("loads providers from localStorage if present", () => {
    window.localStorage.setItem(
      "providers",
      JSON.stringify([
        {
          last_name: "Stored",
          first_name: "Provider",
          email_address: "stored@provider.com",
          specialty: "Storage",
          practice_name: "Stored Practice",
        },
      ])
    );
    render(<App />);
    expect(screen.getByTestId("provider-table")).toHaveTextContent("Stored");
  });

  it("saves providers to localStorage when providers state changes", () => {
    // This test checks that setItem is called when providers change
    const setItemSpy = jest.spyOn(window.localStorage, "setItem");
    render(<App />);
    expect(setItemSpy).toHaveBeenCalledWith(
      "providers",
      expect.stringContaining("Test")
    );
  });
});
