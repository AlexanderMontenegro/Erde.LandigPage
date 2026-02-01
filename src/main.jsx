import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { BrowserRouter } from "react-router-dom";
import { useAuthStore } from "./store/authStore";
import "./index.css";
import { db, auth } from "./config/firebase";

console.log("Firestore:", db);
console.log("Auth:", auth);


useAuthStore.getState().initAuthListener();

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>
);
