import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { Badge, badgeVariants } from "./badge";

describe("badgeVariants", () => {
  it("yellow variant", () => {
    expect(badgeVariants({ variant: "yellow" })).toContain("bg-yellow");
    expect(badgeVariants({ variant: "yellow" })).toContain("text-yellow-deep");
  });
  it("cyan variant", () => {
    expect(badgeVariants({ variant: "cyan" })).toContain("bg-cyan");
    expect(badgeVariants({ variant: "cyan" })).toContain("text-cyan-deep");
  });
  it("base has uppercase tracking", () => {
    expect(badgeVariants({ variant: "yellow" })).toContain("uppercase");
    expect(badgeVariants({ variant: "yellow" })).toContain("tracking-[0.08em]");
  });
});

describe("Badge", () => {
  it("renders its label", () => {
    render(<Badge variant="cyan">Foil</Badge>);
    expect(screen.getByText("Foil")).toBeInTheDocument();
  });
});
