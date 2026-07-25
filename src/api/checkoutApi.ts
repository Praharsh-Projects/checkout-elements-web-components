import type { CheckoutQuote, CheckoutSession } from "../types/checkout";
import { subtotalCents } from "../utils/money";

type QuoteOptions = {
  signal?: AbortSignal;
  fail?: boolean;
  latencyMs?: number;
};

export async function fetchCheckoutQuote(
  session: CheckoutSession,
  options: QuoteOptions = {}
): Promise<CheckoutQuote> {
  const { signal, fail = false, latencyMs = 20 } = options;

  await new Promise<void>((resolve, reject) => {
    const timeout = window.setTimeout(resolve, latencyMs);

    signal?.addEventListener(
      "abort",
      () => {
        window.clearTimeout(timeout);
        reject(new DOMException("Checkout request was aborted", "AbortError"));
      },
      { once: true }
    );
  });

  if (fail) {
    throw new Error("Simulated checkout quote failure");
  }

  const subtotal = subtotalCents(session.items);
  return {
    sessionId: session.sessionId,
    subtotalCents: subtotal,
    shippingCents: session.shippingCents,
    taxCents: session.taxCents,
    totalCents: subtotal + session.shippingCents + session.taxCents,
    paymentMethods: ["card", "bank-transfer", "invoice"]
  };
}
