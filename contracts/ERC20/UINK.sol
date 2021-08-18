// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;
import '@openzeppelin/contracts/token/ERC20/ERC20.sol';


contract UINK is ERC20 {
    uint256 public constant INITIAL_SUPPLY = 100_000_000 * 1e18; 

    constructor () ERC20("Uniarts Ink", "UINK") {
        _mint(msg.sender, INITIAL_SUPPLY);
    }
}