import ecc from "@bitcoinerlab/secp256k1";
import BIP32Factory from "bip32";
import * as bitcoin from "bitcoinjs-lib";
import { Base58AddressFormatVersion, encodeBase58AddressFormat, encodeCashAddress, hash160 } from "@bitauth/libauth";
import { ethers } from "ethers";
import { describe, expect, test } from "vitest";

const bip32 = BIP32Factory(ecc);

const litecoinNetwork: bitcoin.Network = {
  messagePrefix: "\x18Litecoin Signed Message:\n",
  bech32: "ltc",
  bip32: { public: 0x019da462, private: 0x019d9cfe },
  pubKeyHash: 0x30,
  scriptHash: 0x32,
  wif: 0xb0,
};

const litecoinTestnetNetwork: bitcoin.Network = {
  messagePrefix: "\x18Litecoin Signed Message:\n",
  bech32: "tltc",
  bip32: { public: 0x043587cf, private: 0x04358394 },
  pubKeyHash: 0x6f,
  scriptHash: 0x3a,
  wif: 0xef,
};

describe("BIP44 bitcoin (from xpub)", () => {
  const xpub =
    "xpub6ExatYJPmp8CUH4qmK7rfr348kLNKMAS4LSuWF4AdcZx4yKp3KKr5juVRgkXjqPXXyK66CiPQkwKpcN5BomKgcEHa5HeDYRbsAKJwQ8CxfV";
  const keyPair = bip32.fromBase58(xpub).derive(0);

  test("public key", () => {
    expect(Buffer.from(keyPair.publicKey).toString("hex")).toBe(
      "02c29ab360da10dbcfe26000e13232911bcedc83bfd4c758ad7eaaed5f5ef8ebca",
    );
  });

  test("address", () => {
    const { address } = bitcoin.payments.p2pkh({ pubkey: keyPair.publicKey });
    expect(address).toBe("1Ei9UmLQv4o4UJTy5r5mnGFeC9auM3W5P1");
  });
});

describe("BIP44 bitcoin testnet (from xpub)", () => {
  const network = bitcoin.networks.testnet;
  const xpub =
    "tpubDFgnzxZPaaoEJZs2ZPYvf4NnVgSJjotRx98uULi5bFbUdgFKkyXhJZo6dsQMwUjKmkedoLKgnZUHC2LuTJz9kCtsKeiRsMc37Qe7FtKv68e";
  const keyPair = bip32.fromBase58(xpub, network).derive(0);

  test("public key", () => {
    expect(Buffer.from(keyPair.publicKey).toString("hex")).toBe(
      "03244b42a9df73401473dff8ec9c7f85a080952c342494214d99a5ab13d6a71864",
    );
  });

  test("address", () => {
    const { address } = bitcoin.payments.p2pkh({ pubkey: keyPair.publicKey, network });
    expect(address).toBe("n118YqfT1hk8uvXcqcy4fwLDfVQfJpQTaS");
  });
});

describe("BIP44 ethereum (from xpub)", () => {
  const xpub =
    "xpub6DyUKdwoLWmUJ4Tn9Bbsdtx7B5Ws18mEN19e5HT52ikE53FiUheSQXrZUNPovqfyKmw4579A1Mm3GXXKM39N64uooBfJ4tNAzFsEbodRTx4";
  const keyPair = bip32.fromBase58(xpub).derive(0);

  test("public key", () => {
    expect("0x" + Buffer.from(keyPair.publicKey).toString("hex")).toBe(
      "0x038318535b54105d4a7aae60c08fc45f9687181b4fdfc625bd1a753fa7397fed75",
    );
  });

  test("address", () => {
    const address = ethers.computeAddress(`0x${Buffer.from(keyPair.publicKey).toString("hex")}`);
    expect(address).toBe("0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266");
  });
});

describe("BIP44 litecoin (from xpub)", () => {
  const xpub =
    "Ltub2bnQcEV6V7yTa25rGoJAPgfFoJNFWeR8EZ35NZoQwNsxjqbQtxGwpNeFE6yXHBSuKUJjL1Qq3HQM7kcTsU8WYycKfRBiuJvUrHj22u9mW2r";
  const keyPair = bip32.fromBase58(xpub, litecoinNetwork).derive(0);

  test("public key", () => {
    expect(Buffer.from(keyPair.publicKey).toString("hex")).toBe(
      "028e7c69e6ebf8210a8208a97471d4c82ee270fc384b4a0868e136730efbdf59dd",
    );
  });

  test("address", () => {
    const { address } = bitcoin.payments.p2pkh({ pubkey: keyPair.publicKey, network: litecoinNetwork });
    expect(address).toBe("Ld797g7vcD34F4m3pCR5fb1Z98yEswMLGX");
  });
});

describe("BIP44 litecoin testnet (from xpub)", () => {
  const xpub =
    "tpubDFgnzxZPaaoEJZs2ZPYvf4NnVgSJjotRx98uULi5bFbUdgFKkyXhJZo6dsQMwUjKmkedoLKgnZUHC2LuTJz9kCtsKeiRsMc37Qe7FtKv68e";
  const keyPair = bip32.fromBase58(xpub, litecoinTestnetNetwork).derive(0);

  test("public key", () => {
    expect(Buffer.from(keyPair.publicKey).toString("hex")).toBe(
      "03244b42a9df73401473dff8ec9c7f85a080952c342494214d99a5ab13d6a71864",
    );
  });

  test("address", () => {
    const { address } = bitcoin.payments.p2pkh({ pubkey: keyPair.publicKey, network: litecoinTestnetNetwork });
    expect(address).toBe("n118YqfT1hk8uvXcqcy4fwLDfVQfJpQTaS");
  });
});

describe("BIP44 bitcoin cash (from xpub)", () => {
  const xpub =
    "xpub6DmQgNc99pATbujRWkQqGwjnj4VVj6dRyA13a9PXY8BJ6TKiwPfGPaGjb63fSmjphQwrNxvT7e9pejN7RiQ9LfLLi8oqwkeAmQQhMDemCWB";
  const keyPair = bip32.fromBase58(xpub).derive(0);

  test("public key", () => {
    expect(Buffer.from(keyPair.publicKey).toString("hex")).toBe(
      "02f959a1ad36b2c63d316ce78be20cdc2ead12c7cf8965a82a08ae77e28f3d857d",
    );
  });

  test("address", () => {
    const pubKey = new Uint8Array(keyPair.publicKey);
    const h160 = hash160(pubKey);
    const cashAddr = encodeCashAddress({ prefix: "bitcoincash", type: "p2pkh", payload: h160 });
    expect(cashAddr.address).toBe("bitcoincash:qzpsvg9z6mk3ttd9vmss3rwfdgfd0r7wcuwtmlaskf");
    const legacyAddr = encodeBase58AddressFormat(Base58AddressFormatVersion.p2pkhCopayBCH, h160);
    expect(legacyAddr).toBe("CUQgRv6C47K4ojXP1sTdhf11WayY1nf4Sf");
  });
});
