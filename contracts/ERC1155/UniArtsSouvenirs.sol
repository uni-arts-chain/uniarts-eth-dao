pragma solidity ^0.8.0;

import "./ERC1155Tradable.sol";


/**
 * @title UniArtsCollectible
 */
contract UniArtsSouvenirs is ERC1155Tradable  {
  constructor(string memory _uri, address _proxyRegistryAddress)
  ERC1155Tradable(
    "UniArtsSouvenirs",
    "UAS",
    _uri,
    _proxyRegistryAddress
  ) public {}
}