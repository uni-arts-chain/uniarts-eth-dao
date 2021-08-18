// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract USDT is ERC20 {
    // modify token name
    string public constant NAME = "USDT TEST";
    // modify token symbol
    string public constant SYMBOL = "USDT";
    // modify token decimals
    uint8 public constant DECIMALS = 18;
    // modify MILLION
    uint256 public constant MILLION = 10**6 * (10 ** uint256(DECIMALS));
    // modify initial token supply
    uint256 public constant INITIAL_SUPPLY = 100 * MILLION; 

    constructor() ERC20(NAME, SYMBOL) {
        _mint(msg.sender, INITIAL_SUPPLY);
    }
}