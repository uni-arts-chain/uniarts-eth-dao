// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/access/AccessControl.sol";
import "@openzeppelin/contracts/token/ERC721/ERC721.sol";

contract UniArtsNFT is ERC721, AccessControl {
  // Create a new role identifier for the minter role
  bytes32 public constant MINTER_ROLE = keccak256("MINTER_ROLE");

  struct TokenInfo {
    string title;
    uint8 class_id;
    uint8 size;
  }

  /* Our tokeninfo are stored here */
  TokenInfo[] public token_infos;

  constructor(address minter) public ERC721("UniArtsNFT", "UANFT") {
    // Grant the minter role to a specified account
    _setupRole(MINTER_ROLE, minter);
  }
  
  function createNFT(
    address user_address,
    string calldata title,
    uint8 class_id,
    uint8 size
    ) external {
    // Only minters can mint
    // Check that the calling account has the minter role
    require(hasRole(MINTER_ROLE, msg.sender), "Caller is not a minter");

    uint tokenId = token_infos.push(
      TokenInfo({
        title: title,
        class_id: class_id,
        size: size
      })
    ) - 1;
    _mint(user_address, tokenId);
  }

  function getNFT(
    uint tokenId
  ) external view returns (
    string memory title,
    uint8 class_id,
    uint8 size
  ) {
    return (
      token_infos[tokenId].title,
      token_infos[tokenId].class_id,
      token_infos[tokenId].size
    );
  }
}
