import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "@playwright/test";

test("keeps the React and Web Component checkout paths usable and accessible", async ({
  page
}) => {
  await page.goto("/");

  await expect(
    page.getByRole("heading", { level: 1, name: "Embeddable checkout elements" })
  ).toBeVisible();

  const componentButton = page
    .locator(".layout > article")
    .getByRole("button", { name: /betalning/i });
  const customElement = page.locator("checkout-summary-panel");
  const customElementButton = customElement.getByRole("button", {
    name: /betalning/i
  });

  await expect(componentButton).toBeEnabled();
  await expect(customElementButton).toBeEnabled();
  await expect(customElement.locator(".checkout-card")).toHaveCSS(
    "border-radius",
    "8px"
  );
  await expect(customElementButton).toHaveCSS("min-height", "44px");

  await page.evaluate(() => {
    document
      .querySelector("checkout-summary-panel")
      ?.addEventListener("checkout:confirm", () => {
        document.documentElement.dataset.checkoutConfirmed = "true";
      });
  });
  await customElementButton.click();
  await expect(page.locator("html")).toHaveAttribute(
    "data-checkout-confirmed",
    "true"
  );

  await page.getByLabel("Preview locale").selectOption("en-US");
  await expect(
    page.getByRole("heading", { level: 2, name: "Order summary" })
  ).toHaveCount(2);

  const horizontalOverflow = await page.evaluate(
    () => document.documentElement.scrollWidth > window.innerWidth
  );
  expect(horizontalOverflow).toBe(false);

  const accessibility = await new AxeBuilder({ page }).analyze();
  expect(accessibility.violations).toEqual([]);
});
