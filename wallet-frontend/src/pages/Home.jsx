import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { 
  Wallet, Download, ShieldCheck, Layers, Cpu, Zap, QrCode, 
  PieChart, Sparkles, Lock, Key, Server, CheckCircle2, TrendingUp, TrendingDown,
  ArrowRight, Shield, Globe, Terminal, RefreshCw
} from "lucide-react";

import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { getCryptoPricesWithDetails } from "../services/priceService";
import { useWallet } from "../context/WalletContext";

function Home() {
  const navigate = useNavigate();
  const { wallet } = useWallet();
  const [prices, setPrices] = useState({
    bitcoin: { price: 65420.5, change24h: 2.45 },
    ethereum: { price: 3480.25, change24h: -1.15 },
    solana: { price: 148.8, change24h: 5.32 },
  });
  const [loadingPrices, setLoadingPrices] = useState(false);

  const fetchPrices = async () => {
    setLoadingPrices(true);
    try {
      const data = await getCryptoPricesWithDetails();
      setPrices(data);
    } catch (e) {
      console.error("Error loading prices on home page", e);
    } finally {
      setLoadingPrices(false);
    }
  };

  useEffect(() => {
    fetchPrices();
  }, []);

  const stats = [
    { label: "Supported Blockchains", val: "3 Blockchains" },
    { label: "HD Wallet Standard", val: "BIP39 Compliant" },
    { label: "Security Protocol", val: "Local Storage" },
    { label: "Architecture", val: "Open Source" },
    { label: "Market Data", val: "Real-time Prices" },
  ];

  const networks = [
    {
      name: "Ethereum",
      symbol: "ETH",
      color: "#627EEA",
      icon: "Ξ",
      desc: "Full support for Ethereum mainnet addresses, transactions, and EVM ecosystem balance tracking."
    },
    {
      name: "Bitcoin",
      symbol: "BTC",
      color: "#F7931A",
      icon: "₿",
      desc: "Native Bitcoin HD wallet generation with segwit/legacy address format support."
    },
    {
      name: "Solana",
      symbol: "SOL",
      color: "#14F195",
      icon: "◎",
      desc: "Ultra-fast Solana network keypair creation and SOL token balance management."
    }
  ];

  const features = [
    {
      title: "Multi-Chain Wallet",
      desc: "Manage Ethereum, Bitcoin, and Solana from a single unified seed phrase without switching apps.",
      icon: Layers,
    },
    {
      title: "Secure Mnemonic Storage",
      desc: "Generated using industry standard BIP39 12-word recovery seed phrases stored locally.",
      icon: Key,
    },
    {
      title: "Fast Transactions",
      desc: "Optimized multi-chain transaction dispatching with real-time hash verification.",
      icon: Zap,
    },
    {
      title: "QR Code Support",
      desc: "Instant QR code generation for effortless crypto receiving across all supported blockchains.",
      icon: QrCode,
    },
    {
      title: "Live Portfolio Tracking",
      desc: "Real-time USD valuation with 24-hour price change metrics from CoinGecko API.",
      icon: PieChart,
    },
    {
      title: "Demo Trading Mode",
      desc: "Simulate crypto transactions and test trading strategies risk-free on testnet environments.",
      icon: Cpu,
      comingSoon: true,
    },
  ];

  const whyNexus = [
    {
      title: "Multi-Chain Native",
      desc: "One key unlocks Ethereum, Bitcoin, and Solana simultaneously without fragmented wallets.",
      icon: Globe,
    },
    {
      title: "Secure Wallet Generation",
      desc: "Cryptographically secure keypair derivation powered by bip39, ethers.js, and web3.js.",
      icon: Cpu,
    },
    {
      title: "100% Local Ownership",
      desc: "Your private keys never leave your browser memory. True self-custodial architecture.",
      icon: Lock,
    },
    {
      title: "Open-Source Project",
      desc: "Clean, auditable React codebase built for transparency and academic innovation.",
      icon: Terminal,
    },
    {
      title: "Fast & Smooth Performance",
      desc: "Instant page renders, zero server latency, and glassmorphic micro-animations.",
      icon: Zap,
    },
  ];

  const steps = [
    {
      step: "01",
      title: "Create or Import Wallet",
      desc: "Generate a new 12-word BIP39 seed phrase or safely import your existing recovery phrase."
    },
    {
      step: "02",
      title: "Manage Assets",
      desc: "View aggregated net worth, live market prices, 24H changes, and asset breakdowns across ETH, BTC, & SOL."
    },
    {
      step: "03",
      title: "Send & Receive Crypto",
      desc: "Easily send funds with fee estimations or scan QR codes to receive crypto instantly."
    }
  ];

  const securityPoints = [
    { title: "BIP39 Mnemonic", desc: "Standard 12-word seed generation with high entropy randomness.", icon: Key },
    { title: "Local Wallet Storage", desc: "Encrypted storage in your browser storage with instant session clear.", icon: Lock },
    { title: "Private Key Ownership", desc: "Complete mathematical ownership over all generated keys.", icon: ShieldCheck },
    { title: "No Custodial Storage", desc: "No central database or third party ever holds your keys.", icon: Server },
  ];

  return (
    <div className="landing-page">
      {/* Background Animated Gradient Orbs */}
      <div className="floating-orb orb-1"></div>
      <div className="floating-orb orb-2"></div>
      <div className="floating-orb orb-3"></div>

      <Navbar />

      {/* Hero Section */}
      <section className="landing-hero">
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="hero-pill-badge">
            <Sparkles size={15} />
            <span>Next-Gen Multi-Chain Web3 Wallet</span>
          </div>

          <h1 className="hero-headline">
            Nexus Wallet
          </h1>

          <div className="hero-subtitle">
            A Secure Multi-Chain Cryptocurrency Wallet
          </div>

          <p className="hero-description">
            Experience the future of Web3 asset management. Effortlessly generate, store, and transfer 
            <strong> Ethereum</strong>, <strong>Bitcoin</strong>, and <strong>Solana</strong> cryptocurrencies with non-custodial security and real-time portfolio analytics.
          </p>

          <div className="hero-cta-buttons">
            <button
              type="button"
              className="primary-btn"
              style={{ padding: "14px 28px", fontSize: "16px" }}
              onClick={() => navigate(wallet ? "/dashboard" : "/create-wallet")}
            >
              <Wallet size={20} />
              <span>{wallet ? "Go to Dashboard" : "Create Wallet"}</span>
              <ArrowRight size={18} />
            </button>

            <button
              type="button"
              className="secondary-btn"
              style={{ padding: "14px 24px", fontSize: "16px" }}
              onClick={() => navigate(wallet ? "/dashboard" : "/import-wallet")}
            >
              <Download size={20} />
              <span>{wallet ? "Manage Wallet" : "Import Wallet"}</span>
            </button>
          </div>
        </motion.div>

        {/* Hero Interactive Animated Visual */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="hero-visual-container"
        >
          <div className="floating-crypto-icon eth" title="Ethereum">Ξ</div>
          <div className="floating-crypto-icon btc" title="Bitcoin">₿</div>
          <div className="floating-crypto-icon sol" title="Solana">◎</div>

          <div className="hero-visual-card">
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                <Shield size={18} style={{ color: "#A855F7" }} />
                <span style={{ fontSize: "13px", fontWeight: "700", color: "var(--text-muted)", textTransform: "uppercase" }}>Nexus Vault</span>
              </div>
              <span className="network-badge" style={{ fontSize: "11px", padding: "4px 8px" }}>● Live Mainnet</span>
            </div>

            <div style={{ fontSize: "13px", color: "var(--text-muted)" }}>Total Balance</div>
            <div style={{ fontFamily: "Space Grotesk, sans-serif", fontSize: "36px", fontWeight: "700", margin: "4px 0 16px 0", color: "#F8FAFC" }}>
              $68,949.55
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
              <div className="asset-row" style={{ padding: "10px 12px", background: "rgba(255,255,255,0.03)" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                  <span className="coin-dot eth"></span>
                  <strong>Ethereum</strong>
                </div>
                <div style={{ textAlign: "right", fontSize: "13px" }}>
                  <strong>1.50 ETH</strong>
                  <div style={{ fontSize: "11px", color: "#34D399" }}>+4.25%</div>
                </div>
              </div>

              <div className="asset-row" style={{ padding: "10px 12px", background: "rgba(255,255,255,0.03)" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                  <span className="coin-dot btc"></span>
                  <strong>Bitcoin</strong>
                </div>
                <div style={{ textAlign: "right", fontSize: "13px" }}>
                  <strong>0.85 BTC</strong>
                  <div style={{ fontSize: "11px", color: "#34D399" }}>+2.45%</div>
                </div>
              </div>

              <div className="asset-row" style={{ padding: "10px 12px", background: "rgba(255,255,255,0.03)" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                  <span className="coin-dot sol"></span>
                  <strong>Solana</strong>
                </div>
                <div style={{ textAlign: "right", fontSize: "13px" }}>
                  <strong>24.5 SOL</strong>
                  <div style={{ fontSize: "11px", color: "#34D399" }}>+5.32%</div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </section>

      {/* Project Statistics Section */}
      <section className="stats-banner-section">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="stats-banner-grid"
        >
          {stats.map((st, i) => (
            <div key={i} className="stat-item-pill">
              <div className="stat-check-icon">
                <CheckCircle2 size={16} />
              </div>
              <div>
                <div style={{ fontSize: "12px", color: "var(--text-muted)", fontWeight: "500" }}>✔ {st.label}</div>
                <div>{st.val}</div>
              </div>
            </div>
          ))}
        </motion.div>
      </section>

      {/* Live Market Ticker Cards */}
      <section className="section-wrapper">
        <div className="section-header-center">
          <span className="section-tag">Real-Time Crypto Ticker</span>
          <h2 className="section-title">Live Market Prices</h2>
          <p className="section-desc">Track live market rates and 24-hour fluctuations fetched directly from top crypto feeds.</p>
        </div>

        <div className="ticker-cards-grid">
          {/* Bitcoin Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="crypto-card btc"
          >
            <div className="crypto-card-top">
              <div className="asset-badge">
                <div className="asset-icon-wrapper btc">₿</div>
                <div className="asset-names">
                  <h3>Bitcoin</h3>
                  <span className="asset-symbol">BTC</span>
                </div>
              </div>
              <span className={`badge-24h ${prices.bitcoin?.change24h >= 0 ? "positive" : "negative"}`}>
                {prices.bitcoin?.change24h >= 0 ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
                {prices.bitcoin?.change24h >= 0 ? `+${prices.bitcoin?.change24h.toFixed(2)}%` : `${prices.bitcoin?.change24h.toFixed(2)}%`}
              </span>
            </div>
            <div className="crypto-balance-val" style={{ fontSize: "28px" }}>
              ${prices.bitcoin?.price?.toLocaleString(undefined, { minimumFractionDigits: 2 }) || "65,420.50"}
            </div>
            <div style={{ fontSize: "12px", color: "var(--text-muted)", marginTop: "4px" }}>24H Volume: High Activity</div>
          </motion.div>

          {/* Ethereum Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="crypto-card eth"
          >
            <div className="crypto-card-top">
              <div className="asset-badge">
                <div className="asset-icon-wrapper eth">Ξ</div>
                <div className="asset-names">
                  <h3>Ethereum</h3>
                  <span className="asset-symbol">ETH</span>
                </div>
              </div>
              <span className={`badge-24h ${prices.ethereum?.change24h >= 0 ? "positive" : "negative"}`}>
                {prices.ethereum?.change24h >= 0 ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
                {prices.ethereum?.change24h >= 0 ? `+${prices.ethereum?.change24h.toFixed(2)}%` : `${prices.ethereum?.change24h.toFixed(2)}%`}
              </span>
            </div>
            <div className="crypto-balance-val" style={{ fontSize: "28px" }}>
              ${prices.ethereum?.price?.toLocaleString(undefined, { minimumFractionDigits: 2 }) || "3,480.25"}
            </div>
            <div style={{ fontSize: "12px", color: "var(--text-muted)", marginTop: "4px" }}>24H Volume: High Activity</div>
          </motion.div>

          {/* Solana Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="crypto-card sol"
          >
            <div className="crypto-card-top">
              <div className="asset-badge">
                <div className="asset-icon-wrapper sol">◎</div>
                <div className="asset-names">
                  <h3>Solana</h3>
                  <span className="asset-symbol">SOL</span>
                </div>
              </div>
              <span className={`badge-24h ${prices.solana?.change24h >= 0 ? "positive" : "negative"}`}>
                {prices.solana?.change24h >= 0 ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
                {prices.solana?.change24h >= 0 ? `+${prices.solana?.change24h.toFixed(2)}%` : `${prices.solana?.change24h.toFixed(2)}%`}
              </span>
            </div>
            <div className="crypto-balance-val" style={{ fontSize: "28px" }}>
              ${prices.solana?.price?.toLocaleString(undefined, { minimumFractionDigits: 2 }) || "148.80"}
            </div>
            <div style={{ fontSize: "12px", color: "var(--text-muted)", marginTop: "4px" }}>24H Volume: High Activity</div>
          </motion.div>
        </div>
      </section>

      {/* Why Nexus Wallet? Section */}
      <section className="section-wrapper">
        <div className="section-header-center">
          <span className="section-tag">Built For Security & Speed</span>
          <h2 className="section-title">Why Choose Nexus Wallet?</h2>
          <p className="section-desc">Designed with cryptographic rigor, zero third-party telemetry, and instant blockchain connectivity.</p>
        </div>

        <div className="features-grid">
          {whyNexus.map((item, idx) => {
            const IconComp = item.icon;
            return (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.08 }}
                className="feature-card-item"
              >
                <div>
                  <div className="feature-icon-box">
                    <IconComp size={24} />
                  </div>
                  <h3>{item.title}</h3>
                  <p>{item.desc}</p>
                </div>
              </motion.div>
            );
          })}
        </div>
      </section>

      {/* Supported Networks Section */}
      <section className="section-wrapper">
        <div className="section-header-center">
          <span className="section-tag">Multi-Chain Ecosystem</span>
          <h2 className="section-title">Supported Blockchains</h2>
          <p className="section-desc">Seamlessly interact with the leading layer-1 blockchain networks in one place.</p>
        </div>

        <div className="ticker-cards-grid">
          {networks.map((net, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1 }}
              className="glass-card"
            >
              <div style={{ display: "flex", alignItems: "center", gap: "14px", marginBottom: "16px" }}>
                <div 
                  className="asset-icon-wrapper"
                  style={{
                    background: `${net.color}20`,
                    color: net.color,
                    border: `1px solid ${net.color}40`
                  }}
                >
                  {net.icon}
                </div>
                <div>
                  <h3 style={{ fontSize: "18px", fontWeight: "700" }}>{net.name}</h3>
                  <span className="chain-pill">{net.symbol}</span>
                </div>
              </div>
              <p style={{ fontSize: "14px", color: "var(--text-muted)", lineHeight: "1.6" }}>
                {net.desc}
              </p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Features Section */}
      <section className="section-wrapper">
        <div className="section-header-center">
          <span className="section-tag">Powerful Functionality</span>
          <h2 className="section-title">Features At A Glance</h2>
          <p className="section-desc">Everything you need to send, receive, track, and protect your digital assets.</p>
        </div>

        <div className="features-grid">
          {features.map((feat, idx) => {
            const Icon = feat.icon;
            return (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.08 }}
                className="feature-card-item"
              >
                <div>
                  <div className="feature-icon-box">
                    <Icon size={24} />
                  </div>
                  <h3>{feat.title}</h3>
                  <p>{feat.desc}</p>
                </div>
                {feat.comingSoon && <span className="coming-soon-badge">Coming Soon</span>}
              </motion.div>
            );
          })}
        </div>
      </section>

      {/* How It Works Section */}
      <section className="section-wrapper">
        <div className="section-header-center">
          <span className="section-tag">Simple Setup Process</span>
          <h2 className="section-title">How It Works</h2>
          <p className="section-desc">Get up and running with your multi-chain wallet in less than 60 seconds.</p>
        </div>

        <div className="steps-grid">
          {steps.map((st, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1 }}
              className="step-card"
            >
              <div className="step-number-badge">{st.step}</div>
              <h3 style={{ fontSize: "20px", fontWeight: "700", marginBottom: "10px", color: "var(--text-main)" }}>{st.title}</h3>
              <p style={{ fontSize: "14.5px", color: "var(--text-muted)", lineHeight: "1.6" }}>{st.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Security Section */}
      <section className="section-wrapper">
        <div className="section-header-center">
          <span className="section-tag">Uncompromised Protection</span>
          <h2 className="section-title">Security & Non-Custodial Architecture</h2>
          <p className="section-desc">Your keys, your crypto. We never store or transmit your private seed phrases.</p>
        </div>

        <div className="security-grid">
          {securityPoints.map((sec, idx) => {
            const IconC = sec.icon;
            return (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
                className="security-badge-card"
              >
                <div className="security-badge-icon">
                  <IconC size={22} />
                </div>
                <div>
                  <h4 style={{ fontSize: "16px", fontWeight: "700", marginBottom: "4px", color: "var(--text-main)" }}>{sec.title}</h4>
                  <p style={{ fontSize: "13px", color: "var(--text-muted)", lineHeight: "1.5" }}>{sec.desc}</p>
                </div>
              </motion.div>
            );
          })}
        </div>
      </section>

      <Footer />
    </div>
  );
}

export default Home;