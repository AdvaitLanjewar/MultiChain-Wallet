import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App";
import "./index.css";

import { WalletProvider } from "./context/WalletContext";

ReactDOM.createRoot(document.getElementById("root")).render(
  <WalletProvider>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </WalletProvider>
);