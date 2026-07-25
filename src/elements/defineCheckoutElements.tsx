import React from "react";
import { createRoot, type Root } from "react-dom/client";
import { CheckoutSummary } from "../components/CheckoutSummary";
import { mockCheckoutSession } from "../data/sampleCheckout";
import type {
  CheckoutMetric,
  CheckoutQuote,
  CheckoutSession
} from "../types/checkout";
import { parseCheckoutSession } from "../validation/checkoutSession";
import checkoutSummaryStyles from "../components/CheckoutSummary.css?inline";

export const ELEMENT_NAME = "checkout-summary-panel";

class CheckoutSummaryElement extends HTMLElement {
  private root: Root | null = null;
  private mountPoint: HTMLDivElement | null = null;

  static get observedAttributes() {
    return ["session", "fail-quote"];
  }

  connectedCallback() {
    if (!this.shadowRoot) {
      const shadowRoot = this.attachShadow({ mode: "open" });
      const style = document.createElement("style");
      style.textContent = `
        :host {
          display: block;
          color: #17202a;
          font-family: Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
        }
        *, *::before, *::after {
          box-sizing: border-box;
        }
        ${checkoutSummaryStyles}
        .checkout-card { box-shadow: none; }
      `;
      this.mountPoint = document.createElement("div");
      shadowRoot.append(style, this.mountPoint);
      this.root = createRoot(this.mountPoint);
    }

    this.renderElement();
  }

  attributeChangedCallback() {
    this.renderElement();
  }

  disconnectedCallback() {
    this.root?.unmount();
    this.root = null;
    this.mountPoint = null;
  }

  private parseSession():
    | { ok: true; value: CheckoutSession }
    | { ok: false; error: string } {
    const rawSession = this.getAttribute("session");
    if (!rawSession) {
      return { ok: true, value: mockCheckoutSession };
    }

    return parseCheckoutSession(rawSession);
  }

  private emit<T>(name: string, detail: T) {
    this.dispatchEvent(
      new CustomEvent(name, {
        detail,
        bubbles: true,
        composed: true
      })
    );
  }

  private renderElement() {
    if (!this.root) {
      return;
    }

    const failQuote = this.getAttribute("fail-quote") === "true";
    const parsedSession = this.parseSession();
    if (!parsedSession.ok) {
      this.emit("checkout:error", { message: parsedSession.error });
      this.root.render(
        <p className="checkout-card__error" role="alert">
          Checkout session could not be loaded.
        </p>
      );
      return;
    }

    this.root.render(
      <React.StrictMode>
        <CheckoutSummary
          failQuote={failQuote}
          session={parsedSession.value}
          onConfirm={(quote: CheckoutQuote) => this.emit("checkout:confirm", quote)}
          onMetric={(metric: CheckoutMetric) => this.emit("checkout:metric", metric)}
        />
      </React.StrictMode>
    );
  }
}

export function defineCheckoutElements() {
  if (!customElements.get(ELEMENT_NAME)) {
    customElements.define(ELEMENT_NAME, CheckoutSummaryElement);
  }
}
