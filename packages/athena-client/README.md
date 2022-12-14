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
3. `npm run build`
4. Create your own domain and deploy it there (passwords are linked to it permanently)
5. Once the Internet Computer supports custom domains you can host it on the IC. If you don't want a custom domain, just deploy it with DFX right away

## License

License Apache 2.0
