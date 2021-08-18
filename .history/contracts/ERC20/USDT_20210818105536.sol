pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract USDT is ERC20 {
    // modify MILLION
    uint256 public constant MILLION = 10**6 * (10 ** uint256(DECIMALS));
    // modify initial token supply
    uint256 public constant INITIAL_SUPPLY = 100 * MILLION; 
    
    constructor() ERC20("UsdCoin", "USDC") {
        _mint(msg.sender, 1000000000000);
    }
}