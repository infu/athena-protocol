import {
  Ed25519KeyIdentity,
  DelegationChain,
  DelegationIdentity,
} from '@dfinity/identity';
import getRandomValues from 'get-random-values';

const newIdentity = () => {
  const entropy = getRandomValues(new Uint8Array(32));
  const identity = Ed25519KeyIdentity.generate(entropy);
  return identity;
};

const athene_url = 'http://localhost:3000';

const auth = {
  identity: false,
};

var prevListener = false;

auth.authenticate = ({
  host = athene_url,
  mode = 'dark',
  restore = false,
} = {}) => {
  return new Promise((resolve, reject) => {
    const temp = newIdentity();

    const elistener = msg => {
      if (!msg.isTrusted) return;
      if (msg.origin !== host) return;

      if (msg.data.type === 'getPublicKey') {
        popup.postMessage(
          { type: 'getPublicKeyReply', payload: temp.getPublicKey().toDer() },
          athene_url
        );
      } else if (msg.data.type === 'provideChain') {
        let chain = DelegationChain.fromJSON(msg.data.payload);
        auth.identity = new DelegationIdentity(temp, chain);

        // Ed25519KeyIdentity.fromParsedJson(JSON.parse(msg.data));

        document.removeEventListener('message', elistener);
        resolve(auth.identity);
      }
    };
    if (prevListener) window.removeEventListener('message', prevListener);
    prevListener = elistener;

    window.addEventListener('message', elistener, false);

    let popup = popupCenter({
      url: `${host}/?mode=${mode}${restore ? '&restore=true' : ''}`,
      title: 'Athena',
      w: 437,
      h: 651,
    });
  });
};

const popupCenter = ({ url, title, w, h }) => {
  const dualScreenLeft =
    window.screenLeft !== undefined ? window.screenLeft : window.screenX;
  const dualScreenTop =
    window.screenTop !== undefined ? window.screenTop : window.screenY;

  const width = window.innerWidth
    ? window.innerWidth
    : document.documentElement.clientWidth;

  const height = window.innerHeight
    ? window.innerHeight
    : document.documentElement.clientHeight;

  const left = (width - w) / 2 + dualScreenLeft;
  const top = (height - h) / 2 + dualScreenTop;
  const newWindow = window.open(
    url,
    title,
    `
    scrollbars=no,
    menubar=0,resizable=0,
    width=${w}, 
    height=${h}, 
    top=${top}, 
    left=${left}
    `
  );

  if (window.focus) newWindow.focus();
  return newWindow;
};

export { auth as default };
