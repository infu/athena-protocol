import { Ed25519KeyIdentity } from '@dfinity/identity';

import { sha256 } from 'js-sha256';

export const getIdentityFromPass = pass => {
  const hash = sha256.create();
  hash.update(pass);

  let entropy = new Uint8Array(hash.digest()); //sha256(pass);

  let identity = Ed25519KeyIdentity.generate(entropy);

  return identity;
};
