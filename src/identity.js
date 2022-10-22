import getRandomValues from 'get-random-values';
import { Ed25519KeyIdentity } from '@dfinity/identity';

import { sha256 } from 'js-sha256';
// export const getIdentity = () => {
//   let identity;

//   try {
//     let si = window.localStorage.getItem("myi");

//     identity = Ed25519KeyIdentity.fromParsedJson(JSON.parse(si));
//   } catch (e) {
//     console.error(e);
//     const entropy = getRandomValues(new Uint8Array(32));
//     identity = Ed25519KeyIdentity.generate(entropy);
//     window.localStorage.setItem("myi", JSON.stringify(identity.toJSON()));
//   }
//   return identity;
// };

export const getIdentityFromPass = pass => {
  const hash = sha256.create();
  hash.update(pass);

  let entropy = new Uint8Array(hash.digest()); //sha256(pass);

  let identity = Ed25519KeyIdentity.generate(entropy);

  return identity;
};
