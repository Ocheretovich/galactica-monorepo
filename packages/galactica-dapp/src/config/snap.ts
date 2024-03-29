/**
 * The snap origin to use.
 * Will default to the local hosted snap if no value is provided in environment.
 */
export const defaultSnapOrigin =
  // process.env.REACT_APP_SNAP_ORIGIN ?? `npm:@galactica-net/snap`;
  process.env.REACT_APP_SNAP_ORIGIN ?? `local:http://localhost:8080`;

export const zkKYCAgeProofPublicInputDescriptions = [
  'user pubkey Ax',
  'user pubkey Ay',
  'proof valid',
  'verification SBT expiration',
  'encrypted fraud investigation shard for institution 1 part 1',
  'encrypted fraud investigation shard for institution 1 part 2',
  'encrypted fraud investigation shard for institution 2 part 1',
  'encrypted fraud investigation shard for institution 2 part 2',
  'encrypted fraud investigation shard for institution 3 part 1',
  'encrypted fraud investigation shard for institution 3 part 2',
  'merkle root',
  'current time',
  'user address',
  'current year',
  'current month',
  'current day',
  'age threshold',
  'human id',
  'dapp address',
  'zkKYC guardian pubkey Ax',
  'zkKYC guardian pubkey Ay',
  'institution 1 pubkey Ax',
  'institution 1 pubkey Ay',
  'institution 2 pubkey Ax',
  'institution 2 pubkey Ay',
  'institution 3 pubkey Ax',
  'institution 3 pubkey Ay',
];

export const zkKYCPublicInputDescriptions = [
  'user pubkey Ax',
  'user pubkey Ay',
  'proof valid',
  'verification SBT expiration',
  'merkle root',
  'current time',
  'user address',
  'human id',
  'dapp address',
  'zkKYC guardian pubkey Ax',
  'zkKYC guardian pubkey Ay',
];


export const twitterFollowersThresholdProofPublicInputDescriptions = [
  'proof valid',
  'verification SBT expiration',
  'merkle root',
  'current time',
  'user address',
  `twitterZkCertificate guardian pubkey Ax`,
  `twitterZkCertificate guardian pubkey Ay`,
  `followers threshold`,
];
