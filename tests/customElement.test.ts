import { waitFor } from "@testing-library/dom";
import { describe, expect, it, vi } from "vitest";
import { mockCheckoutSession } from "../src/data/sampleCheckout";
import {
  defineCheckoutElements,
  ELEMENT_NAME
} from "../src/elements/defineCheckoutElements";

describe("checkout custom element", () => {
  it("registers and renders a checkout summary inside shadow DOM", async () => {
    defineCheckoutElements();
    const element = document.createElement(ELEMENT_NAME);
    element.setAttribute("session", JSON.stringify(mockCheckoutSession));
    document.body.appendChild(element);

    await waitFor(() => {
      expect(element.shadowRoot?.textContent).toContain("Nordic Home Goods");
      expect(element.shadowRoot?.textContent).toMatch(/Totalt|Total/);
    });

    element.remove();
  });

  it("dispatches a composed confirmation event with the resolved quote", async () => {
    defineCheckoutElements();
    const element = document.createElement(ELEMENT_NAME);
    const listener = vi.fn();
    element.setAttribute("session", JSON.stringify(mockCheckoutSession));
    element.addEventListener("checkout:confirm", listener);
    document.body.appendChild(element);

    await waitFor(() => {
      const button = element.shadowRoot?.querySelector("button");
      expect(button).not.toBeDisabled();
    });
    element.shadowRoot?.querySelector("button")?.click();

    expect(listener).toHaveBeenCalledOnce();
    expect((listener.mock.calls[0][0] as CustomEvent).detail).toEqual(
      expect.objectContaining({
        sessionId: mockCheckoutSession.sessionId,
        totalCents: expect.any(Number)
      })
    );
    element.remove();
  });

  it("rejects invalid session attributes instead of rendering untrusted fields", async () => {
    defineCheckoutElements();
    const element = document.createElement(ELEMENT_NAME);
    const listener = vi.fn();
    element.setAttribute(
      "session",
      JSON.stringify({
        ...mockCheckoutSession,
        items: [{ id: "x", name: "<img src=x>", quantity: -1, amountCents: 10 }]
      })
    );
    element.addEventListener("checkout:error", listener);
    document.body.appendChild(element);

    await waitFor(() => {
      expect(element.shadowRoot?.querySelector('[role="alert"]')).not.toBeNull();
    });
    expect(element.shadowRoot?.querySelector("img")).toBeNull();
    expect(listener).toHaveBeenCalledOnce();
    element.remove();
  });
});
