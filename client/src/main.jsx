import { createRoot } from "react-dom/client";
import { registerLicense } from "@syncfusion/ej2-base";

import "./index.css";
import App from "./App.jsx";
import { Provider } from "react-redux";
import { ContextProvider } from "./Contexts/ContextProvider.jsx";
import { store } from "./Rtk/store/store.js";
// Register Syncfusion license key

registerLicense(
  "Ngo9BigBOggjHTQxAR8/V1NMaF5cXmBCf0xyWmFZfVtgdl9EZ1ZSRGY/P1ZhSXxXd0dhUX5acnNWRmZcUE0="
);

createRoot(document.getElementById("root")).render(
  <Provider store={store}>
    <ContextProvider>
      <App />
    </ContextProvider>
  </Provider>
);
