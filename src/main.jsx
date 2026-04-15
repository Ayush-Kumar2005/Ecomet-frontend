import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { Provider } from "react-redux"; 
import appStore from "./store/appStore.jsx";

import "./index.css";
import App from "./App.jsx";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <Provider store={appStore}> 
      <BrowserRouter>
        <App />
        <Toaster position="bottom-right" /> 
      </BrowserRouter>
    </Provider>
  </StrictMode>
);