import React, { StrictMode } from 'react';
import * as ReactDOM from 'react-dom/client';
import { Auth } from './Auth';
import * as serviceWorker from './serviceWorker';

const container = document.getElementById('root');
const root = ReactDOM.createRoot(container);

let params = new URL(document.location).searchParams;

// Whitelist origins
const whitelisted = [
  'http://localhost:3026',
  'https://nftanvil.com',
  'http://localhost:3000',
];

let opener_origin = new URL(document.referrer).origin;

if (process.NODE_ENV === 'development') opener_origin = 'http://localhost:3000'; // during development

let deny = true;
if (opener_origin)
  for (let wl of whitelisted) {
    if (opener_origin === wl) deny = false;
  }

if (deny) {
  window.localStorage.clear(); // protection against injected scripts trying to get our keys. This script should load first and nothing should be loading before it

  window.close(); // this won't work if not in a popup

  while (true) {
    alert('Warning! Origin not allowed. Close this window');
  }
}

const returnKeys = key => {
  window.localStorage.setItem('keys', key);
  window.opener.postMessage(key, opener_origin); // this will make sure opener can't cheat. It wont send to unlisted url
  window.close();
};

// restore will attempt to relog the user quickly so dapps don't have to use their localStorage
if (params.get('restore')) {
  let keys = window.localStorage.getItem('keys');
  if (keys) returnKeys(keys);
}

// Theme
let mode = params.get('mode') === 'dark' ? 'dark' : 'light';
window.localStorage.setItem('chakra-ui-color-mode', mode);

if (!deny)
  root.render(
    <StrictMode>
      <Auth mode={mode} returnKeys={returnKeys} />
    </StrictMode>
  );

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://cra.link/PWA
serviceWorker.unregister();
