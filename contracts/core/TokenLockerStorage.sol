// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract TokenLockerStorage {
    uint public version = 1;

    address[] public accountList;

    address constant public tokenAddress = address(0x507BDe03A87a6aA134d16634545E3D79c11c137D);

    // Locker-time: 2021-09-10 12:00:00
    uint256 constant public lockTime = 1631246400;

    mapping (address => uint) public airdropBalances;

    constructor() {
        accountList.push(address(0xDe96e75c7160d70a447a72AFdb75DDfA1455c808));
        airdropBalances[address(0xDe96e75c7160d70a447a72AFdb75DDfA1455c808)] = 12000000000000;
    }

    function getTokenAddress() public pure returns(address token) {
        return tokenAddress;
    }

    function getLockTime() public pure returns(uint256 timestamp) {
        return lockTime;
    }

    function getAccountCount() public view returns(uint count) {
        return accountList.length;
    }

    function getAccount(uint256 index) public view returns(address accountAddress) {
        return accountList[index];
    }

    function getAccountBalance(address accountAddress) public view returns(uint256 amount) {
        return airdropBalances[accountAddress];
    }
}


