import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import {
  Dialog,
  DialogContent,
  DialogMain,
  DialogTitle,
  DialogTrigger,
  dialogContentVariants,
} from "./dialog";

describe("dialogContentVariants", () => {
  it("default is the md panel", () => {
    expect(dialogContentVariants()).toContain("max-w-lg");
    expect(dialogContentVariants()).toContain("border-2");
    expect(dialogContentVariants()).toContain("border-ink");
  });
  it("split adds the two-panel row layout", () => {
    expect(dialogContentVariants({ size: "split" })).toContain("md:flex-row");
    expect(dialogContentVariants({ size: "split" })).toContain("max-w-[1080px]");
  });
});

describe("Dialog", () => {
  function Example({ onOpenChange }: { onOpenChange?: (o: boolean) => void }) {
    return (
      <Dialog open onOpenChange={onOpenChange}>
        <DialogContent closeLabel="סגירה">
          <DialogMain>
            <DialogTitle>הגשת מועמדות</DialogTitle>
          </DialogMain>
        </DialogContent>
      </Dialog>
    );
  }

  it("renders open content with its title", () => {
    render(<Example />);
    expect(screen.getByRole("dialog")).toBeInTheDocument();
    expect(screen.getByText("הגשת מועמדות")).toBeInTheDocument();
  });

  it("exposes an accessible, labelled close button", () => {
    const onOpenChange = vi.fn();
    render(<Example onOpenChange={onOpenChange} />);
    const close = screen.getByRole("button", { name: "סגירה" });
    fireEvent.click(close);
    expect(onOpenChange).toHaveBeenCalledWith(false);
  });

  it("keeps content unmounted until opened", () => {
    render(
      <Dialog>
        <DialogTrigger>פתיחה</DialogTrigger>
        <DialogContent closeLabel="סגירה">
          <DialogMain>
            <DialogTitle>מוסתר</DialogTitle>
          </DialogMain>
        </DialogContent>
      </Dialog>
    );
    expect(screen.queryByText("מוסתר")).not.toBeInTheDocument();
    fireEvent.click(screen.getByText("פתיחה"));
    expect(screen.getByText("מוסתר")).toBeInTheDocument();
  });
});
