// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

interface ILinkAccessor {
    function requestRandomness(uint256 userProvidedSeed_) external returns(bytes32);
}
