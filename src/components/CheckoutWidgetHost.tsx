import { createElement } from "react";
import type { CheckoutSession } from "../types/checkout";
import "./CheckoutWidgetHost.css";

type Props = {
  session: CheckoutSession;
  failQuote?: boolean;
};

export function CheckoutWidgetHost({ session, failQuote = false }: Props) {
  const payload = JSON.stringify(session);

  return (
    <section className="host-panel" aria-labelledby="host-heading">
      <h2 id="host-heading">Merchant embed surface</h2>
      <p>
        The custom element below is rendered from plain HTML attributes, matching
        a storefront integration where the host application does not use React.
      </p>
      {createElement("checkout-summary-panel", {
        session: payload,
        "fail-quote": failQuote ? "true" : undefined
      })}
    </section>
  );
}
