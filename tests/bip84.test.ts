import ecc from "@bitcoinerlab/secp256k1";
import BIP32Factory from "bip32";
import * as bip39 from "bip39";
import * as bitcoin from "bitcoinjs-lib";
import { describe, expect, test } from "vitest";

const bip32 = BIP32Factory(ecc);
const mnemonic = "test test test test test test test test test test test junk";
const seed = bip39.mnemonicToSeedSync(mnemonic);

const bitcoinZpubNetwork: bitcoin.Network = {
  messagePrefix: "\x18Bitcoin Signed Message:\n",
  bech32: "bc",
  bip32: { public: 0x04b24746, private: 0x04b2430c },
  pubKeyHash: 0x00,
  scriptHash: 0x05,
  wif: 0x80,
};

const bitcoinTestnetVpubNetwork: bitcoin.Network = {
  messagePrefix: "\x18Bitcoin Signed Message:\n",
  bech32: "tb",
  bip32: { public: 0x045f1cf6, private: 0x045f18bc },
  pubKeyHash: 0x6f,
  scriptHash: 0xc4,
  wif: 0xef,
};

describe("BIP84 bitcoin", () => {
  const root = bip32.fromSeed(seed, bitcoinZpubNetwork);
  const extended = root.derivePath("m/84'/0'/0'/0");
  const keyPair = extended.derive(0);

  test("root key", () => {
    expect(root.toBase58()).toBe(
      "zprvAWgYBBk7JR8GkJbc728rxpURyyL9HP7DGEyzywkeeW98FCVZdG9zvptA6RGGrvLbTbRdBTEmJd556aNmLsu3exxSaBaMFzy4CkBYatzD7pZ",
    );
  });

  test("extended key", () => {
    expect(extended.toBase58()).toBe(
      "zprvAfsm95N34F9k2r7vFg89PZkE6hgfE3XTW5urgFA9cpqyGkGF1db2QFFuCmVAHT63twPinA9s2gbgRFBjwMFTzL4epYtNZVwHvPrgaWAmjpE",
    );
    expect(extended.neutered().toBase58()).toBe(
      "zpub6ts7Yatvtci3FLCPMhf9khgxejX9dWFJsJqTUdZmBANx9YbPZAuGx3aP43rSQ8DwSkRZd5yVKVeb4u7FDs5SscVxynmRCTw7jL34B4pis7L",
    );
  });

  test("derived key", () => {
    expect(keyPair.toWIF()).toBe("L36mwqGFbLzrxfE2mYsnu8LC12JXheMh5tp6kwLfwhRuav1AZfvd");
    expect(Buffer.from(keyPair.publicKey).toString("hex")).toBe(
      "03fc2a760d930aa1459b35185f45784f4b42050311b232ed490f05db13f448e154",
    );
  });

  test("address", () => {
    const { address } = bitcoin.payments.p2wpkh({ pubkey: keyPair.publicKey, network: bitcoinZpubNetwork });
    expect(address).toBe("bc1q4qw42stdzjqs59xvlrlxr8526e3nunw7mp73te");
  });
});

describe("BIP84 bitcoin testnet", () => {
  const root = bip32.fromSeed(seed, bitcoinTestnetVpubNetwork);
  const extended = root.derivePath("m/84'/1'/0'/0");
  const keyPair = extended.derive(0);

  test("root key", () => {
    expect(root.toBase58()).toBe(
      "vprv9DMUxX4ShgxMM7q8mazN8U6RJ6kMWu9Dbnu7rNB78Udc2oEecdVkSaFc1bRvsHiuq2xQBYrXTyesZRvWU6EzU2E36pnevMh77qvy2eSpdU3",
    );
  });

  test("extended key", () => {
    expect(extended.toBase58()).toBe(
      "vprv9MVSgaRQoM3BjfDvYmkrjQfvFPwfnJ7ApRbcfcKVLE3suWxZhHXdKCLHVyQ5R6dk4RpGYd18qbbQgkUwd7KCZDV1Dx2iHsw6hQuCXtBRwHD",
    );
    expect(extended.neutered().toBase58()).toBe(
      "vpub5aUo65xJdibUx9JPeoHs6YceoRnABkq2BeXDTzj6tZarnKHiEpqsrzemMEdw2Lf8Mbgo9FHWWM3kBa2VX6ccoozMhKEVHKHR7cF6JErZHAq",
    );
  });

  test("derived key", () => {
    expect(keyPair.toWIF()).toBe("cTg4nG8mNSaQr1KV1a3erZaAGk3deLnKivYnfEkKaSJrvnja6Pjd");
    expect(Buffer.from(keyPair.publicKey).toString("hex")).toBe(
      "03f3d474c86c9be5b82e251cc3cc438d3cc361527b4b9799516c4bd513caf9e5f6",
    );
  });

  test("address", () => {
    const { address } = bitcoin.payments.p2wpkh({ pubkey: keyPair.publicKey, network: bitcoinTestnetVpubNetwork });
    expect(address).toBe("tb1qquv9lg5g2r4jkr0ahun0ddfg5xntxjelvmc7t8");
  });
});

describe("BIP84 bitcoin (from zpub)", () => {
  const zpub =
    "zpub6ts7Yatvtci3FLCPMhf9khgxejX9dWFJsJqTUdZmBANx9YbPZAuGx3aP43rSQ8DwSkRZd5yVKVeb4u7FDs5SscVxynmRCTw7jL34B4pis7L";
  const keyPair = bip32.fromBase58(zpub, bitcoinZpubNetwork).derive(0);

  test("public key", () => {
    expect(Buffer.from(keyPair.publicKey).toString("hex")).toBe(
      "03fc2a760d930aa1459b35185f45784f4b42050311b232ed490f05db13f448e154",
    );
  });

  test("address", () => {
    const { address } = bitcoin.payments.p2wpkh({ pubkey: keyPair.publicKey, network: bitcoinZpubNetwork });
    expect(address).toBe("bc1q4qw42stdzjqs59xvlrlxr8526e3nunw7mp73te");
  });
});

describe("BIP84 bitcoin testnet (from vpub)", () => {
  const vpub =
    "vpub5aUo65xJdibUx9JPeoHs6YceoRnABkq2BeXDTzj6tZarnKHiEpqsrzemMEdw2Lf8Mbgo9FHWWM3kBa2VX6ccoozMhKEVHKHR7cF6JErZHAq";
  const keyPair = bip32.fromBase58(vpub, bitcoinTestnetVpubNetwork).derive(0);

  test("public key", () => {
    expect(Buffer.from(keyPair.publicKey).toString("hex")).toBe(
      "03f3d474c86c9be5b82e251cc3cc438d3cc361527b4b9799516c4bd513caf9e5f6",
    );
  });

  test("address", () => {
    const { address } = bitcoin.payments.p2wpkh({ pubkey: keyPair.publicKey, network: bitcoinTestnetVpubNetwork });
    expect(address).toBe("tb1qquv9lg5g2r4jkr0ahun0ddfg5xntxjelvmc7t8");
  });
});
