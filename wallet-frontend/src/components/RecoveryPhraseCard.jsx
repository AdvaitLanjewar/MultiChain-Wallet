import { useState } from "react";
import { Eye, EyeOff, ShieldAlert, KeyRound } from "lucide-react";
import CopyButton from "./CopyButton";

function RecoveryPhraseCard({ mnemonic }) {
  const [showPhrase, setShowPhrase] = useState(false);

  const words = mnemonic ? mnemonic.trim().split(/\s+/) : [];

  return (
    <div className="glass-card recovery-phrase-card">
      <div className="widget-title-row">
        <h3>
          <KeyRound size={20} style={{ color: "#F59E0B" }} />
          <span>Secret Recovery Phrase</span>
        </h3>

        <button
          type="button"
          className="secondary-btn-sm"
          onClick={() => setShowPhrase(!showPhrase)}
        >
          {showPhrase ? <EyeOff size={14} /> : <Eye size={14} />}
          <span>{showPhrase ? "Hide Phrase" : "Show Phrase"}</span>
        </button>
      </div>

      <div className="security-warning-box">
        <ShieldAlert size={20} style={{ flexShrink: 0, marginTop: "2px" }} />
        <div>
          <strong>Keep your recovery phrase secret!</strong> Never share it with anyone. Phantom or Nexus Wallet will never ask for your recovery seed.
        </div>
      </div>

      {showPhrase ? (
        <div>
          <div className="words-grid">
            {words.map((word, idx) => (
              <div key={idx} className="word-chip">
                <span className="word-num">{idx + 1}.</span>
                <span className="word-val">{word}</span>
              </div>
            ))}
          </div>

          <div style={{ marginTop: "16px", display: "flex", justifyContent: "flex-end" }}>
            <CopyButton text={mnemonic} label="Copy Recovery Phrase" successMessage="Recovery phrase copied securely!" />
          </div>
        </div>
      ) : (
        <div style={{
          background: "rgba(0,0,0,0.3)",
          padding: "20px",
          borderRadius: "14px",
          textAlign: "center",
          border: "1px dashed rgba(255,255,255,0.15)",
          color: "var(--text-muted)",
          fontSize: "14px"
        }}>
          •••••••• •••••••• •••••••• •••••••• ••••••••
          <p style={{ marginTop: "8px", fontSize: "12px", color: "var(--text-dim)" }}>
            Click "Show Phrase" above to reveal your 12-word seed phrase.
          </p>
        </div>
      )}
    </div>
  );
}

export default RecoveryPhraseCard;
