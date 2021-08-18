// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/math/SafeMath.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

contract UinkTreasury is Ownable {
  using SafeMath for uint256;

  IERC20 public uink;

  mapping (address => bool) public operators;

  modifier onlyOperator() {
    require(operators[msg.sender], "Not Operator");
    _; 
  }
  
  function addOperator(address user) public onlyOwner {
    operators[user] = true;
  }

  function removeOperator(address user) public onlyOwner {
    operators[user] = false;
  }

  event Reward(address indexed to, uint256 amount);


  constructor(address _uink) {
    uink = IERC20(_uink);
  }

  function sendRewards(address to, uint256 amount) external onlyOperator returns(uint256 val) {
    val = safeTransfer(to, amount);
    emit Reward(to, val);
  }

  function withdraw(address token, uint256 amount, address to) public onlyOwner {
    IERC20(token).transfer(to, amount);
  }

  function safeTransfer(address to, uint256 amount) internal returns(uint256) {
    uint256 bal = uink.balanceOf(address(this));
    if (amount > bal) {
      uink.transfer(to, bal);
      return bal;
    } else {
      uink.transfer(to, amount);
      return amount;
    }
  }
}