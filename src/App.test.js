import { render, screen } from "@testing-library/react";
import App from "./App";

test("renders learn react link", () => {
  render(<App />);
  const linkElement = screen.getByLabelText(/Email Address/i);
  expect(linkElement).toBeInTheDocument();
});
