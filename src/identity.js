import {
  Ed25519KeyIdentity,
  DelegationChain,
  Ed25519PublicKey,
} from '@dfinity/identity';

import { sha256 } from 'js-sha256';

export const getIdentityFromPass = pass => {
  const hash = sha256.create();
  hash.update(pass);

  let entropy = new Uint8Array(hash.digest()); //sha256(pass);

  let identity = Ed25519KeyIdentity.generate(entropy);

  return identity;
};

export const createChain = async (rootIdentity, publicKeyDer) => {
  let chain = await DelegationChain.create(
    rootIdentity,
    Ed25519PublicKey.fromDer(publicKeyDer),
    Date.now() + 4 * 60 * 60 * 1000 // 4 hours
  );

  return chain;
};
