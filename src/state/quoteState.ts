import type { CheckoutQuote } from "../types/checkout";

export type QuoteState =
  | { status: "loading"; quote: null }
  | { status: "ready"; quote: CheckoutQuote }
  | { status: "error"; quote: null };

export type QuoteAction =
  | { type: "load" }
  | { type: "resolve"; quote: CheckoutQuote }
  | { type: "reject" };

export const initialQuoteState: QuoteState = {
  status: "loading",
  quote: null
};

export function quoteReducer(_state: QuoteState, action: QuoteAction): QuoteState {
  switch (action.type) {
    case "load":
      return initialQuoteState;
    case "resolve":
      return { status: "ready", quote: action.quote };
    case "reject":
      return { status: "error", quote: null };
  }
}
