import QRCode from "react-qr-code";

function QRCodeModal({ address }) {
  return (
    <div className="wallet-card">
      <h2>Receive</h2>

      <QRCode value={address} size={180} />

      <p className="address">{address}</p>
    </div>
  );
}

export default QRCodeModal;