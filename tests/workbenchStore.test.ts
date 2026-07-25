import { describe, expect, it } from "vitest";
import {
  createWorkbenchStore,
  workbenchActions
} from "../src/state/workbenchStore";

describe("workbench Redux state", () => {
  it("coordinates locale and failure controls across integration surfaces", () => {
    const store = createWorkbenchStore();

    store.dispatch(workbenchActions.setLocale("de-DE"));
    store.dispatch(workbenchActions.setFailQuote(true));

    expect(store.getState().workbench).toEqual({
      locale: "de-DE",
      failQuote: true
    });
  });
});
