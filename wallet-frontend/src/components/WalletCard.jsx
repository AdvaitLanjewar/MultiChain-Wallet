import { Copy } from "lucide-react";

function WalletCard({ title, symbol, address }) {

  const copyAddress = () => {
    navigator.clipboard.writeText(address);
    alert("Address copied!");
  };

  return (
    <div className="wallet-card">

      <h2>{title}</h2>

      <p>{symbol}</p>

      <p className="address">
        {address}
      </p>

      <button onClick={copyAddress}>
        <Copy size={18} />
        Copy
      </button>

    </div>
  );
}

export default WalletCard;