import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { Container } from "./container";

describe("Container", () => {
  it("renders children inside the centered max-width wrapper", () => {
    render(<Container>inner</Container>);
    const el = screen.getByText("inner");
    expect(el).toHaveClass("mx-auto");
    expect(el).toHaveClass("max-w-[1280px]");
  });

  it("merges an overriding className", () => {
    render(<Container className="max-w-[1264px]">x</Container>);
    expect(screen.getByText("x")).toHaveClass("max-w-[1264px]");
    // tailwind-merge keeps the override, drops the default max-w
    expect(screen.getByText("x")).not.toHaveClass("max-w-[1280px]");
  });
});
