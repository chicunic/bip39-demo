import ecc from '@bitcoinerlab/secp256k1';
import BIP32Factory from 'bip32';
import * as bip39 from 'bip39';
import * as bitcoin from 'bitcoinjs-lib';
import { Base58AddressFormatVersion, encodeCashAddress, encodeBase58AddressFormat, hash160 } from '@bitauth/libauth';
import { ethers } from 'ethers';
import { describe, expect, test } from 'vitest';
import { deriveAddress } from 'xrpl';

const bip32 = BIP32Factory(ecc);
const mnemonic = 'test test test test test test test test test test test junk';
const seed = bip39.mnemonicToSeedSync(mnemonic);
const expectedSeed =
  '9dfc3c64c2f8bede1533b6a79f8570e5943e0b8fd1cf77107adf7b72cef42185d564a3aee24cab43f80e3c4538087d70fc824eabbad596a23c97b6ee8322ccc0';

const litecoinNetwork: bitcoin.Network = {
  messagePrefix: '\x18Litecoin Signed Message:\n',
  bech32: 'ltc',
  bip32: { public: 0x019da462, private: 0x019d9cfe },
  pubKeyHash: 0x30,
  scriptHash: 0x32,
  wif: 0xb0,
};

const litecoinTestnetNetwork: bitcoin.Network = {
  messagePrefix: '\x18Litecoin Signed Message:\n',
  bech32: 'tltc',
  bip32: { public: 0x043587cf, private: 0x04358394 },
  pubKeyHash: 0x6f,
  scriptHash: 0x3a,
  wif: 0xef,
};

describe('BIP39 seed', () => {
  test('mnemonic to seed', () => {
    expect(Buffer.from(seed).toString('hex')).toBe(expectedSeed);
  });
});

describe('BIP44 bitcoin', () => {
  const root = bip32.fromSeed(seed);
  const extended = root.derivePath("m/44'/0'/0'/0");
  const keyPair = extended.derive(0);

  test('root key', () => {
    expect(root.toBase58()).toBe(
      'xprv9s21ZrQH143K3iDNSJZcYeHRe33FQ98DS1wZR9xstVPN8zs77wpsghZt41M6s72keKC1gW3ePJMyL19duV524VbEqWBW6BL5fJ4FopSgNLz',
    );
  });

  test('extended key', () => {
    expect(extended.toBase58()).toBe(
      'xprvA1yEV2mVwSZuFnzNfHarJi6KaiVsutSah7XJhreZ5H2yCAzfVn1bXwb1aRPMxMX8kZQUgCx6f8EaaZkYFwmML9P7tTGHizSDAfrG2Wpw1HF',
    );
    expect(extended.neutered().toBase58()).toBe(
      'xpub6ExatYJPmp8CUH4qmK7rfr348kLNKMAS4LSuWF4AdcZx4yKp3KKr5juVRgkXjqPXXyK66CiPQkwKpcN5BomKgcEHa5HeDYRbsAKJwQ8CxfV',
    );
  });

  test('derived key', () => {
    expect(keyPair.toWIF()).toBe('L2bFui7UKQcjxaxJLKAx8gQUJyEvbcEjLNqUDfuahmLf9TDhX5Ad');
    expect(Buffer.from(keyPair.publicKey).toString('hex')).toBe(
      '02c29ab360da10dbcfe26000e13232911bcedc83bfd4c758ad7eaaed5f5ef8ebca',
    );
  });

  test('address', () => {
    const { address } = bitcoin.payments.p2pkh({ pubkey: keyPair.publicKey });
    expect(address).toBe('1Ei9UmLQv4o4UJTy5r5mnGFeC9auM3W5P1');
  });
});

describe('BIP44 bitcoin testnet', () => {
  const network = bitcoin.networks.testnet;
  const root = bip32.fromSeed(seed, network);
  const extended = root.derivePath("m/44'/1'/0'/0");
  const keyPair = extended.derive(0);

  test('root key', () => {
    expect(root.toBase58()).toBe(
      'tprv8ZgxMBicQKsPeXSu6sR7iHuQxATTdfADmZrgHaPLNTsqvbcC7KAdCSwKyBWksUR51kingbfQYewmnrhP2hQxsYrqN9PokY48aPogFWeqwk7',
    );
  });

  test('extended key', () => {
    expect(extended.toBase58()).toBe(
      'tprv8izkrYX9SD7ZR6qEfjtLFeifvevNaUhXNqY8BpfnAyo5oBzZ8ai785BETjCi9izNp8JCsqyAeL7S4BhCaoaJK5JpSXkaC3CmrDWPRtuctHR',
    );
    expect(extended.neutered().toBase58()).toBe(
      'tpubDFgnzxZPaaoEJZs2ZPYvf4NnVgSJjotRx98uULi5bFbUdgFKkyXhJZo6dsQMwUjKmkedoLKgnZUHC2LuTJz9kCtsKeiRsMc37Qe7FtKv68e',
    );
  });

  test('derived key', () => {
    expect(keyPair.toWIF()).toBe('cRk4HVE9qfekpVFc72PMjEahdoiMkfaZpXBwBNRoqkk8hnsn8Kf8');
    expect(Buffer.from(keyPair.publicKey).toString('hex')).toBe(
      '03244b42a9df73401473dff8ec9c7f85a080952c342494214d99a5ab13d6a71864',
    );
  });

  test('address', () => {
    const { address } = bitcoin.payments.p2pkh({ pubkey: keyPair.publicKey, network });
    expect(address).toBe('n118YqfT1hk8uvXcqcy4fwLDfVQfJpQTaS');
  });
});

describe('BIP44 ethereum', () => {
  const root = bip32.fromSeed(seed);
  const extended = root.derivePath("m/44'/60'/0'/0");
  const keyPair = extended.derive(0);

  test('extended key', () => {
    expect(extended.toBase58()).toBe(
      'xprv9zz7v8QuW9DB5aPK3A4sGm1Nd3gNbg3NznE3Gu3TUPDFCEvZwALBrjY5d5h8eyKywqqFkKXDaxAKsmL4qVMzN3wBGaC2h3WoJT74EVuGwZi',
    );
    expect(extended.neutered().toBase58()).toBe(
      'xpub6DyUKdwoLWmUJ4Tn9Bbsdtx7B5Ws18mEN19e5HT52ikE53FiUheSQXrZUNPovqfyKmw4579A1Mm3GXXKM39N64uooBfJ4tNAzFsEbodRTx4',
    );
  });

  test('derived key', () => {
    expect('0x' + Buffer.from(keyPair.privateKey!).toString('hex')).toBe(
      '0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80',
    );
    expect('0x' + Buffer.from(keyPair.publicKey).toString('hex')).toBe(
      '0x038318535b54105d4a7aae60c08fc45f9687181b4fdfc625bd1a753fa7397fed75',
    );
  });

  test('address', () => {
    const address = ethers.computeAddress(`0x${Buffer.from(keyPair.publicKey).toString('hex')}`);
    expect(address).toBe('0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266');
  });
});

describe('BIP44 litecoin', () => {
  const root = bip32.fromSeed(seed, litecoinNetwork);
  const extended = root.derivePath("m/44'/2'/0'/0");
  const keyPair = extended.derive(0);

  test('root key', () => {
    expect(root.toBase58()).toBe(
      'Ltpv71G8qDifUiNetgrwtCcEh4WAqJW7V8oYqzy7NeMJt8yT9odyzabS3YGY1mt7jpfwZRmHm1hAYP4dKWGiJc3zhbxao58gQ8P7Tgg9sEiL2Wn',
    );
  });

  test('extended key', () => {
    expect(extended.toBase58()).toBe(
      'Ltpv7Ac51T4ZEySVx9P22BonK6q3Mjg4SPrUA2w3hb381C6N9UQLa3EWomXyyk4c3tvEPxuWxHdmEdssRHBiph81cYzUbMX6yjE3aSpDoBfAjDC',
    );
    expect(extended.neutered().toBase58()).toBe(
      'Ltub2bnQcEV6V7yTa25rGoJAPgfFoJNFWeR8EZ35NZoQwNsxjqbQtxGwpNeFE6yXHBSuKUJjL1Qq3HQM7kcTsU8WYycKfRBiuJvUrHj22u9mW2r',
    );
  });

  test('derived key', () => {
    expect(keyPair.toWIF()).toBe('TAEsBE6iHfMbaibRmrURhpDJzSkkqij2Y4jZY26JxqXe6SoqiT9R');
    expect(Buffer.from(keyPair.publicKey).toString('hex')).toBe(
      '028e7c69e6ebf8210a8208a97471d4c82ee270fc384b4a0868e136730efbdf59dd',
    );
  });

  test('address', () => {
    const { address } = bitcoin.payments.p2pkh({ pubkey: keyPair.publicKey, network: litecoinNetwork });
    expect(address).toBe('Ld797g7vcD34F4m3pCR5fb1Z98yEswMLGX');
  });
});

describe('BIP44 litecoin testnet', () => {
  const root = bip32.fromSeed(seed, litecoinTestnetNetwork);
  const extended = root.derivePath("m/44'/1'/0'/0");
  const keyPair = extended.derive(0);

  test('root key', () => {
    expect(root.toBase58()).toBe(
      'tprv8ZgxMBicQKsPeXSu6sR7iHuQxATTdfADmZrgHaPLNTsqvbcC7KAdCSwKyBWksUR51kingbfQYewmnrhP2hQxsYrqN9PokY48aPogFWeqwk7',
    );
  });

  test('extended key', () => {
    expect(extended.toBase58()).toBe(
      'tprv8izkrYX9SD7ZR6qEfjtLFeifvevNaUhXNqY8BpfnAyo5oBzZ8ai785BETjCi9izNp8JCsqyAeL7S4BhCaoaJK5JpSXkaC3CmrDWPRtuctHR',
    );
    expect(extended.neutered().toBase58()).toBe(
      'tpubDFgnzxZPaaoEJZs2ZPYvf4NnVgSJjotRx98uULi5bFbUdgFKkyXhJZo6dsQMwUjKmkedoLKgnZUHC2LuTJz9kCtsKeiRsMc37Qe7FtKv68e',
    );
  });

  test('derived key', () => {
    expect(keyPair.toWIF()).toBe('cRk4HVE9qfekpVFc72PMjEahdoiMkfaZpXBwBNRoqkk8hnsn8Kf8');
    expect(Buffer.from(keyPair.publicKey).toString('hex')).toBe(
      '03244b42a9df73401473dff8ec9c7f85a080952c342494214d99a5ab13d6a71864',
    );
  });

  test('address', () => {
    const { address } = bitcoin.payments.p2pkh({ pubkey: keyPair.publicKey, network: litecoinTestnetNetwork });
    expect(address).toBe('n118YqfT1hk8uvXcqcy4fwLDfVQfJpQTaS');
  });
});

describe('BIP44 bitcoin cash', () => {
  const root = bip32.fromSeed(seed);
  const extended = root.derivePath("m/44'/145'/0'/0");
  const keyPair = extended.derive(0);

  test('extended key', () => {
    expect(extended.toBase58()).toBe(
      'xprv9zn4Gs5FKScAPRexQispuoo4B2f1Kduabw5SmkyuyneKDezaPrM1qmxFjqhLtBb3ukcAb3BmM81vKteuEaag3WxSvHYqShoEnqvPKQuYtue',
    );
    expect(extended.neutered().toBase58()).toBe(
      'xpub6DmQgNc99pATbujRWkQqGwjnj4VVj6dRyA13a9PXY8BJ6TKiwPfGPaGjb63fSmjphQwrNxvT7e9pejN7RiQ9LfLLi8oqwkeAmQQhMDemCWB',
    );
  });

  test('derived key', () => {
    expect(keyPair.toWIF()).toBe('L4Sn5zKfKiRA6zgZQkjpu2APUdTgnJJxXTRxErHVTcnQQfLkw7HX');
    expect(Buffer.from(keyPair.publicKey).toString('hex')).toBe(
      '02f959a1ad36b2c63d316ce78be20cdc2ead12c7cf8965a82a08ae77e28f3d857d',
    );
  });

  test('address', () => {
    const pubKey = new Uint8Array(keyPair.publicKey);
    const h160 = hash160(pubKey);
    const cashAddr = encodeCashAddress({ prefix: 'bitcoincash', type: 'p2pkh', payload: h160 });
    expect(cashAddr.address).toBe('bitcoincash:qzpsvg9z6mk3ttd9vmss3rwfdgfd0r7wcuwtmlaskf');
    const legacyAddr = encodeBase58AddressFormat(Base58AddressFormatVersion.p2pkhCopayBCH, h160);
    expect(legacyAddr).toBe('CUQgRv6C47K4ojXP1sTdhf11WayY1nf4Sf');
  });
});

describe('BIP44 xrp', () => {
  const root = bip32.fromSeed(seed);
  const extended = root.derivePath("m/44'/144'/0'/0");
  const keyPair = extended.derive(0);

  test('extended key', () => {
    expect(extended.toBase58()).toBe(
      'xprv9zkwirmm3BZSeyJpz9M9U8BBvK3e7XNSuxUkfw4UCYBGkFbNWAM3VNBKrZtTexpJquARF9pquAraotyC7j7WwHoxtvVZ4KafTc9f7PftYdK',
    );
    expect(extended.neutered().toBase58()).toBe(
      'xpub6DkJ8NJesZ7jsTPJ6At9qG7vULt8Wz6JHBQMUKU5ksiFd3vX3hfJ3AVohsV1sot4B4YCdicFmfke8jo8XAjCNdLc7NqF5Jtdj3ie2DUeRQ7',
    );
  });

  test('derived key', () => {
    expect(Buffer.from(keyPair.privateKey!).toString('hex')).toBe(
      '1dccec0b83e10c366ab6bc63dd3b6ba12b948390d4d45fa0f699e8c77a7c6fde',
    );
    expect(Buffer.from(keyPair.publicKey).toString('hex')).toBe(
      '02d52fe3da077ebdd47dcb866b57955084418921c633f7558f388de622699c4f73',
    );
  });

  test('address', () => {
    const address = deriveAddress(Buffer.from(keyPair.publicKey).toString('hex'));
    expect(address).toBe('rnrbiYDUYTJS4JVdSV5FtyCj4HFuRjfLKM');
  });
});
