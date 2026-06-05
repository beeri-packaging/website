import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { Button, buttonVariants } from "./button";

describe("buttonVariants", () => {
  it("primary/md has the ink fill, bone text, sharp corners and base padding", () => {
    const cls = buttonVariants({ variant: "primary", size: "md" });
    expect(cls).toContain("bg-ink");
    expect(cls).toContain("text-bone");
    expect(cls).toContain("rounded-none");
    expect(cls).toContain("px-8");
    expect(cls).toContain("hover:bg-bone");
  });

  it("cyan variant fills cyan with an ink border and inverts on hover", () => {
    const cls = buttonVariants({ variant: "cyan" });
    expect(cls).toContain("bg-cyan");
    expect(cls).toContain("border-ink");
    expect(cls).toContain("text-ink");
    expect(cls).toContain("hover:bg-ink");
  });

  it("secondary is outline-only", () => {
    const cls = buttonVariants({ variant: "secondary" });
    expect(cls).toContain("border");
    expect(cls).toContain("text-ink");
    expect(cls).toContain("hover:bg-ink");
  });

  it("solid keeps ink fill with clay hover", () => {
    const cls = buttonVariants({ variant: "solid" });
    expect(cls).toContain("bg-ink");
    expect(cls).toContain("hover:bg-clay");
  });
});

describe("Button", () => {
  it("renders a button with its children and merged className", () => {
    render(<Button className="self-start">Send</Button>);
    const btn = screen.getByRole("button", { name: "Send" });
    expect(btn).toBeInTheDocument();
    expect(btn).toHaveClass("self-start");
    expect(btn).toHaveClass("bg-ink"); // default variant = primary
  });
});
