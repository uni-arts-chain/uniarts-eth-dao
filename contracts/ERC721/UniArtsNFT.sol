// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/access/AccessControl.sol";
import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";

contract UniArtsNFT is ERC721, ERC721Enumerable, AccessControl {
  // Create a new role identifier for the minter role
  bytes32 public constant MINTER_ROLE = keccak256("MINTER_ROLE");

  string _baseURIValue;

  struct TokenInfo {
    string title;
    uint8 class_id;
    uint8 size;
  }

  /* Our tokeninfo are stored here */
  TokenInfo[] public token_infos;

  constructor(address minter, string memory baseURIValue_) ERC721("UniArtsNFT", "UANFT") {
    // Grant the minter role to a specified account
    _setupRole(MINTER_ROLE, minter);
    _setupRole(DEFAULT_ADMIN_ROLE, minter);
    _baseURIValue = baseURIValue_;
  }

  function _baseURI() internal view override returns (string memory) {
    return _baseURIValue;
  }

  function baseURI() public view returns (string memory) {
    return _baseURI();
  }

  function setBaseURI(string memory newBase) public {
    // Only admin can setBaseURI
    require(hasRole(DEFAULT_ADMIN_ROLE, msg.sender), "Caller is not a admin");
    _baseURIValue = newBase;
  }
  
  function createNFT(address user_address, string calldata title, uint8 class_id, uint8 size) external {
    // Only minters can mint
    // Check that the calling account has the minter role
    require(hasRole(MINTER_ROLE, msg.sender), "Caller is not a minter");

    token_infos.push(TokenInfo({title: title, class_id: class_id, size: size}));
    uint tokenId = token_infos.length - 1;
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

  function _beforeTokenTransfer(
      address from,
      address to,
      uint256 tokenId
  ) internal virtual override(ERC721, ERC721Enumerable) {
    super._beforeTokenTransfer(from, to, tokenId);
  }

  /**
  * override(ERC721, ERC721Enumerable, AccessControl) -> here you're specifying only two base classes ERC721, AccessControl
  * */
  function supportsInterface(bytes4 interfaceId)
      public
      view
      override(ERC721, ERC721Enumerable, AccessControl)
      returns (bool)
  {
      return super.supportsInterface(interfaceId);
  }
}
