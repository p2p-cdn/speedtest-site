# p2p speedtest -- public snapshot

Speed testing the Akamai CDN vs the IPFS network

## install

```bash
git clone https://github.com/npfoss/p2p-speedtest-webpack
cd p2p-speedtest-webpack
npm install
```

## run

```bash
npm run start
```

Go to `http://localhost:3000`

## oh also

you need the IPFS Companion extension and an IPFS node running locally (e.g. with `ipfs daemon`)


## results

Check out [final-report.pdf](final-report.pdf) for our findings -- IPFS was actually faster in some cases!

(We didn't mention this in the report but one hypothesis for IPFS winning on small files is that it doesn't incur the overhead of https; security is ensured by hashing the file once when you receive it, which doesn't require extra network hops like a TLS handshake.)
