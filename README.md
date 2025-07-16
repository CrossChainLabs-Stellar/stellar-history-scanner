# Stellar History Scanner

A standalone application for scanning and verifying Stellar history archives.

## Requirements

- **Node.js**: 20.x  

## Install
```bash
npm install -g @crosschainlabs/stellar-history-scanner
```

## Usage
```bash
stellar-history-scanner <historyURL> <fromLedger> <toLedger> <concurrency>
```

Example
```
stellar-history-scanner https://history.core-live-a.validator_domain.com 0 1000000 10
```

[Attribution](./Attribution.md)
