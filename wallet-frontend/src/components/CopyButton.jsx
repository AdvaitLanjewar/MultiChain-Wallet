import { useState } from "react";
import { Copy, Check } from "lucide-react";
import toast from "react-hot-toast";

function CopyButton({ text, label = "Copy", successMessage = "Copied to clipboard!" }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async (e) => {
    e.stopPropagation();
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      toast.success(successMessage);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      toast.error("Failed to copy");
      console.error(error);
    }
  };

  return (
    <button
      type="button"
      className={`copy-btn-component ${copied ? "copied" : ""}`}
      onClick={handleCopy}
      title={label}
    >
      {copied ? <Check size={14} /> : <Copy size={14} />}
      <span>{copied ? "Copied" : label}</span>
    </button>
  );
}

export default CopyButton;
