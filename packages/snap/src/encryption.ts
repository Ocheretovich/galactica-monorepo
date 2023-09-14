// SPDX-License-Identifier: BUSL-1.1

import { EncryptedZkCert, ImportZkCertError, ZkCertRegistered } from '@galactica-net/snap-api';
import {
  getEncryptionPublicKey,
  encryptSafely,
  decryptSafely,
  EthEncryptedData,
} from '@metamask/eth-sig-util';
import { SnapsGlobalObject } from '@metamask/rpc-methods';

const encryptionVersion = 'x25519-xsalsa20-poly1305';

/**
 * Create a new encryption key pair for the holder. It is used to encrypt personal details in ZK certificates, for example on the way from guardian to the holder.
 *
 * @param snap - The snap for interaction with Metamask.
 * @returns The public and private key.
 */
export async function createEncryptionKeyPair(snap: SnapsGlobalObject) {
  // It is derived from the user's private key handled by Metamask. Meaning that HW wallets are not supported.
  // The plan to support HW wallets is to use the `eth_sign` method to derive the key from a signature.
  // However this plan is currently not supported anymore as discussed here: https://github.com/MetaMask/snaps/discussions/1364#discussioncomment-5719039
  const entropy = await snap.request({
    method: 'snap_getEntropy',
    params: {
      version: 1,
      salt: 'galactica-encryption2',
    },
  });
  const privKey = entropy.slice(2); // remove 0x prefix
  const publicKey = getEncryptionPublicKey(privKey);

  return { pubKey: publicKey, privKey };
}

/**
 * Encrypt a zkCert for exporting.
 *
 * @param zkCert - The ZkCertRegistered to encrypt.
 * @param pubKey - The public key for encryption.
 * @param holderCommitment - The holder commitment to associate the zkCert with the holder who can decrypt it.
 * @returns The encrypted ZkCertRegistered as EthEncryptedData.
 */
export function encryptZkCert(
  zkCert: ZkCertRegistered,
  pubKey: string,
  holderCommitment: string,
): EncryptedZkCert {
  const message = JSON.stringify(zkCert);
  const encryptedZkCert = encryptSafely({
    publicKey: pubKey,
    data: message,
    version: encryptionVersion,
  }) as EncryptedZkCert;
  encryptedZkCert.holderCommitment = holderCommitment;
  return encryptedZkCert;
}

/**
 * Decrypt a zkCert. It takes the encrypted ZkCertRegistered as given by the guardian or exported from the Snap.
 *
 * @param encryptedZkCert - The encrypted zkCert as EthEncryptedData.
 * @param privKey - The private key for decryption.
 * @returns The decrypted ZkCertRegistered.
 */
export function decryptZkCert(
  encryptedZkCert: EncryptedZkCert,
  privKey: string,
): ZkCertRegistered {
  const decryptedMessage = decryptSafely({
    encryptedData: encryptedZkCert,
    privateKey: privKey,
  });
  const zkCert = JSON.parse(decryptedMessage) as ZkCertRegistered;
  return zkCert;
}

/**
 * Checks if an imported EncryptedZkCert has the right format.
 * @param encryptedZkCert - The encrypted zkCert as EthEncryptedData.
 * @throws If the format is not correct.
 */
export function checkEncryptedZkCertFormat(encryptedZkCert: EncryptedZkCert) {
  if (
    !encryptedZkCert ||
    !encryptedZkCert.version ||
    !encryptedZkCert.nonce ||
    !encryptedZkCert.ephemPublicKey ||
    !encryptedZkCert.ciphertext
  ) {
    throw new ImportZkCertError({
      name: 'FormatError',
      message: 'The imported zkCert is not in the EthEncryptedData format.',
    });
  }
  if (!encryptedZkCert.holderCommitment) {
    throw new ImportZkCertError({
      name: 'FormatError',
      message: 'The imported zkCert does not contain a holder commitment.',
    });
  }
}
