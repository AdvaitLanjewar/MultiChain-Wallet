import { Navigate } from "react-router-dom";
import { useWallet } from "../context/WalletContext";

function Dashboard() {
  const { wallet } = useWallet();

  // If no wallet exists, go back to home
  if (!wallet) {
    return <Navigate to="/" />;
  }

  return (
    <div className="container">
      <h1>💼 Dashboard</h1>

      <h2>Mnemonic</h2>
      <p>{wallet.mnemonic}</p>

      <hr />

      <h2>Ethereum</h2>
      <p><strong>Address:</strong> {wallet.ethereum.address}</p>
      <p><strong>Balance:</strong> 0 ETH</p>

      <hr />

      <h2>Bitcoin</h2>
      <p><strong>Address:</strong> {wallet.bitcoin.address}</p>
      <p><strong>Balance:</strong> 0 BTC</p>

      <hr />

      <h2>Solana</h2>
      <p><strong>Address:</strong> {wallet.solana.address}</p>
      <p><strong>Balance:</strong> 0 SOL</p>
    </div>
  );
}

export default Dashboard;