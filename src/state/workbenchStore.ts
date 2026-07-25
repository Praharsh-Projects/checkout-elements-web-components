import { configureStore, createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { LocaleCode } from "../types/checkout";

export type WorkbenchState = {
  locale: LocaleCode;
  failQuote: boolean;
};

const initialState: WorkbenchState = {
  locale: "sv-SE",
  failQuote: false
};

const workbenchSlice = createSlice({
  name: "workbench",
  initialState,
  reducers: {
    setLocale(state, action: PayloadAction<LocaleCode>) {
      state.locale = action.payload;
    },
    setFailQuote(state, action: PayloadAction<boolean>) {
      state.failQuote = action.payload;
    }
  }
});

export const workbenchActions = workbenchSlice.actions;
export const workbenchReducer = workbenchSlice.reducer;

export function createWorkbenchStore() {
  return configureStore({
    reducer: {
      workbench: workbenchReducer
    }
  });
}

export type WorkbenchStore = ReturnType<typeof createWorkbenchStore>;
export type RootState = ReturnType<WorkbenchStore["getState"]>;
export type AppDispatch = WorkbenchStore["dispatch"];
