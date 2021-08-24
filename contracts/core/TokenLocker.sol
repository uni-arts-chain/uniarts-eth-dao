// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/utils/math/SafeMath.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

contract TokenLocker {
  using SafeMath for uint256;
  
  address owner;
  
  struct TokenLock {
    address tokenAddress;
    uint256 lockDate; // the date the token was locked
    uint256 amount; // the amount of tokens locked
    uint256 unlockDate; // the date the token can be withdrawn
    uint256 lockID; // lockID nonce per uni pair
    address owner;
    bool retrieved; // false if lock already retreieved
  }

  // Mapping of user to their locks
  mapping(address => mapping(uint256 => TokenLock)) public locks;

  // Num of locks for each user
  mapping(address => uint256) public numLocks;

  constructor() {
    owner = msg.sender;
  }
  
  modifier onlyOwner() {
    require(owner == msg.sender, "Ownable: caller is not the owner");
    _;
  }

  function lockTokens(address tokenAddress, uint256 amount, uint256 time) external returns (bool) {
    IERC20 token = IERC20(tokenAddress);
    TokenLock memory tokenLock;
    tokenLock.tokenAddress = tokenAddress;
    tokenLock.lockDate = block.timestamp;
    tokenLock.amount = amount;
    tokenLock.unlockDate = block.timestamp.add(time);
    tokenLock.lockID = numLocks[msg.sender];
    tokenLock.owner = msg.sender;
    tokenLock.retrieved = false;

    // Transferring token to smart contract
    token.transferFrom(msg.sender, address(this), amount);
    
    locks[msg.sender][numLocks[msg.sender]] = tokenLock;
    numLocks[msg.sender]++;

    return true;
  }
  
  function getLock(uint256 lockId) public view returns (address, uint256, uint256, uint256, uint256, address, bool) {
    return (
      locks[msg.sender][lockId].tokenAddress,
      locks[msg.sender][lockId].lockDate,
      locks[msg.sender][lockId].amount,
      locks[msg.sender][lockId].unlockDate,
      locks[msg.sender][lockId].lockID,
      locks[msg.sender][lockId].owner,
      locks[msg.sender][lockId].retrieved
    );
  }
  
  function getNumLocks() external view returns (uint256) {
    return numLocks[msg.sender];
  }

  function unlockTokens(uint256 lockId) external returns (bool) {
    // Make sure lock exists
    require(lockId < numLocks[msg.sender], "Lock doesn't exist");
    // Make sure lock is still locked
    require(locks[msg.sender][lockId].retrieved == false, "Lock was already unlocked");
    // Make sure tokens can be unlocked
    require(locks[msg.sender][lockId].unlockDate <= block.timestamp, "Tokens can't be unlocked yet");
    
    IERC20 token = IERC20(locks[msg.sender][lockId].tokenAddress);
    token.transfer(msg.sender, locks[msg.sender][lockId].amount);
    locks[msg.sender][lockId].retrieved = true;

    return true;
  }

  function changeOwner(address newOwner, uint256 lockId) external returns (bool) {
    // Make sure lock exists
    require(lockId < numLocks[msg.sender], "Lock doesn't exist");
    // Make sure lock is still locked
    require(locks[msg.sender][lockId].retrieved == false, "Lock was already unlocked");

    TokenLock memory tokenLock;
    tokenLock.tokenAddress = locks[msg.sender][lockId].tokenAddress;
    tokenLock.lockDate = locks[msg.sender][lockId].lockDate;
    tokenLock.amount = locks[msg.sender][lockId].amount;
    tokenLock.unlockDate = locks[msg.sender][lockId].unlockDate;
    tokenLock.lockID = numLocks[newOwner];
    tokenLock.owner = newOwner;
    tokenLock.retrieved = false;

    locks[newOwner][numLocks[newOwner]] = tokenLock;
    numLocks[newOwner]++;

    // If lock ownership is transferred its retrieved
    locks[msg.sender][lockId].retrieved = true;
  }

}