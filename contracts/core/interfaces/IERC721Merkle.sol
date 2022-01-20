// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC721/IERC721.sol";


interface IERC721Merkle is IERC721 {
    function createMerkleNFT(address) external returns (bool);
}