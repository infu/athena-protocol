<img src="./src/athene.svg" width="200">

# Athena Protocol
*MVP Basic version*




## Install Client

```bash
npm i athena-protocol @dfinity/identity
```

```js
import athena from "athena-protocol"

let identity = athena.authenticate({
  host: "http://yourhosthere",
  mode: "dark", // or "light"
  restore = false // restore session automatically without prompting user (if user is already logged)
});

// Use 'identity' in AgentJS
```


## Install Host

1) Edt src/index.js and whitelist your own domains
2) ```npm run build```
3) Create your own domain and deploy it there (passwords are linked to it permanently) 
4) Once the Internet Computer supports custom domains you can host it on the IC. If you don't want a custom domain, just deploy it with DFX right away


