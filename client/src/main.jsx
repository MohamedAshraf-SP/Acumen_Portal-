import { createRoot } from "react-dom/client";
// for prime react

// for syncfusion
import { registerLicense } from "@syncfusion/ej2-base";
import "./index.css";
import App from "./App.jsx";
import { Provider } from "react-redux";
import { store } from "./Rtk/store/store.js";
import { AuthContextProvider } from "./Contexts/AuthContext.jsx";
import { BrowserRouter } from "react-router-dom";
// Register Syncfusion license key
registerLicense(
  "Ngo9BigBOggjHTQxAR8/V1NMaF5cXmBCfEx1WmFZfVtgfV9GYlZTQmYuP1ZhSXxWdkRjXX9XcHZWQmhYUUI="
);

createRoot(document.getElementById("root")).render(
  <Provider store={store}>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </Provider>
);
