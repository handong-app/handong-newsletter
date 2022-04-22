import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import App from "./App";

console.log(window.location.pathname);
if (window.location.pathname === "/form") {
  window.location.replace("https://forms.gle/uJEA4jnao35YAeYR9");
} else {
  ReactDOM.render(
    <React.StrictMode>
      <App />
    </React.StrictMode>,
    document.getElementById("root")
  );
}
