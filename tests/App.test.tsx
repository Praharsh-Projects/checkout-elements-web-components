import { fireEvent, render, screen } from "@testing-library/react";
import { Provider } from "react-redux";
import { describe, expect, it } from "vitest";
import { App } from "../src/App";
import { createWorkbenchStore } from "../src/state/workbenchStore";

describe("component workbench", () => {
  it("applies Redux-managed locale selection to both checkout surfaces", async () => {
    const store = createWorkbenchStore();
    render(
      <Provider store={store}>
        <App />
      </Provider>
    );

    fireEvent.change(screen.getByLabelText("Preview locale"), {
      target: { value: "en-US" }
    });

    expect(
      await screen.findByRole("heading", { level: 2, name: "Order summary" })
    ).toBeInTheDocument();
    expect(store.getState().workbench.locale).toBe("en-US");
  });
});
