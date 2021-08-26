// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract TokenLockerStorage {
    uint8 public constant VERSION = 1;

    // token address
    address constant public TOKEN_ADDRESS = address(0x507BDe03A87a6aA134d16634545E3D79c11c137D);

    // modify token decimals
    uint8 public constant DECIMALS = 12;

    // base_unit
    uint256 public constant BASE_UNIT = 10 ** uint256(DECIMALS);

    address[] public accountList = [0xDe96e75c7160d70a447a72AFdb75DDfA1455c808,
                                    0xd2686F98C3Ad0341E8196d8d31fE65C85FdfdFa0,
                                    0x96803aAE93c659F300b568f6e1a1f431eD85e1E8,
                                    0x240C23f5A91FE87d3623A6922AAFDc07965C7C24,
                                    0x2247c9a8e87810d49EE2AF6B318fFfaA080b99b9];

    uint256[] public amountList =  [24000000000000,
                                    26000000000000,
                                    28000000000000,
                                    24000000000000,
                                    24000000000000];

    // Locker-time: 2021-09-10 12:00:00
    uint256 constant public lockTime = 1631246400;

    mapping (address => uint) public airdropBalances;

    constructor() {
        for(uint i = 0; i < accountList.length; ++i) {
            airdropBalances[accountList[i]] = amountList[i];
        }
    }

    function getTokenAddress() public pure returns(address token) {
        return TOKEN_ADDRESS;
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


