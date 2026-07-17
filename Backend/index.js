const bip39 = require("bip39");
const ethers = require("ethers");
const bitcoin = require("bitcoinjs-lib");
const { BIP32Factory } = require("bip32");
const ecc = require("tiny-secp256k1");
const { Keypair } = require("@solana/web3.js");
const { derivePath } = require("ed25519-hd-key");
const bs58 = require("bs58");

const bip32 = BIP32Factory(ecc);


// ====================== Ethereum ======================

function deriveEthereumWallet(seed) {
  const ethPath = "m/44'/60'/0'/0/0";

  const rootNode = ethers.HDNodeWallet.fromSeed(seed);
  const ethNode = rootNode.derivePath(ethPath);

  return {
    derivationPath: ethPath,
    privateKey: ethNode.privateKey,
    publicKey: ethNode.publicKey,
    address: ethNode.address,
  };
}


// ====================== Bitcoin ======================

function deriveBitcoinWallet(seed) {
  const btcPath = "m/44'/0'/0'/0/0";

  const rootNode = bip32.fromSeed(seed);
  const btcNode = rootNode.derivePath(btcPath);

  const btcAddress = bitcoin.payments.p2pkh({
    pubkey: Buffer.from(btcNode.publicKey),
  }).address;

  const publicKey = Array.from(btcNode.publicKey)
    .map((byte) => byte.toString(16).padStart(2, "0"))
    .join("");

  return {
    derivationPath: btcPath,
    privateKey: btcNode.toWIF(),
    publicKey,
    address: btcAddress,
  };
}


// ====================== Solana ======================

function deriveSolanaWallet(seed) {
  const solanaPath = "m/44'/501'/0'/0'";

  const { key } = derivePath(solanaPath, seed.toString("hex"));

  const solanaKeypair = Keypair.fromSeed(key);

  const encode = bs58.default ? bs58.default.encode : bs58.encode;

  const solanaPrivateKey = encode(solanaKeypair.secretKey);

  return {
    derivationPath: solanaPath,
    privateKey: solanaPrivateKey,
    publicKey: solanaKeypair.publicKey.toBase58(),
    address: solanaKeypair.publicKey.toBase58(),
  };
}


// ====================== Generate Wallet ======================

async function generateWallet() {
  const mnemonic = bip39.generateMnemonic();

  const seed = await bip39.mnemonicToSeed(mnemonic);

  return {
    mnemonic,

    ethereum: deriveEthereumWallet(seed),

    bitcoin: deriveBitcoinWallet(seed),

    solana: deriveSolanaWallet(seed),
  };
}


// ====================== Test ======================

if (require.main === module) {
  generateWallet()
    .then((wallet) => {
      console.log(JSON.stringify(wallet, null, 2));
    })
    .catch(console.error);
}

module.exports = {
  generateWallet,
};


// Export for Express
module.exports = {
  generateWallet,
};