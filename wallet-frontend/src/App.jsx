import { Routes, Route } from "react-router-dom";

import LandingPage from "./pages/Home";
import Dashboard from "./pages/Dashboard";
import BuyCrypto from "./pages/BuyCrypto";
import SendCrypto from "./pages/SendCrypto";
import ReceiveCrypto from "./pages/ReceiveCrypto";
import Portfolio from "./pages/Portfolio";
import Transactions from "./pages/Transactions";
import Settings from "./pages/Settings";
import CreateWallet from "./pages/CreateWallet";
import ImportWallet from "./pages/ImportWallet";

function App() {
  return (
    <Routes>

      <Route path="/" element={<LandingPage />} />

      <Route path="/dashboard" element={<Dashboard />} />

      <Route path="/buy" element={<BuyCrypto />} />

      <Route path="/send" element={<SendCrypto />} />

      <Route path="/receive" element={<ReceiveCrypto />} />

      <Route path="/portfolio" element={<Portfolio />} />

      <Route path="/transactions" element={<Transactions />} />

      <Route path="/settings" element={<Settings />} />

      <Route path="/create-wallet" element={<CreateWallet />} />

      <Route path="/import-wallet" element={<ImportWallet />} />

    </Routes>
  );
}

export default App;