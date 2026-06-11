import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { DualJourney } from "./DualJourney";
import type { HomeJourneyPanel } from "@/sanity/queries";
import { homeCopy } from "@/app/content/home";

// jsdom has no IntersectionObserver; the reveal wiring is irrelevant here.
vi.mock("@/lib/revealObserver", () => ({
  createRevealObserver: () => ({ observe: vi.fn(), disconnect: vi.fn() }),
}));

function panel(key: string, accent: "purple" | "yellow"): HomeJourneyPanel {
  return {
    key,
    accent,
    theme: "dark",
    tagColor: accent === "yellow" ? "text-yellow" : "text-purple",
    tag: `Tag ${key}`,
    title: `Title ${key}`,
    body: `Body ${key}`,
    link: `Link ${key}`,
    src: `/images/${key}.png`,
  };
}

const panels: HomeJourneyPanel[] = [
  panel("customer", "purple"),
  panel("heritage", "yellow"),
];

describe("DualJourney", () => {
  it("sends yellow timeline cards to the About timeline anchor", () => {
    render(<DualJourney lang="en" t={homeCopy.en} panels={panels} />);
    expect(screen.getByRole("link", { name: /Title heritage/ })).toHaveAttribute(
      "href",
      "/en/about#timeline",
    );
  });

  it("sends purple process cards to the home process section", () => {
    render(<DualJourney lang="en" t={homeCopy.en} panels={panels} />);
    expect(screen.getByRole("link", { name: /Title customer/ })).toHaveAttribute(
      "href",
      "#excellence",
    );
  });

  it("keeps journey image requests close to the rendered card size", () => {
    render(<DualJourney lang="en" t={homeCopy.en} panels={panels} />);
    const image = screen.getByAltText("Title customer");
    expect(image).toHaveAttribute(
      "sizes",
      "(min-width: 1280px) 50vw, (min-width: 768px) 58vw, 34vw",
    );
    expect(image).toHaveAttribute("fetchPriority", "low");
  });
});
