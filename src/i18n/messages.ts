import type { LocaleCode } from "../types/checkout";

export const messages: Record<LocaleCode, Record<string, string>> = {
  "en-US": {
    summary: "Order summary",
    subtotal: "Subtotal",
    shipping: "Shipping",
    tax: "Tax",
    total: "Total",
    pay: "Continue to payment",
    loading: "Loading checkout quote",
    error: "Checkout quote could not be loaded"
  },
  "sv-SE": {
    summary: "Ordersammanfattning",
    subtotal: "Delsumma",
    shipping: "Frakt",
    tax: "Moms",
    total: "Totalt",
    pay: "Fortsätt till betalning",
    loading: "Hämtar checkoutpris",
    error: "Checkoutpris kunde inte hämtas"
  },
  "de-DE": {
    summary: "Bestellübersicht",
    subtotal: "Zwischensumme",
    shipping: "Versand",
    tax: "Steuer",
    total: "Gesamt",
    pay: "Weiter zur Zahlung",
    loading: "Checkout-Angebot wird geladen",
    error: "Checkout-Angebot konnte nicht geladen werden"
  }
};

export function t(locale: LocaleCode, key: string) {
  return messages[locale]?.[key] ?? messages["en-US"][key] ?? key;
}
