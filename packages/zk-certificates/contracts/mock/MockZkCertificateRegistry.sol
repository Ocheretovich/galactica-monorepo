// SPDX-License-Identifier: GPL-3.0-or-later
pragma solidity ^0.8.0;

import {IZkCertificateRegistry} from "../interfaces/IZkCertificateRegistry.sol";

/// @author Galactica dev team
contract MockZkCertificateRegistry is IZkCertificateRegistry {
    bytes32 public constant MERKLE_ROOT_INITIAL_VALUE = bytes32(0);
    bytes32[] public merkleRoots = [MERKLE_ROOT_INITIAL_VALUE];
    uint256 public merkleRootValidIndex = 1;

    mapping (bytes32 => uint256) public merkleRootIndex;

    function setMerkleRoot(bytes32 newMerkleRoot) public {
      merkleRoots.push(newMerkleRoot);
      merkleRootIndex[newMerkleRoot] = merkleRoots.length - 1;
    }

    function merkleRoot() external view returns (bytes32) {
        return merkleRoots[merkleRoots.length - 1];
    }

    function setMerkleRootValidIndex(uint256 newValue) public {
      merkleRootValidIndex = newValue;
    }

    function verifyMerkleRoot(bytes32 _merkleRoot) external view returns (bool) {
      uint _merkleRootIndex = merkleRootIndex[_merkleRoot];
      return _merkleRootIndex >= merkleRootValidIndex;
    }
}
