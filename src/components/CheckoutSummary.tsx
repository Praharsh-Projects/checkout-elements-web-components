import { useEffect, useId, useMemo, useReducer } from "react";
import { fetchCheckoutQuote } from "../api/checkoutApi";
import { t } from "../i18n/messages";
import {
  initialQuoteState,
  quoteReducer
} from "../state/quoteState";
import type {
  CheckoutMetric,
  CheckoutQuote,
  CheckoutSession
} from "../types/checkout";
import { formatMoney } from "../utils/money";
import "./CheckoutSummary.css";

export type CheckoutSummaryProps = {
  session: CheckoutSession;
  failQuote?: boolean;
  onConfirm?: (quote: CheckoutQuote) => void;
  onMetric?: (metric: CheckoutMetric) => void;
};

export function CheckoutSummary({
  session,
  failQuote = false,
  onConfirm,
  onMetric
}: CheckoutSummaryProps) {
  const [state, dispatch] = useReducer(quoteReducer, initialQuoteState);
  const headingId = useId();

  useEffect(() => {
    const controller = new AbortController();
    const startedAt = performance.now();
    dispatch({ type: "load" });

    fetchCheckoutQuote(session, {
      signal: controller.signal,
      fail: failQuote
    })
      .then((nextQuote) => {
        dispatch({ type: "resolve", quote: nextQuote });
        onMetric?.({
          name: "checkout.quote",
          outcome: "success",
          durationMs: Math.max(0, performance.now() - startedAt)
        });
      })
      .catch((error: Error) => {
        const aborted = error.name === "AbortError";
        if (!aborted) {
          dispatch({ type: "reject" });
        }
        onMetric?.({
          name: "checkout.quote",
          outcome: aborted ? "aborted" : "error",
          durationMs: Math.max(0, performance.now() - startedAt)
        });
      });

    return () => controller.abort();
  }, [failQuote, onMetric, session]);

  const rows = useMemo(() => {
    if (!state.quote) {
      return [];
    }

    return [
      ["subtotal", state.quote.subtotalCents],
      ["shipping", state.quote.shippingCents],
      ["tax", state.quote.taxCents],
      ["total", state.quote.totalCents]
    ] as const;
  }, [state.quote]);

  return (
    <article className="checkout-card" aria-labelledby={headingId}>
      <div className="checkout-card__header">
        <span>{session.merchantName}</span>
        <strong>{session.country}</strong>
      </div>

      <h2 id={headingId}>{t(session.locale, "summary")}</h2>

      <ul className="line-items" aria-label="Items in checkout">
        {session.items.map((item) => (
          <li key={item.id}>
            <span>
              {item.quantity} x {item.name}
            </span>
            <span>{formatMoney(item.amountCents * item.quantity, session.locale, session.currency)}</span>
          </li>
        ))}
      </ul>

      {state.status === "loading" && (
        <p aria-live="polite" role="status">
          {t(session.locale, "loading")}
        </p>
      )}
      {state.status === "error" && <p role="alert">{t(session.locale, "error")}</p>}

      {state.quote && (
        <dl className="totals">
          {rows.map(([label, value]) => (
            <div className={label === "total" ? "totals__row totals__row--total" : "totals__row"} key={label}>
              <dt>{t(session.locale, label)}</dt>
              <dd>{formatMoney(value, session.locale, session.currency)}</dd>
            </div>
          ))}
        </dl>
      )}

      <button
        className="pay-button"
        disabled={!state.quote}
        type="button"
        onClick={() => state.quote && onConfirm?.(state.quote)}
      >
        {t(session.locale, "pay")}
      </button>
    </article>
  );
}
