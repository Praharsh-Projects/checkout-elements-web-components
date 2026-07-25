# Verification Record

Run from the repository root with Node.js 24:

```bash
npm ci
npm run quality
npx playwright install chromium
npm run test:e2e
```

Latest local result:

- ESLint and strict TypeScript: passed.
- Vitest: 17 checks across 7 files passed.
- Coverage: 95.90% statements, 90.78% branches, 95.34% functions, 95.76% lines.
- Vite production build: passed.
- Static Storybook build with accessibility addon: passed.
- Playwright: desktop and mobile Chromium workflows passed.
- Browser regression: React and Shadow DOM paths styled and interactive;
  locale state synchronized; confirmation event emitted; no horizontal
  overflow; rendered axe-core scan returned no violations.
- Dependency audit: zero known vulnerabilities.
- Visual review: desktop and mobile full-page renders inspected after fixing the
  Shadow DOM stylesheet boundary.

The metrics above describe this deterministic repository snapshot only. They do
not represent production users, merchant traffic, conversion, or WCAG
certification.
