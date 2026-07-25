import { describe, expect, it } from "vitest";
import { mockCheckoutSession } from "../src/data/sampleCheckout";
import { parseCheckoutSession } from "../src/validation/checkoutSession";

describe("checkout session validation", () => {
  it("accepts a session that satisfies the integration contract", () => {
    const result = parseCheckoutSession(JSON.stringify(mockCheckoutSession));

    expect(result).toEqual({ ok: true, value: mockCheckoutSession });
  });

  it("rejects malformed JSON", () => {
    expect(parseCheckoutSession("{not-json")).toEqual({
      ok: false,
      error: "Session must be valid JSON."
    });
  });

  it("rejects negative quantities and unbounded monetary values", () => {
    const invalid = {
      ...mockCheckoutSession,
      shippingCents: 100_000_001,
      items: [
        {
          ...mockCheckoutSession.items[0],
          quantity: -1
        }
      ]
    };

    expect(parseCheckoutSession(JSON.stringify(invalid))).toEqual({
      ok: false,
      error: "Session fields are outside the accepted contract."
    });
  });
});
