import { useNavigate } from "react-router-dom";
import { useWallet } from "../context/WalletContext";
import API from "../services/api";

function CreateWallet() {
  const navigate = useNavigate();
  const { setWallet } = useWallet();

  const handleCreateWallet = async () => {
    try {
      console.log("Calling backend...");

      const response = await API.get("/generate-wallet");

      console.log(response.data);

      setWallet(response.data);

      navigate("/dashboard");
    } catch (error) {
      console.error(error);
      alert("Failed to generate wallet.");
    }
  };

  return (
    <div className="container">
      <h1>🚀 Create New Wallet</h1>

      <p>
        Generate a secure Ethereum, Bitcoin and Solana wallet with one click.
      </p>

      <button
        className="generate-btn"
        onClick={handleCreateWallet}
      >
        Generate Wallet
      </button>
    </div>
  );
}

export default CreateWallet;