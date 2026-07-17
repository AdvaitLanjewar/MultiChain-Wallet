import Navbar from "../components/Navbar";
import WalletCard from "../components/WalletCard";
import { Navigate } from "react-router-dom";
import { useWallet } from "../context/WalletContext";
import { useState } from "react";
function Dashboard() {
  const [showMnemonic, setShowMnemonic] = useState(false);
  const { wallet } = useWallet();

  if (!wallet) {
    return <Navigate to="/" />;
  }

  return (
    <>
      <Navbar />

      <div className="dashboard">

        <h1 className="dashboard-title">
          Welcome 👋
        </h1>

        <div className="wallet-grid">

          <WalletCard
            title="Ethereum"
            symbol="ETH"
            address={wallet.ethereum.address}
          />

          <WalletCard
            title="Bitcoin"
            symbol="BTC"
            address={wallet.bitcoin.address}
          />

          <WalletCard
            title="Solana"
            symbol="SOL"
            address={wallet.solana.address}
          />

        </div>
<div className="wallet-card">
  <h2>Recovery Phrase</h2>

  <button onClick={() => setShowMnemonic(!showMnemonic)}>
    {showMnemonic ? "Hide" : "Show"} Recovery Phrase
  </button>

  {showMnemonic && (
    <p className="address">{wallet.mnemonic}</p>
  )}
</div>
      </div>
    </>
  );
}

export default Dashboard;