import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { Footer } from "./Footer";
import { chromeContent } from "@/app/content/site";

vi.mock("./LangSwitch", () => ({ LangSwitch: () => null }));
vi.mock("./FooterMap", () => ({ FooterMap: () => null }));

describe("footer contact email", () => {
  it.each(["he", "en"] as const)("links directly to office in %s without changing CMS chrome", (lang) => {
    const chrome = { ...chromeContent[lang], email: "orders@beeripacks.co.il", footerTagline: "Client CMS text" };
    const before = JSON.stringify(chrome);
    const { unmount } = render(<Footer lang={lang} chrome={chrome} />);
    expect(screen.getByRole("link", { name: "office@beeripacks.co.il" }))
      .toHaveAttribute("href", "mailto:office@beeripacks.co.il");
    expect(screen.queryByText("orders@beeripacks.co.il")).not.toBeInTheDocument();
    expect(screen.getByText("Client CMS text")).toBeInTheDocument();
    expect(JSON.stringify(chrome)).toBe(before);
    unmount();
  });
});
