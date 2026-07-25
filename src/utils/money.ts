import type { CheckoutSession } from "../types/checkout";

export function formatMoney(
  cents: number,
  locale: CheckoutSession["locale"],
  currency: CheckoutSession["currency"]
) {
  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency,
    minimumFractionDigits: 2
  }).format(cents / 100);
}

export function subtotalCents(items: CheckoutSession["items"]) {
  return items.reduce((sum, item) => sum + item.amountCents * item.quantity, 0);
}
