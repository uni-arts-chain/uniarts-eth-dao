// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;
import '@openzeppelin/contracts/access/Ownable.sol';
import '@openzeppelin/contracts/token/ERC20/extensions/ERC20Pausable.sol';


contract UINK is Ownable, ERC20Pausable {
    uint256 public constant INITIAL_SUPPLY = 100_000_000 * 1e12; 

    constructor () ERC20("Uniarts Ink", "UINK") {
        _mint(msg.sender, INITIAL_SUPPLY);
    }

    function pause() external onlyOwner {
    	_pause();
    }

    function unpause() external onlyOwner {
    	_unpause();
    }
}