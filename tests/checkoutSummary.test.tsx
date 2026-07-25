import { render, screen, waitFor } from "@testing-library/react";
import axe from "axe-core";
import { describe, expect, it, vi } from "vitest";
import { CheckoutSummary } from "../src/components/CheckoutSummary";
import { mockCheckoutSession } from "../src/data/sampleCheckout";

describe("CheckoutSummary", () => {
  it("renders async totals and keeps the payment action disabled until quote data exists", async () => {
    render(<CheckoutSummary session={mockCheckoutSession} />);

    expect(screen.getByRole("button", { name: /betalning/i })).toBeDisabled();

    await waitFor(() => {
      expect(screen.getByText(/totalt/i)).toBeInTheDocument();
    });

    expect(screen.getByRole("button", { name: /betalning/i })).toBeEnabled();
  });

  it("reports a bounded quote-load metric without exposing session data", async () => {
    const onMetric = vi.fn();

    render(
      <CheckoutSummary
        onMetric={onMetric}
        session={mockCheckoutSession}
      />
    );

    await waitFor(() => expect(onMetric).toHaveBeenCalledOnce());
    expect(onMetric).toHaveBeenCalledWith(
      expect.objectContaining({
        name: "checkout.quote",
        outcome: "success",
        durationMs: expect.any(Number)
      })
    );
    expect(JSON.stringify(onMetric.mock.calls)).not.toContain(
      mockCheckoutSession.sessionId
    );
  });

  it("renders an alert and reports an error metric when quote loading fails", async () => {
    const onMetric = vi.fn();

    render(
      <CheckoutSummary
        failQuote
        onMetric={onMetric}
        session={mockCheckoutSession}
      />
    );

    expect(await screen.findByRole("alert")).toHaveTextContent(
      /kunde inte hämtas/i
    );
    expect(onMetric).toHaveBeenCalledWith(
      expect.objectContaining({
        name: "checkout.quote",
        outcome: "error"
      })
    );
  });

  it("has no obvious accessibility violations for the rendered checkout summary", async () => {
    const { container } = render(<CheckoutSummary session={mockCheckoutSession} />);

    await screen.findByText(/totalt/i);
    const results = await axe.run(container, {
      rules: {
        // jsdom does not compute layout or rendered color contrast.
        "color-contrast": { enabled: false }
      }
    });

    expect(results.violations).toHaveLength(0);
  });
});
