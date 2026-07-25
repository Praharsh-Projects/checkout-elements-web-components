import { describe, expect, it } from "vitest";
import {
  initialQuoteState,
  quoteReducer
} from "../src/state/quoteState";
import type { CheckoutQuote } from "../src/types/checkout";

const quote: CheckoutQuote = {
  sessionId: "cko_test",
  subtotalCents: 100,
  shippingCents: 20,
  taxCents: 25,
  totalCents: 145,
  paymentMethods: ["card"]
};

describe("quote state reducer", () => {
  it("moves from loading to ready with a resolved quote", () => {
    expect(
      quoteReducer(initialQuoteState, { type: "resolve", quote })
    ).toEqual({
      status: "ready",
      quote
    });
  });

  it("clears stale quote data on a rejected request", () => {
    const readyState = quoteReducer(initialQuoteState, {
      type: "resolve",
      quote
    });

    expect(quoteReducer(readyState, { type: "reject" })).toEqual({
      status: "error",
      quote: null
    });
  });
});
