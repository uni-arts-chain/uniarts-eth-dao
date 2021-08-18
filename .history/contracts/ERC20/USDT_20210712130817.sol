pragma solidity ^0.5.9;
import 'openzeppelin-solidity/contracts/token/ERC20/ERC20.sol';
import 'openzeppelin-solidity/contracts/token/ERC20/ERC20Detailed.sol';

/**
 * @title USDT
 */
contract USDT is ERC20, ERC20Detailed {
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

    /**
     * @dev Constructor that gives msg.sender all of existing tokens.
     */
    constructor () public ERC20Detailed(NAME, SYMBOL, DECIMALS) {
        _mint(msg.sender, INITIAL_SUPPLY);
    }
}