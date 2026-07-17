import { Copy } from "lucide-react";
import { Copy, Check } from "lucide-react";
import { useState } from "react";
import toast from "react-hot-toast";

function WalletCard({ title, symbol, address }) {

 const [copied, setCopied] = useState(false);

const copyAddress = async () => {
  await navigator.clipboard.writeText(address);

  setCopied(true);
  toast.success(`${title} address copied!`);

  setTimeout(() => {
    setCopied(false);
  }, 2000);
};
  return (
    <div className="wallet-card">

      <h2>{title}</h2>

      <p>{symbol}</p>

      <p className="address">
        {address}
      </p>

      <button onClick={copyAddress}>
  {copied ? <Check size={18} /> : <Copy size={18} />}
  {copied ? " Copied" : " Copy"}
</button>
    </div>
  );
}

export default WalletCard;