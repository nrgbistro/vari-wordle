import { render, screen } from "@testing-library/react";
import App from "./App";

test("renders VARI-WORDLE title", () => {
	render(<App />);
	const linkElement = screen.getByText(/VARI-WORDLE/i);
	expect(linkElement).toBeInTheDocument();
});
