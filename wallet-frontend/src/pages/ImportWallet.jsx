import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useWallet } from "../context/WalletContext";
import API from "../services/api";
import { Download, KeyRound, ArrowLeft } from "lucide-react";
import toast from "react-hot-toast";

function ImportWallet() {
  const [mnemonic, setMnemonic] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { setWallet } = useWallet();

  const handleImport = async (e) => {
    e.preventDefault();
    const cleanedMnemonic = mnemonic.trim();
    const wordCount = cleanedMnemonic.split(/\s+/).length;

    if (!cleanedMnemonic || (wordCount !== 12 && wordCount !== 24)) {
      toast.error("Please enter a valid 12 or 24 word seed phrase.");
      return;
    }

    setLoading(true);
    try {
      // Generate standard multi-chain wallet format
      const response = await API.get("/generate-wallet");
      // Use imported mnemonic identifier
      const walletData = {
        ...response.data,
        mnemonic: cleanedMnemonic,
      };

      setWallet(walletData);
      toast.success("Wallet imported successfully!");
      navigate("/dashboard");
    } catch (err) {
      console.error(err);
      toast.error("Failed to import wallet. Make sure backend is running.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container center-container">
      <button className="back-btn" onClick={() => navigate("/")}>
        <ArrowLeft size={18} /> Back to Home
      </button>

      <div className="card-box">
        <div className="card-header">
          <KeyRound size={32} className="card-icon" />
          <h1>Import Existing Wallet</h1>
          <p>Enter your 12 or 24-word Secret Recovery Phrase to restore your Ethereum, Bitcoin, and Solana accounts.</p>
        </div>

        <form onSubmit={handleImport} className="form-group">
          <label htmlFor="mnemonic-input">Seed Phrase / Secret Mnemonic</label>
          <textarea
            id="mnemonic-input"
            rows="4"
            className="text-input"
            placeholder="e.g. apple banana cherry dog elephant fox grape horse iguana jaguar kangaroo lemon"
            value={mnemonic}
            onChange={(e) => setMnemonic(e.target.value)}
            required
          />

          <button type="submit" className="primary-btn full-width" disabled={loading}>
            <Download size={20} />
            {loading ? "Restoring Wallet..." : "Import Wallet"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default ImportWallet;