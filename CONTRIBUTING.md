# Contributing

Use a short-lived branch and open a pull request against `main`. Keep each
change focused on one component, integration contract, or quality gate.

Before requesting review:

```bash
npm ci
npm run quality
npx playwright install chromium
npm run test:e2e
```

Reviewers should check:

- semantic HTML, accessible names, keyboard paths, and visible focus;
- explicit loading, ready, empty, and failure states;
- runtime validation at custom-element and API boundaries;
- whether shared state is necessary or local reducer state is sufficient;
- unit, integration, and browser regression coverage;
- bundle or rendering implications for embedded consumers;
- monitoring events that avoid customer and checkout-session data;
- a plain-language explanation of visitor and integration consequences.

Approval by another person is not represented in this portfolio repository.
The template documents a review process; it is not evidence of professional
peer-review ownership.
