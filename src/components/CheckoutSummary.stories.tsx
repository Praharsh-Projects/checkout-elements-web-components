import type { Meta, StoryObj } from "@storybook/react-vite";
import { CheckoutSummary } from "./CheckoutSummary";
import { mockCheckoutSession } from "../data/sampleCheckout";

const meta = {
  title: "Checkout/CheckoutSummary",
  component: CheckoutSummary,
  args: {
    session: mockCheckoutSession
  },
  parameters: {
    docs: {
      description: {
        component:
          "Reusable checkout summary with reducer-driven async states, semantic totals, keyboard focus, and an injectable monitoring callback."
      }
    }
  },
  tags: ["autodocs"]
} satisfies Meta<typeof CheckoutSummary>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Swedish: Story = {};

export const English: Story = {
  args: {
    session: {
      ...mockCheckoutSession,
      locale: "en-US",
      currency: "USD",
      country: "US"
    }
  }
};

export const QuoteError: Story = {
  args: {
    failQuote: true
  }
};
