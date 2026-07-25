import React from "react";
import { createRoot } from "react-dom/client";
import { Provider } from "react-redux";
import { App } from "./App";
import { defineCheckoutElements } from "./elements/defineCheckoutElements";
import { createWorkbenchStore } from "./state/workbenchStore";
import "./styles/global.css";

defineCheckoutElements();
const store = createWorkbenchStore();

const root = document.getElementById("root");

if (root) {
  createRoot(root).render(
    <React.StrictMode>
      <Provider store={store}>
        <App />
      </Provider>
    </React.StrictMode>
  );
}
