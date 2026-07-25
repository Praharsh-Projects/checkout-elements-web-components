import { useMemo } from "react";
import { CheckoutSummary } from "./components/CheckoutSummary";
import { CheckoutWidgetHost } from "./components/CheckoutWidgetHost";
import { mockCheckoutSession } from "./data/sampleCheckout";
import { useAppDispatch, useAppSelector } from "./state/hooks";
import { workbenchActions } from "./state/workbenchStore";
import type { CheckoutSession, LocaleCode } from "./types/checkout";

export function App() {
  const dispatch = useAppDispatch();
  const { failQuote, locale } = useAppSelector((state) => state.workbench);
  const session = useMemo<CheckoutSession>(() => {
    const market = {
      "de-DE": { country: "DE", currency: "EUR" },
      "en-US": { country: "US", currency: "USD" },
      "sv-SE": { country: "SE", currency: "SEK" }
    } as const;

    return {
      ...mockCheckoutSession,
      locale,
      ...market[locale]
    };
  }, [locale]);

  return (
    <section className="page-shell" aria-labelledby="page-title">
      <header className="intro">
        <p className="eyebrow">Checkout UI integration lab</p>
        <h1 id="page-title">Embeddable checkout elements</h1>
        <p>
          React and Web Components example for a checkout summary that can be
          embedded in a merchant storefront while keeping accessibility,
          localization, and async state handling explicit.
        </p>
      </header>

      <form className="workbench-controls" onSubmit={(event) => event.preventDefault()}>
        <label>
          Preview locale
          <select
            value={locale}
            onChange={(event) =>
              dispatch(workbenchActions.setLocale(event.target.value as LocaleCode))
            }
          >
            <option value="sv-SE">Swedish</option>
            <option value="en-US">English</option>
            <option value="de-DE">German</option>
          </select>
        </label>
        <label className="workbench-controls__checkbox">
          <input
            checked={failQuote}
            type="checkbox"
            onChange={(event) =>
              dispatch(workbenchActions.setFailQuote(event.target.checked))
            }
          />
          Simulate quote failure
        </label>
      </form>

      <div className="layout">
        <CheckoutSummary failQuote={failQuote} session={session} />
        <CheckoutWidgetHost failQuote={failQuote} session={session} />
      </div>
    </section>
  );
}
