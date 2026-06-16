# bip39-demo

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)
[![Node.js](https://img.shields.io/badge/Node.js-%3E%3D26-green.svg)](https://nodejs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-6-blue.svg)](https://www.typescriptlang.org/)

A test-driven demo of hierarchical deterministic (HD) wallet key and address derivation following BIP39/BIP32/BIP44/BIP84, supporting Bitcoin, Ethereum, Litecoin, Bitcoin Cash, and XRP.

## Overview

Starting from a single BIP39 mnemonic, the test suite derives keys and addresses across multiple coins and derivation schemes, asserting every result against known-good fixtures. It also covers watch-only derivation from extended public keys (`xpub`/`zpub`/`vpub`), where addresses are derived without access to the private key.

## Coverage

| Scheme     | Coins                                                       | Notes                                        |
| ---------- | ----------------------------------------------------------- | -------------------------------------------- |
| BIP39      | —                                                           | Mnemonic → seed                              |
| BIP44      | Bitcoin, Ethereum, Litecoin, Bitcoin Cash, XRP (+ testnets) | Legacy `m/44'` accounts                      |
| BIP84      | Bitcoin (+ testnet)                                         | Native SegWit (P2WPKH) `m/84'`               |
| Watch-only | Bitcoin, Ethereum, Litecoin, Bitcoin Cash (+ testnets)      | Address derivation from `xpub`/`zpub`/`vpub` |

## Scripts

| Script       | Description                                  |
| ------------ | -------------------------------------------- |
| `pnpm test`  | Run the test suite (Vitest)                  |
| `pnpm check` | Type-check, lint, and verify formatting      |
| `pnpm fix`   | Auto-fix lint issues and format the codebase |

## Reference

- [BIP39 - Mnemonic code for generating deterministic keys](https://github.com/bitcoin/bips/blob/master/bip-0039.mediawiki)
- [BIP32 - Hierarchical Deterministic Wallets](https://github.com/bitcoin/bips/blob/master/bip-0032.mediawiki)
- [BIP44 - Multi-Account Hierarchy for Deterministic Wallets](https://github.com/bitcoin/bips/blob/master/bip-0044.mediawiki)
- [BIP84 - Derivation scheme for P2WPKH based accounts](https://github.com/bitcoin/bips/blob/master/bip-0084.mediawiki)
- [SLIP-0044 - Registered coin types](https://github.com/satoshilabs/slips/blob/master/slip-0044.md)
- [BIP39 Mnemonic Code Converter](https://iancoleman.io/bip39/)

## License

MIT
