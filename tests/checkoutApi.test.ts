import { describe, expect, it } from "vitest";
import { fetchCheckoutQuote } from "../src/api/checkoutApi";
import { mockCheckoutSession } from "../src/data/sampleCheckout";
import { formatMoney, subtotalCents } from "../src/utils/money";

describe("checkout quote API", () => {
  it("calculates a deterministic checkout total from line items", async () => {
    const quote = await fetchCheckoutQuote(mockCheckoutSession, { latencyMs: 0 });

    expect(quote.subtotalCents).toBe(subtotalCents(mockCheckoutSession.items));
    expect(quote.totalCents).toBe(quote.subtotalCents + quote.shippingCents + quote.taxCents);
    expect(quote.paymentMethods).toContain("card");
  });

  it("formats localized checkout currency values", () => {
    const formatted = formatMoney(12900, "sv-SE", "SEK");

    expect(formatted).toContain("129");
    expect(formatted).toMatch(/kr|SEK/);
  });
});
