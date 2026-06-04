import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { Eyebrow } from "./eyebrow";

describe("Eyebrow", () => {
  it("renders the label inside a yellow chip with cyan-deep uppercase text", () => {
    const { container } = render(<Eyebrow>Since 1964</Eyebrow>);
    expect(screen.getByText("Since 1964")).toBeInTheDocument();
    expect(container.firstChild).toHaveClass("bg-yellow");
    const label = screen.getByText("Since 1964");
    expect(label).toHaveClass("text-cyan-deep");
    expect(label).toHaveClass("uppercase");
  });

  it("merges an extra className on the chip", () => {
    const { container } = render(<Eyebrow className="animate-rise">x</Eyebrow>);
    expect(container.firstChild).toHaveClass("animate-rise");
  });
});
