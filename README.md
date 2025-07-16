# Stellar History Scanner

A standalone application for scanning and verifying Stellar history archives.


## Install
```bash
npm install -g @crosschainlabs/stellar-history-scanner
```

## Usage
```bash
stellar-history-scanner scan-history <historyURL> <fromLedger> <toLedger> <concurrency>
```

Example
```
stellar-history-scanner scan-history https://history.core-live-a.validator_domain.com 0 1000000 10
```

[Attribution](./attribution.md)
