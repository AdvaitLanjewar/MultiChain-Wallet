import Navbar from "../components/Navbar";
import { Navigate } from "react-router-dom";
import { useWallet } from "../context/WalletContext";
function Dashboard() {
  const { wallet } = useWallet();
  console.log("Dashboard wallet:", wallet);

  // If no wallet exists, go back to home
  if (!wallet) {
    return <Navigate to="/" />;
  }

  return (
  <>
    <Navbar />

    <div style={{ padding: "40px" }}>
      <h1>Dashboard</h1>

      <h3>Mnemonic</h3>
      <p>{wallet.mnemonic}</p>

      <hr />

      <h3>Ethereum</h3>
      <p><strong>Address:</strong> {wallet.ethereum.address}</p>

      <hr />

      <h3>Bitcoin</h3>
      <p><strong>Address:</strong> {wallet.bitcoin.address}</p>

      <hr />

      <h3>Solana</h3>
      <p><strong>Address:</strong> {wallet.solana.address}</p>
    </div>
  </>
);
}

export default Dashboard;