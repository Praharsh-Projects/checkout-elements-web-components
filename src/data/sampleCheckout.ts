import type { CheckoutSession } from "../types/checkout";

export const mockCheckoutSession: CheckoutSession = {
  sessionId: "cko_1028",
  merchantName: "Nordic Home Goods",
  locale: "sv-SE",
  currency: "SEK",
  country: "SE",
  shippingCents: 4900,
  taxCents: 2850,
  items: [
    {
      id: "sku-lamp-01",
      name: "Desk lamp",
      quantity: 1,
      amountCents: 59900
    },
    {
      id: "sku-cable-02",
      name: "Braided USB-C cable",
      quantity: 2,
      amountCents: 9900
    }
  ]
};
