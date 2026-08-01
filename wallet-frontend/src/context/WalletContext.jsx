import { createContext, useContext, useState, useEffect } from "react";

const WalletContext = createContext();

export function WalletProvider({ children }) {
  const [wallet, setWallet] = useState(() => {
    try {
      const saved = localStorage.getItem("nexus_wallet");
      return saved ? JSON.parse(saved) : null;
    } catch (e) {
      console.error("Error reading saved wallet", e);
      return null;
    }
  });

  useEffect(() => {
    if (wallet) {
      localStorage.setItem("nexus_wallet", JSON.stringify(wallet));
    } else {
      localStorage.removeItem("nexus_wallet");
    }
  }, [wallet]);

  const logoutWallet = () => {
    setWallet(null);
    localStorage.removeItem("nexus_wallet");
  };

  return (
    <WalletContext.Provider value={{ wallet, setWallet, logoutWallet }}>
      {children}
    </WalletContext.Provider>
  );
}

export function useWallet() {
  return useContext(WalletContext);
}