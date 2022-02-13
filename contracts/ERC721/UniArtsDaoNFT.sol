// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/access/AccessControl.sol";
import "@openzeppelin/contracts/utils/math/SafeMath.sol";
import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";

contract UniArtsDaoNFT is ERC721, ERC721Enumerable, AccessControl {
  using SafeMath for uint256;

  // Create a new role identifier for the minter role
  bytes32 public constant MINTER_ROLE = keccak256("MINTER_ROLE");
  // Create a new role identifier for the minter role
  bytes32 public constant MERKLE_ROLE = keccak256("MERKLE_ROLE");

  string _baseURIValue;

  // current TokenID
  uint256 private _reservedMaxCount = 500;
  uint256 private _reservedTokenID = 0;

  // current TokenID
  uint256 private _currentTokenID = _reservedMaxCount + 1;

  constructor(address minter, string memory baseURIValue_) ERC721("UniArtsDaoNFT", "UADNFT") {
    // Grant the minter role to a specified account
    _setupRole(MINTER_ROLE, minter);
    _setupRole(MERKLE_ROLE, minter);
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
  
  function createNFT(address user_address) external {
    // Only minters can mint
    // Check that the calling account has the minter role
    require(hasRole(MINTER_ROLE, msg.sender), "Caller is not a minter");

    uint256 tokenId = _getNextTokenID();
    _incrementTokenTypeId();
    _mint(user_address, tokenId);
  }

  function createMerkleNFT(address user_address) external returns (bool) {
    // Only minters can mint
    // Check that the calling account has the minter role
    require(hasRole(MERKLE_ROLE, msg.sender), "Caller is not a merkle minter");

    require(_reservedTokenID <= _reservedMaxCount, "Reserved Max Count");

    uint256 tokenId = _getReservedNextTokenID();
    _incrementReservedTokenId();
    _mint(user_address, tokenId);
    return true;
  }

  function batchMint(address user_address, uint mint_count) external {
    // Only minters can mint
    // Check that the calling account has the minter role
    require(hasRole(MINTER_ROLE, msg.sender), "Caller is not a minter");

    for(uint i = 0; i<=mint_count; i++){
      uint256 tokenId = _getNextTokenID();
      _incrementTokenTypeId();
      _mint(user_address, tokenId);
    }
  }

  function _beforeTokenTransfer(
      address from,
      address to,
      uint256 tokenId
  ) internal virtual override(ERC721, ERC721Enumerable) {
    super._beforeTokenTransfer(from, to, tokenId);
  }

  /**
    * @dev calculates the next token ID based on value of _currentTokenID
    * @return uint256 for the next token ID
    */
  function _getReservedNextTokenID() private view returns (uint256) {
      return _reservedTokenID.add(1);
  }

  /**
    * @dev calculates the next token ID based on value of _currentTokenID
    * @return uint256 for the next token ID
    */
  function _getNextTokenID() private view returns (uint256) {
      return _currentTokenID.add(1);
  }

  /**
    * @dev increments the value of _currentTokenID
    */
  function _incrementTokenTypeId() private  {
      _currentTokenID++;
  }

  /**
    * @dev increments the value of _reservedTokenID
    */
  function _incrementReservedTokenId() private  {
      _reservedTokenID++;
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
