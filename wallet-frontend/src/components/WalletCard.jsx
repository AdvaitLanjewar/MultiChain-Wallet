function WalletCard({ title, address, privateKey, balance }) {
  return (
    <div className="wallet-card">

      <h2>{title}</h2>

      <p>
        <strong>Address:</strong><br />
        {address}
      </p>

      <p>
        <strong>Private Key:</strong><br />
        {privateKey}
      </p>

      <p>
        <strong>Balance:</strong><br />
        {balance}
      </p>

    </div>
  );
}

export default WalletCard;