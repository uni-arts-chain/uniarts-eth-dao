// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import "@openzeppelin/contracts/token/ERC1155/IERC1155.sol";
import "@openzeppelin/contracts/token/ERC1155/IERC1155Receiver.sol";
import "@openzeppelin/contracts/utils/introspection/ERC165.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract MultiTokenAuction is ReentrancyGuard, IERC1155Receiver, ERC165, Ownable {

    // using safeErc20 for ierc20 based contract
    using SafeERC20 for IERC20;

    // constants
    address constant ADDRESS_NULL             = 0x0000000000000000000000000000000000000000;
    
    // max item allow per auction, should not be more than 2^32-1
    uint    constant MAX_ITEM_PER_AUCTION     = 32;
    
    uint    constant BLOCKS_TO_EXPIRE         = 8;

    bytes4  constant ERC1155_ONRECEIVED_RESULT = bytes4(keccak256("onERC1155Received(address,address,uint256,uint256,bytes)"));

    bytes4  constant ERC1155_ONBATCHRECEIVED_RESULT = bytes4(keccak256("onERC1155BatchReceived(address,address,uint256[],uint256[],bytes)"));
    // uint constant MAX_UINT96 = type(uint96).max;

    struct NFT {
        address contractAddress;
        uint    tokenId;
        uint    amount;
        uint    minBid;
        uint    fixedPrice;
    }
    
    struct AuctionResult {
        address topBidder;
        uint standingBid;
        uint finalBid;
    }

    struct Match {
        address creatorAddress;
        address payTokenAddress;
        uint96 minIncrement; // percentage based
        uint96 openBlock;
        uint96 expiryBlock;
        uint32 expiryExtension; // expiryBlock will be extend (+=) for expiryExtension block(s) if bid updated in range [expiryBlock - expiryExtension + 1 .. expiryBlock]
        uint32 nftCount;
    }

    // pay_token_name => token_address
    mapping(string => address) public  payTokens;

    // matchId => Match
    mapping(string => Match) public  matches;

    // matchId => index => NFT
    mapping(string => mapping(uint => NFT)) public  matchNFTs;
    
    // matchId => Result
    mapping(string => mapping(uint => AuctionResult)) public  matchResults;
    
    // matchId => player => tokenIndex => payTokenAddress => price
    mapping(string => mapping(address => mapping(uint => mapping(address => uint)))) private playerBid;

    // address to payTokenAddress => balance
    mapping(address => mapping(address => uint)) private creatorBalance;

    // events
    event CreateAuctionEvent(address creatorAddress, string matchId, address payTokenAddress, uint96 openBlock, uint96 expiryBlock, uint96 increment, uint32 expiryExtension, uint tokenIndex, NFT nfts);
    event PlayerBidEvent(string matchId, address playerAddress, uint tokenIndex, address payTokenAddress, uint bid, uint96 expiryBlock);
    event RewardEvent(string matchId, uint tokenIndex, address winnerAddress);
    event PlayerWithdrawBid(string matchId, uint tokenIndex);
    event ProcessWithdrawNft(string matchId, uint tokenIndex);
    event CreatorWithdrawProfit(address creatorAddress, address payTokenAddress, uint256 balance);

    // modifier 
    modifier validTokenIndex(string memory matchId, uint tokenIndex) {
        require(matches[matchId].creatorAddress != ADDRESS_NULL, "invalid match"); 
        require(tokenIndex < matches[matchId].nftCount, "invalid token");
        _;
    }

    modifier creatorOnly(string memory matchId) {
         require(matches[matchId].creatorAddress == msg.sender, "creator only function"); 
        _;
    }
    
    // match finished should be used with checking valid match
    modifier matchFinished(string memory matchId) {
        // require(matches[matchId].creatorAddress != ADDRESS_NULL, "invalid match");
        require(matches[matchId].expiryBlock < block.number, "match is not finished");
        _;
    }

    constructor(string memory _payTokenName, address _payTokenAddress) {
        require(_payTokenAddress != address(0), "Pay Token Address should not be address(0)");
        payTokens[_payTokenName] = _payTokenAddress;
    }

    function setPayToken(string memory _token_name, address _token_address) external onlyOwner {
        require(_token_address != ADDRESS_NULL, "invalid token address");
		payTokens[_token_name] = _token_address;
	}

    function createAuction(
        string memory matchId,
        string memory payTokenName,
        uint96 openBlock, 
        uint96 expiryBlock,
        uint32 expiryExtension,
        uint96 minIncrement, 
        NFT[] memory nfts) external nonReentrant {

        // check if matchId is occupied
        require(matches[matchId].creatorAddress == ADDRESS_NULL, "matchId is occupied");

        require(payTokens[payTokenName] == ADDRESS_NULL, "not support this address pay token");
        
        // check valid openBlock, expiryBlock, expiryExtensionOnBidUpdate
        require(expiryBlock > openBlock && openBlock > block.number, "condition expiryBlock > openBlock > current block count not satisfied");
        require(expiryBlock - openBlock > BLOCKS_TO_EXPIRE * 2,      "auction time must not less than 2x BLOCKS_TO_EXPIRE");

        // check increment
        require(minIncrement < 100, "increment must be greater than 0 and less than 100%");
        
        // check item count
        require(nfts.length > 0 && nfts.length <= MAX_ITEM_PER_AUCTION, "number of nft must be greater than 0 and less than MAX_ITEM_PER_AUCTION");

        // deposit item to contract
        for(uint i = 0; i < nfts.length; ++i) {
            
            require(nfts[i].minBid > 1, "minBid must be greater than 1");
            require(minIncrement * nfts[i].minBid / 100 > 0, "increment should be greater than 0");
            
            
            // if meet requirements then send tokens to contract
            IERC1155(nfts[i].contractAddress).safeTransferFrom(msg.sender, address(this), nfts[i].tokenId, nfts[i].amount, "");
            
            // create slots for items
            matchResults[matchId][i]    = AuctionResult(ADDRESS_NULL, nfts[i].minBid, 0);
            matchNFTs[matchId][i]       = nfts[i];
        }

        // create match
        matches[matchId] = Match(
            msg.sender,
            payTokens[payTokenName],
            minIncrement, // percentage based
            openBlock,
            expiryBlock,
            expiryExtension, // expiryBlock will be extend (+=) for expiryExtension block(s) if bid updated in range [expiryBlock - expiryExtension + 1 .. expiryBlock]
            uint32(nfts.length)
        );

        // emit events
        // reateAuctionEvent(address creatorAddress, string matchId, uint96 openBlock, uint96 expiryBlock, uint96 increment, uint32 expiryExtension, uint tokenIndex, NFT nfts);
        for(uint i = 0; i < nfts.length; ++i) {
            emit CreateAuctionEvent(msg.sender, matchId, payTokens[payTokenName], openBlock, expiryBlock, minIncrement, expiryExtension, i, nfts[i]);
        }
    }

    function addAuctionNFT(
        string memory matchId,
        NFT memory nft) external nonReentrant {

        require(matches[matchId].expiryBlock >= block.number, "the match is finished");

        // check if matchId is existence
        require(matches[matchId].creatorAddress != ADDRESS_NULL, "matchId non-existent");

        Match storage amatch = matches[matchId];
        uint32 nftCount = amatch.nftCount;
        
        // check item count
        require(amatch.nftCount < MAX_ITEM_PER_AUCTION, "number of nft must be greater than 0 and less than MAX_ITEM_PER_AUCTION");

        // deposit item to contract
        require(nft.minBid > 1, "minBid must be greater than 1");
        require(amatch.minIncrement * nft.minBid / 100 > 0, "increment should be greater than 0");
        
        // if meet requirements then send tokens to contract
        IERC1155(nft.contractAddress).safeTransferFrom(msg.sender, address(this), nft.tokenId, nft.amount, "");
        
        // create slots for items
        matchResults[matchId][nftCount] = AuctionResult(ADDRESS_NULL, nft.minBid, 0);
        matchNFTs[matchId][nftCount]    = nft;

        // update match
        amatch.nftCount = uint32(nftCount + 1);
        // emit events
        // createAuctionEvent(address creatorAddress, string matchId, address payTokenAddress, uint96 openBlock, uint96 expiryBlock, uint96 increment, uint32 expiryExtension, uint tokenIndex, NFT nfts);
        emit CreateAuctionEvent(msg.sender, matchId, amatch.payTokenAddress, amatch.openBlock, amatch.expiryBlock, amatch.minIncrement, amatch.expiryExtension, nftCount, nft);
    }

    function player_bid(string memory matchId, uint tokenIndex, uint amount) external nonReentrant validTokenIndex(matchId, tokenIndex) {
        Match memory amatch = matches[matchId];
        address playerAddress = msg.sender;
        require(amatch.openBlock < block.number && block.number <= amatch.expiryBlock, "match is not opened for bidding");
        
        AuctionResult memory auctionResult = matchResults[matchId][tokenIndex];
        uint    standingBid     = auctionResult.standingBid;
        uint    nftMinBid       = matchNFTs[matchId][tokenIndex].minBid;
        uint    increment       = nftMinBid * amatch.minIncrement / 100;
        address payTokenAddress = amatch.payTokenAddress;
        
        // check valid amount (> current wining, sender someone different from winner)
        // known issue: Auction creator should be aware of the case where stadingBid = 1 and min increment >= 1
        require(
            amount > standingBid && 
            amount - standingBid >= increment, 
            "illegal increment"
        );

        // update the winner for that token
        matchResults[matchId][tokenIndex] = AuctionResult(playerAddress, amount, amount);
    
        // if in BLOCKS_TO_EXPIRE blocks then extends the auction expiry time
        if (amatch.expiryBlock - block.number < BLOCKS_TO_EXPIRE) {
            amatch.expiryBlock += amatch.expiryExtension;
            matches[matchId].expiryBlock = amatch.expiryBlock;
        }

        // just transfer (amount - currentBid) of that person to contract
        uint transferAmount = amount - playerBid[matchId][playerAddress][tokenIndex][payTokenAddress]; // sure that amount always higher than current
        playerBid[matchId][playerAddress][tokenIndex][payTokenAddress] = amount;
    
        // emit event
        emit PlayerBidEvent(
            matchId, 
            playerAddress,
            tokenIndex,
            payTokenAddress,
            amount, 
            amatch.expiryBlock
        );
        IERC20(payTokenAddress).safeTransferFrom(playerAddress, address(this), transferAmount);
    }

    function player_fixed_price(string memory matchId, uint tokenIndex) external nonReentrant validTokenIndex(matchId, tokenIndex) {
        Match memory amatch = matches[matchId];
        address playerAddress = msg.sender;
        require(amatch.openBlock < block.number && block.number <= amatch.expiryBlock, "match is not opened for bidding");
        
        AuctionResult memory auctionResult = matchResults[matchId][tokenIndex];
        uint standingBid = auctionResult.standingBid;
        uint fixedPrice  = matchNFTs[matchId][tokenIndex].fixedPrice;
        address payTokenAddress = amatch.payTokenAddress;

        // check standingBid price
        require(fixedPrice > standingBid, "Standingbid has exceeded the fixedPrice");

        // update the winner for that token
        matchResults[matchId][tokenIndex] = AuctionResult(playerAddress, fixedPrice, fixedPrice);
    
        // if in BLOCKS_TO_EXPIRE blocks then extends the auction expiry time
        if (amatch.expiryBlock - block.number < BLOCKS_TO_EXPIRE) {
            amatch.expiryBlock += amatch.expiryExtension;
            matches[matchId].expiryBlock = amatch.expiryBlock;
        }

        // just transfer (amount - currentBid) of that person to contract
        uint transferAmount = fixedPrice - playerBid[matchId][playerAddress][tokenIndex][payTokenAddress]; // sure that amount always higher than current
        playerBid[matchId][playerAddress][tokenIndex][payTokenAddress] = fixedPrice;
    
        // emit event
        emit PlayerBidEvent(
            matchId, 
            playerAddress,
            tokenIndex,
            payTokenAddress,
            fixedPrice, 
            amatch.expiryBlock
        );
        IERC20(payTokenAddress).safeTransferFrom(playerAddress, address(this), transferAmount);

        // send NFT
        _win_audit(matchId, tokenIndex);
    }

    // player can withdraw bid if he is not winner of this match
    function player_withdraw_bid(string memory matchId, uint tokenIndex) external nonReentrant validTokenIndex(matchId, tokenIndex) {
        
        // check if player is top bidder 
        address playerAddress = msg.sender;
        require(matchResults[matchId][tokenIndex].topBidder != playerAddress, "top bidder cannot withdraw");
        Match memory amatch = matches[matchId];
        address payTokenAddress = amatch.payTokenAddress;

        uint amount = playerBid[matchId][playerAddress][tokenIndex][payTokenAddress];
        require(amount > 0, "bid must be greater than 0 to withdraw");

        // reset bid amount        
        playerBid[matchId][playerAddress][tokenIndex][payTokenAddress] = 0;

        // transfer money
        IERC20(payTokenAddress).safeTransfer(playerAddress, amount); // auto reverts on error

        // emit events
        // event PlayerWithdrawBid(string matchId, uint tokenIndex);
        emit PlayerWithdrawBid(matchId, tokenIndex);
    }

    // anyone can call reward, top bidder and creator are incentivized to call this function to send rewards/profit
    function reward(string memory matchId, uint tokenIndex) external validTokenIndex(matchId, tokenIndex) matchFinished(matchId) {
        _win_audit(matchId, tokenIndex);
    }

    function process_withdraw_nft(string memory matchId, uint tokenIndex) private {
        // set standingBid to 0 to prevent withdraw again
        matchResults[matchId][tokenIndex].standingBid = 0;
        // transfer asset
        NFT memory nft = matchNFTs[matchId][tokenIndex];
        IERC1155(nft.contractAddress).safeTransferFrom(address(this), msg.sender, nft.tokenId, nft.amount, "");

        // emit events
        // event ProcessWithdrawNft(string matchId, uint tokenIndex);
        emit ProcessWithdrawNft(matchId, tokenIndex);
    }

    // creator withdraws unused nft
    function creator_withdraw_nft_batch(string memory matchId) external creatorOnly(matchId) matchFinished(matchId) { 
        // check valid matchId, match finished
        uint _len = matches[matchId].nftCount;
        for(uint i = 0; i < _len; ++i) {
            
            // consider result
            AuctionResult memory result = matchResults[matchId][i];
            
            // if no one wins the token then withdraw 
            if (result.topBidder == ADDRESS_NULL && result.standingBid > 0) {
                process_withdraw_nft(matchId, i);
            }
        }
    }
    
    function creator_withdraw_nft(string memory matchId, uint tokenIndex) external validTokenIndex(matchId, tokenIndex) creatorOnly(matchId) matchFinished(matchId) {
        AuctionResult memory result = matchResults[matchId][tokenIndex];
        require (result.topBidder == ADDRESS_NULL && result.standingBid > 0, "token is not available to withdraw");
        
        process_withdraw_nft(matchId, tokenIndex);
    }

    function creator_withdraw_profit(string memory payTokenName) external {
        require(payTokens[payTokenName] == ADDRESS_NULL, "not support this address pay token");
        address payTokenAddress = payTokens[payTokenName];

        uint balance = creatorBalance[msg.sender][payTokenAddress];
        require(balance > 0, "creator balance must be greater than 0");
        
        // reset balance 
        creatorBalance[msg.sender][payTokenAddress] = 0;
        
        // send money
        IERC20(payTokenAddress).safeTransfer(msg.sender, balance);
        // emit events
        // event CreatorWithdrawProfit(address creatorAddress, uint256 balance);
        emit CreatorWithdrawProfit(msg.sender, payTokenAddress, balance);
    }



    function supportsInterface(bytes4 interfaceId) public view virtual override(ERC165, IERC165) returns (bool) {
        return
            interfaceId == type(IERC1155).interfaceId ||
            super.supportsInterface(interfaceId);
    }

    function onERC1155Received(address operator, address from, uint256 id, uint256 value, bytes calldata data) external override pure returns (bytes4) {
        // return ERC1155_ONRECEIVED_RESULT to conform the interface
        return ERC1155_ONRECEIVED_RESULT;
    }

    function onERC1155BatchReceived(address operator, address from, uint256[] calldata ids, uint256[] calldata values, bytes calldata data) external override pure returns (bytes4) {
        // return ERC1155_ONBATCHRECEIVED_RESULT to conform the interface
        return ERC1155_ONBATCHRECEIVED_RESULT;
    }

    function get_match(string memory matchId) external view returns(address, address, uint, uint, uint, uint, uint) {
        Match memory amatch = matches[matchId];
        return (
            amatch.creatorAddress,
            amatch.payTokenAddress,
            amatch.minIncrement, 
            amatch.openBlock,
            amatch.expiryBlock,
            amatch.expiryExtension,
            amatch.nftCount
        );
    }

    function get_pay_token(string calldata payTokenName) external view returns(string memory, address) {
        return (
            payTokenName,
            payTokens[payTokenName]
        );
    }

    function get_current_result(string memory matchId, uint tokenIndex) external view returns (address, uint) {
        return (matchResults[matchId][tokenIndex].topBidder, matchResults[matchId][tokenIndex].standingBid);
    }

    function get_player_bid(string memory matchId, address playerAddress, uint tokenIndex, address payTokenAddress) external view returns(uint) {
        return playerBid[matchId][playerAddress][tokenIndex][payTokenAddress];
    }

    function get_creator_balance(address creatorAddress, address payTokenAddress) external view returns(uint) {
        return creatorBalance[creatorAddress][payTokenAddress];
    }

    function _win_audit(string memory matchId, uint tokenIndex) internal returns (bool) {
        Match memory amatch = matches[matchId];
        address payTokenAddress = amatch.payTokenAddress;

        address winnerAddress  = matchResults[matchId][tokenIndex].topBidder;
        uint finalBid  = matchResults[matchId][tokenIndex].finalBid;
        require(winnerAddress != ADDRESS_NULL, "winner is not valid");

        // set result to null
        matchResults[matchId][tokenIndex] = AuctionResult(ADDRESS_NULL, 0, finalBid);

        // increase creator's balance
        uint standingBid = playerBid[matchId][winnerAddress][tokenIndex][payTokenAddress];
        playerBid[matchId][winnerAddress][tokenIndex][payTokenAddress] = 0;
        creatorBalance[matches[matchId].creatorAddress][payTokenAddress] += standingBid;
        
        NFT memory nft = matchNFTs[matchId][tokenIndex];
        // send nft to “address”
        IERC1155(nft.contractAddress).safeTransferFrom(address(this), winnerAddress, nft.tokenId, nft.amount, "");
        emit RewardEvent(matchId, tokenIndex, winnerAddress);

        return true;
    }
}