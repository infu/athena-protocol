<img src="./src/athene.svg" width="200">

# Athena Protocol

_MVP Basic version_
The most minimalistic web3 identity provider for sharing one identity between trusted sites.
Made for the Internet Computer.

## Install Client

```bash
npm i athena-protocol @dfinity/identity @dfinity/agent @dfinity/candid @dfinity/principal
```

```js
import athena from 'athena-protocol';

let identity = athena.authenticate({
  host: 'http://yourhosthere',
  mode: 'dark', // or "light"
  restore: false, // restore session automatically without prompting user (if user is already logged)
});

// Use 'identity' with AgentJS
```

## Install Provider

1. Edt src/index.js and whitelist your own domains
2. Change src/logo.svg

Opt (1) Deploy with dfx on IC

```
dfx deploy
```

Opt (2)
Create your own domain and deploy it there (passwords are linked to it permanently)
Once the Internet Computer supports custom domains you can host it on the IC.

## License

License Apache 2.0
