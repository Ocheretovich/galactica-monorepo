pragma circom 2.1.4;

include "../zkKYC.circom";

component main {public [
  root, 
  currentTime, 
  userAddress, 
  investigationInstitutionPubKey, 
  dAppAddress,
  providerAx,
  providerAy
]} = ZKKYC(32, 60, 0, 0);