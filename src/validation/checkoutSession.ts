import type {
  CheckoutLineItem,
  CheckoutSession,
  LocaleCode
} from "../types/checkout";

type ParseResult =
  | { ok: true; value: CheckoutSession }
  | { ok: false; error: string };

const locales: LocaleCode[] = ["en-US", "sv-SE", "de-DE"];
const currencies: CheckoutSession["currency"][] = ["SEK", "EUR", "USD"];
const countries: CheckoutSession["country"][] = ["SE", "DE", "US"];

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function isBoundedString(value: unknown, maxLength: number): value is string {
  return typeof value === "string" && value.length > 0 && value.length <= maxLength;
}

function isSafeCents(value: unknown): value is number {
  return Number.isSafeInteger(value) && Number(value) >= 0 && Number(value) <= 100_000_000;
}

function parseLineItem(value: unknown): CheckoutLineItem | null {
  if (!isRecord(value)) {
    return null;
  }

  if (
    !isBoundedString(value.id, 80) ||
    !isBoundedString(value.name, 160) ||
    !Number.isInteger(value.quantity) ||
    Number(value.quantity) < 1 ||
    Number(value.quantity) > 100 ||
    !isSafeCents(value.amountCents)
  ) {
    return null;
  }

  return {
    id: value.id,
    name: value.name,
    quantity: Number(value.quantity),
    amountCents: value.amountCents
  };
}

export function parseCheckoutSession(rawSession: string): ParseResult {
  let value: unknown;

  try {
    value = JSON.parse(rawSession) as unknown;
  } catch {
    return { ok: false, error: "Session must be valid JSON." };
  }

  if (!isRecord(value)) {
    return { ok: false, error: "Session must be an object." };
  }

  if (
    !isBoundedString(value.sessionId, 80) ||
    !isBoundedString(value.merchantName, 160) ||
    !locales.includes(value.locale as LocaleCode) ||
    !currencies.includes(value.currency as CheckoutSession["currency"]) ||
    !countries.includes(value.country as CheckoutSession["country"]) ||
    !Array.isArray(value.items) ||
    value.items.length < 1 ||
    value.items.length > 50 ||
    !isSafeCents(value.shippingCents) ||
    !isSafeCents(value.taxCents)
  ) {
    return { ok: false, error: "Session fields are outside the accepted contract." };
  }

  const items = value.items.map(parseLineItem);
  if (items.some((item) => item === null)) {
    return { ok: false, error: "One or more line items are invalid." };
  }

  return {
    ok: true,
    value: {
      sessionId: value.sessionId,
      merchantName: value.merchantName,
      locale: value.locale as LocaleCode,
      currency: value.currency as CheckoutSession["currency"],
      country: value.country as CheckoutSession["country"],
      items: items as CheckoutLineItem[],
      shippingCents: value.shippingCents,
      taxCents: value.taxCents
    }
  };
}
