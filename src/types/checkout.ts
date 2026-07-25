export type LocaleCode = "en-US" | "sv-SE" | "de-DE";

export type CheckoutLineItem = {
  id: string;
  name: string;
  quantity: number;
  amountCents: number;
};

export type CheckoutSession = {
  sessionId: string;
  merchantName: string;
  locale: LocaleCode;
  currency: "SEK" | "EUR" | "USD";
  country: "SE" | "DE" | "US";
  items: CheckoutLineItem[];
  shippingCents: number;
  taxCents: number;
};

export type CheckoutQuote = {
  sessionId: string;
  subtotalCents: number;
  shippingCents: number;
  taxCents: number;
  totalCents: number;
  paymentMethods: string[];
};

export type CheckoutMetric = {
  name: "checkout.quote";
  outcome: "success" | "error" | "aborted";
  durationMs: number;
};
