import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent, within } from "@testing-library/react";
import { JobApplicationDialog } from "./JobApplicationDialog";
import { ContactDialogProvider } from "@/app/components/contact/ContactDialogProvider";
import { jobApplicationCopy } from "@/app/content/jobApplication";
import type { Lang } from "@/app/content/home";

// The form posts to a Server Action; mock it so the component test stays a unit.
vi.mock("@/app/actions/jobApplication", () => ({
  submitJobApplication: vi.fn(async () => ({ ok: true })),
}));
import { submitJobApplication } from "@/app/actions/jobApplication";

const he = jobApplicationCopy.he;
const role = { code: "#BR-402", title: "רכז/ת איכות" };

// The dialog now reads useContactDialog() for its "inquire" button, so it must
// render inside the provider (which also mounts the closed global contact dialog).
function renderDialog(lang: Lang, props: { triggerLabel?: string } = {}) {
  return render(
    <ContactDialogProvider lang={lang}>
      <JobApplicationDialog lang={lang} role={role} {...props} />
    </ContactDialogProvider>
  );
}

function open() {
  renderDialog("he", { triggerLabel: "להגשה" });
  fireEvent.click(screen.getByRole("button", { name: "להגשה" }));
  return screen.getByRole("dialog");
}

describe("JobApplicationDialog", () => {
  it("opens from its trigger and shows the role title", () => {
    const dialog = open();
    const heading = within(dialog).getByRole("heading", { name: role.title });
    expect(heading).toBeInTheDocument();
  });

  it("validates required fields before submitting", () => {
    open();
    fireEvent.click(screen.getByRole("button", { name: he.form.submit }));
    expect(screen.getByText(he.errors.name)).toBeInTheDocument();
    expect(screen.getByText(he.errors.phone)).toBeInTheDocument();
    expect(screen.getByText(he.errors.email)).toBeInTheDocument();
    // Still on the form, not the success screen — and nothing was sent.
    expect(screen.queryByText(he.success.title)).not.toBeInTheDocument();
    expect(submitJobApplication).not.toHaveBeenCalled();
  });

  it("submits to the server action and shows the success state", async () => {
    open();
    fireEvent.change(screen.getByLabelText(he.form.name.label), {
      target: { value: "ישראלה ישראלי" },
    });
    fireEvent.change(screen.getByLabelText(he.form.phone.label), {
      target: { value: "050-1234567" },
    });
    fireEvent.change(screen.getByLabelText(he.form.email.label), {
      target: { value: "test@example.com" },
    });
    fireEvent.click(screen.getByRole("button", { name: he.form.submit }));

    // Success appears after the Server Action resolves.
    expect(await screen.findByText(he.success.title)).toBeInTheDocument();
    expect(submitJobApplication).toHaveBeenCalledOnce();
  });

  it("renders English copy when lang is en", () => {
    renderDialog("en");
    fireEvent.click(
      screen.getByRole("button", { name: jobApplicationCopy.en.triggerLabel })
    );
    expect(
      screen.getByRole("button", { name: jobApplicationCopy.en.form.submit })
    ).toBeInTheDocument();
  });
});
