# Limitations

- Uses a mocked checkout quote API; it does not process real payments.
- Does not claim production checkout traffic, merchant usage, conversion lift,
  or Core Web Vitals optimization.
- Does not implement iframe or cross-origin checkout isolation.
- Runtime checks bound JSON attributes, text, quantities, item counts, and
  monetary values; this is not a full payment-security or fraud-control layer.
- The `checkout:metric` event is a monitoring integration point, not a deployed
  New Relic or Sentry integration.
- Automated axe checks are useful regression gates but are not WCAG
  certification or a substitute for manual assistive-technology review.
- The pull-request template documents review expectations but does not prove
  review by another developer.
- The repository is intended as interview-defensible portfolio evidence for
  React, TypeScript, Vite, Storybook, Web Components, async state,
  accessibility-aware implementation, and front-end testing.
