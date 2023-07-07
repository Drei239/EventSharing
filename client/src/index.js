import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import store from "./app/store";
import { Provider } from "react-redux";
import reportWebVitals from "./reportWebVitals";
import { BrowserRouter } from "react-router-dom";
import { GoogleOAuthProvider } from "@react-oauth/google";
import axios from "axios";
axios.defaults.baseURL = `https://eventsharing-backend.onrender.com`;
const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <GoogleOAuthProvider clientId="514194698390-73gm56buohiqn06jrmklfikb33vufoim.apps.googleusercontent.com">
    <BrowserRouter>
      <Provider store={store}>
        <App />
      </Provider>
    </BrowserRouter>
  </GoogleOAuthProvider>
);
// clientId="514194698390-73gm56buohiqn06jrmklfikb33vufoim.apps.googleusercontent.com"

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
