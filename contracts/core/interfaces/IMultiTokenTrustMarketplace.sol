// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

interface IMultiTokenTrustMarketplace {

    struct Order {
        // Order ID
        bytes32 id;
        // pay token address
        address payTokenAddress;
        // Owner of the NFT
        address seller;
        // NFT registry address
        address nftAddress;
        // NFT assetId
        uint256 assetId;
        // NFT assetAmount
        uint256 assetAmount;
        // Price (in wei) for the published item
        uint256 price;
        // Time when this sale ends
        uint256 expiresAt;
    }

    struct Bid {
        // Bid Id
        bytes32 id;
        // Bidder address
        address bidder;
        // Price for the bid in wei
        uint256 price;
        // Time when this bid ends
        uint256 expiresAt;
    }

    // ORDER EVENTS
    event OrderCreated(
        bytes32 id,
        address indexed payTokenAddress,
        address indexed seller,
        address indexed nftAddress,
        uint256 assetId,
        uint256 assetAmount,
        uint256 priceInWei,
        uint256 expiresAt
    );

    event OrderUpdated(
        bytes32 id,
        address payTokenAddress,
        uint256 priceInWei,
        uint256 expiresAt
    );

    event OrderSuccessful(
        bytes32 id,
        address indexed buyer,
        address indexed payTokenAddress,
        uint256 indexed priceInWei
    );

    event OrderCancelled(bytes32 id);

    // BID EVENTS
    event BidCreated(
      bytes32 id,
      address indexed nftAddress,
      uint256 indexed assetId,
      uint256 assetAmount,
      address indexed bidder,
      address payTokenAddress,
      uint256 priceInWei,
      uint256 expiresAt
    );

    event BidAccepted(bytes32 id);
    event BidCancelled(bytes32 id);
    event SetNewPayToken(string tokenName, address tokenAddress);
}