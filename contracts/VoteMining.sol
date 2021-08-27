// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/math/SafeMath.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC721/IERC721.sol";


interface ITreasury {
	function sendRewards(address to, uint256 amount) external returns(uint256 val);
	function uink() external view returns(address);
}

interface IAuction {
	function matchResults(string calldata matchId, uint index) external view returns(address, uint);
}

interface ITokenLocker {
	function subLockForVote(uint256 lockId, address accountAddress) external returns(uint);
}


contract VoteMining is Ownable {
	using SafeMath for uint256;

	uint public weeklyCap = 50000 * 1e18;
	uint public dailyVoteRewardCap = weeklyCap / 7 / 4; // 25% of daily cap 
	uint public dailyMintRewardCap = weeklyCap / 7 / 4; // 25% of daily cap 
	uint public bonusCap = weeklyCap  / 2; // 50% of weekly cap
	// group id => amount
	mapping (uint => uint) public stakingBases;


	address public uink;
	ITreasury public treasury;
	address public auction;

	struct NFT {
		uint uid;
		address addr;
		uint id;
		address owner;
	}
	// id => start time
	mapping (uint => uint) public groups;
	uint public currentGroupId = 0;
	// group id => matchId
	mapping (uint => string) public matches;
	// group id => finished or not
	mapping (uint => bool) public hasFinished;
	
	

	
	// group id => NFT[]
	mapping (uint => NFT[]) groupNFTs;
	// date => NFT uid => votes
	mapping (uint => mapping (uint => uint)) dayVotes;
	// user => date => NFT id => amount
	mapping (address => mapping (uint => mapping (uint => uint))) userVotes;
		
	// nft address => nftId => internal id
	mapping (address => mapping (uint => uint)) nfts;
	uint public nextNFTId = 0;
	// group id => votes
	mapping (uint => uint) public groupVotes;

	// uid => votes
	mapping (uint => uint) public nftVotes;

	// uid => group id
	mapping (uint => uint) public nftGroup;
	
	
	
	struct VoteBalance {
		uint balance;
		uint releaseAt;
	}

	// user => amount
	mapping (address => uint) public balances;

	// user => group => amount
	mapping (address => mapping (uint => VoteBalance)) public nextVotableBalances;
	
	// uid => price
	mapping (uint => uint) public nftTradedPrices;
	// user => group => date => bool
	mapping (address => mapping (uint => mapping (uint => bool))) public voteRewardsClaimed;
	// user = > group id => bool
	mapping (address => mapping (uint => bool)) public bonusRewardsClaimed;
	// nft uid => bool
	mapping (uint => bool) public mintRewardsClaimed;
	

	mapping (address => bool) public operators;

	address public pinAddress;

	uint public tokenLockId = 0;

	address public tokenLocker;
	

	modifier checkNFT(address nftAddr, uint nftId) { 
		require(nfts[nftAddr][nftId] > 0, "Invalid NFT");
		_; 
	}

	modifier onlyPin() { 
		require(msg.sender == pinAddress, "Forbidden"); 
		_; 
	}
	

	modifier checkVotingTime() { 
		require(groups[currentGroupId] <= block.timestamp, "Voting is not start");
		require(groups[currentGroupId].add(7 days) >= block.timestamp, "Voting is over");
		_; 
	}

	
	
	constructor(address _treasury, address _auction, address _tokenLocker){
		treasury = ITreasury(_treasury);
		auction = _auction;
		uink = treasury.uink();
		tokenLocker = _tokenLocker;
	}
	// modifier onlyOperator() {
	// 	require(operators[msg.sender], "Not operator");
	// 	_;
	// }
	// function addOperator(address _operator) external onlyOwner {
	// 	operators[_operator] = true;
	// }
	
	// function removeOperator(address _operator) external onlyOwner {
	// 	operators[_operator] = false;
	// }

	function setPinAddress(address _pin) external onlyOwner {
		pinAddress = _pin;
	}

	function setTokenLockId(uint lockId) external onlyOwner {
		tokenLockId = lockId;
	}

	function addGroup(uint stakingBase, uint startTime, string calldata matchId) external onlyOwner {
		currentGroupId++;
		groups[currentGroupId] = startTime;
		stakingBases[currentGroupId] = stakingBase;
		matches[currentGroupId] = matchId;
	}

	function addNFT(uint groupId, address[] calldata nftAddrs, uint[] calldata nftIds) external onlyOwner {
		require(nftAddrs.length == nftIds.length, "Invalid params");
		NFT[] storage inputNFTs = groupNFTs[groupId];

		for(uint i = 0; i < nftAddrs.length; i++) {
			nextNFTId++;
			nfts[nftAddrs[i]][nftIds[i]] = nextNFTId;
			address nftOwner = IERC721(nftAddrs[i]).ownerOf(nftIds[i]);
			inputNFTs.push(NFT({
				uid: nextNFTId,
				addr: nftAddrs[i],
				id: nftIds[i],
				owner: nftOwner
			}));
			nftGroup[nextNFTId] = groupId;
		}
	}

	function getAuctionPrices(uint groupId) public view returns(uint[] memory prices, uint totalAmount) {
		prices = new uint[](groupNFTs[groupId].length);
		for(uint i = 0; i < groupNFTs[groupId].length; i++) {
			(, uint price) = IAuction(auction).matchResults(matches[groupId], i);
			prices[i] = price;
			totalAmount = totalAmount.add(price);
		}
	}

	
	function getDate(uint256 ts) public pure returns(uint256) {
		return ts.sub(ts.mod(1 days));
	}

	function getVotableDates(uint groupId) public view returns(uint[] memory dates) {
		uint start = groups[groupId];
		dates = new uint[](7);
		uint firstDate = getDate(start);
		for(uint i = 0; i < 7; i++) {
			dates[i] = firstDate.add(i * 24 * 60 * 60);
		}
	}

	function getVotableBalance(address user) public view returns(uint) {
		uint balance = 0;
		if(currentGroupId == 0) {
			return 0;
		}

		VoteBalance memory preVotableBalance = nextVotableBalances[user][currentGroupId - 1];
		if(preVotableBalance.releaseAt > block.timestamp) {
			balance = balance.add(preVotableBalance.balance);
		}

		return balance;
	}

	function getAvailableBalance(address user) public view returns(uint) {
		uint balance = 0;
		if(currentGroupId == 0) {
			return balance;
		}

		for(uint i = 1; i <= currentGroupId; i++) {
			VoteBalance memory nvBalance = nextVotableBalances[user][i];
			if(nvBalance.releaseAt < block.timestamp) {
				balance = balance.add(nvBalance.balance);
			}
		}
		return balance;
	}

	function getVotedBalance(address user) public view returns(uint) {
		uint balance = 0;
		for(uint i = 1; i <= currentGroupId; i++) {
			VoteBalance memory nvBalance = nextVotableBalances[user][i];
			if(nvBalance.releaseAt > block.timestamp) {
				balance = balance.add(nvBalance.balance);
			}
		}
		return balance;
	}



	function _vote(address user, address nftAddr, uint nftId, uint amount) internal {
		uint today = getDate(block.timestamp);
		uint[] memory dates = getVotableDates(currentGroupId);
		uint uid = nfts[nftAddr][nftId];

		for(uint i = 0; i < dates.length; i++) {
			if(dates[i] >= today) {
				uint date = dates[i];
				dayVotes[date][uid] = dayVotes[date][uid].add(amount);
				userVotes[user][date][uid] = userVotes[user][date][uid].add(amount);
			}
		}
		nftVotes[uid] = nftVotes[uid].add(amount);
		groupVotes[currentGroupId] = groupVotes[currentGroupId].add(amount);
	}

	function stakeFromLock(address nftAddr, uint nftId) 
		external 
		checkVotingTime
		checkNFT(nftAddr, nftId) 
	{

		uint amount = ITokenLocker(tokenLocker).subLockForVote(tokenLockId, msg.sender);
		_vote(msg.sender, nftAddr, nftId, amount);

		balances[msg.sender] = balances[msg.sender].add(amount);

		VoteBalance storage nvBalance = nextVotableBalances[msg.sender][currentGroupId];
		nvBalance.balance = nvBalance.balance.add(amount);
		if(nvBalance.releaseAt == 0) {
			nvBalance.releaseAt = groups[currentGroupId].add(14 days); 
		}
	}

	// stake and vote
	function stake(address nftAddr, uint nftId, uint amount)
		external 
		checkVotingTime
		checkNFT(nftAddr, nftId) 
	{
		_vote(msg.sender, nftAddr, nftId, amount);

		IERC20(uink).transferFrom(msg.sender, address(this), amount);
		balances[msg.sender] = balances[msg.sender].add(amount);


		VoteBalance storage nvBalance = nextVotableBalances[msg.sender][currentGroupId];
		nvBalance.balance = nvBalance.balance.add(amount);
		if(nvBalance.releaseAt == 0) {
			nvBalance.releaseAt = groups[currentGroupId].add(14 days); 
		}
	}

	function vote(address nftAddr, uint nftId, uint amount) 
		external 
		checkVotingTime
		checkNFT(nftAddr, nftId)
	{
		uint votableBalance = getVotableBalance(msg.sender);
		require(votableBalance >= amount, "Insufficient vote balance");
		_vote(msg.sender, nftAddr, nftId, amount);


		VoteBalance storage pvBalance = nextVotableBalances[msg.sender][currentGroupId - 1];
		if(pvBalance.releaseAt > block.timestamp) {
			pvBalance.balance = pvBalance.balance.sub(amount);
		}

		VoteBalance storage nvBalance = nextVotableBalances[msg.sender][currentGroupId];
		nvBalance.balance = nvBalance.balance.add(amount);
		if(nvBalance.releaseAt == 0) {
			nvBalance.releaseAt = groups[currentGroupId].add(14 days);			
		}
	}


	function redeem() external {
		uint total = 0;
		for(uint i = 1; i <= currentGroupId; i++) {
			VoteBalance storage nvBalance = nextVotableBalances[msg.sender][i];
			if(nvBalance.releaseAt < block.timestamp) {
				total = total.add(nvBalance.balance);
				nvBalance.balance = 0;
			}
		}

		if(total > 0) {
			IERC20(uink).transfer(msg.sender, total);	
		}
	}

	function getUserDailyVotes(address user, uint groupId, uint date) public view returns(uint) {
		uint votes = 0;
		NFT[] memory gNFTs = groupNFTs[groupId];
		for(uint i = 0; i < gNFTs.length; i++) {
			votes = userVotes[user][date][gNFTs[i].uid].add(votes);
		}
		return votes;
	}

	function getUserVotesByNFT(address user, uint groupId, uint uid) public view returns(uint) {
		uint[] memory dates = getVotableDates(groupId);
		uint votes = 0;
		for(uint i = 0; i < dates.length; i++) {
			votes = userVotes[user][dates[i]][uid].add(votes);
		}
		return votes;
	}

	function claimVoteRewards(uint groupId) external {


		uint[] memory dates = getVotableDates(groupId);
		uint[] memory rawardRates = getBaseRewardRates(groupId);

		uint rewards = 0;
		uint today = getDate(block.timestamp);
		for(uint i = 0; i < dates.length; i++) {
			if(dates[i] >= today){
				break;
			}
			if(voteRewardsClaimed[msg.sender][groupId][dates[i]]){
				continue;
			}

			uint dayRewards = getUserDailyVotes(msg.sender, groupId, dates[i]).mul(rawardRates[i]).div(1e18);
			if(dayRewards > 0) {
				rewards = rewards.add(dayRewards);
			}
		}

		if(rewards > 0) {
			treasury.sendRewards(msg.sender, rewards);
		}
	}


	// function claimMintRewards(uint groupId) external {
	// 	require(!mintRewardsClaimed[msg.sender][groupId], "Claimed");
	// 	require(groupId <= currentGroupId && groups[groupId] > 0, "Invalid group ID");
	// 	require(groups[groupId] + 7 days < block.timestamp, "Voting is not finished");
	// 	uint rewards = 0;
	// 	for(uint i = 0; i < groupNFTs[groupId].length; i++) {
	// 		if(groupNFTs[groupId][i].owner == msg.sender) {
	// 			rewards = rewards.add(getMintRewardsPerNFT(groupId)[i]);
	// 		}
	// 	}
	// 	if(rewards > 0) {
	// 		treasury.sendRewards(msg.sender, rewards);
	// 	}
	// }

	function claimMintRewards(address nftAddr, uint nftId, address to) external onlyPin {
		uint uid = nfts[nftAddr][nftId];
		uint groupId = nftGroup[nfts[nftAddr][nftId]];
		require(!mintRewardsClaimed[uid], "Claimed");

		uint rewards = 0;
		for(uint i = 0; i < groupNFTs[groupId].length; i++) {
			if(groupNFTs[groupId][i].uid == uid) {
				rewards = getMintRewardsPerNFT(groupId)[i];
				break;
			}
		}
		if(rewards > 0) {
			treasury.sendRewards(to, rewards);
			mintRewardsClaimed[uid] = true;
		}
	}

	function claimBonusRewards(uint groupId) external {
		require(hasFinished[groupId], "Acution is not over");
		require(!bonusRewardsClaimed[msg.sender][groupId], "Claimed");
		uint[] memory rewardRates = getBonusRewardRates(groupId);
		uint rewards = 0;
		for(uint i = 0; i < groupNFTs[groupId].length; i++) {
			if(groupNFTs[groupId][i].owner == msg.sender) {
				uint votes = getUserVotesByNFT(msg.sender, groupId, groupNFTs[groupId][i].uid);
				rewards = votes.mul(rewardRates[i]).div(1e18).add(rewards);
			}
		}
		if(rewards > 0) {
			treasury.sendRewards(msg.sender, rewards);
		}
	}

	function getTradeWeights(uint groupId) public view returns(uint[] memory weights) {
		NFT[] memory gNFTs = groupNFTs[groupId];
		weights = new uint[](gNFTs.length);
		
		(uint[] memory prices, uint total) = getAuctionPrices(groupId);

		if(total > 0) {
			for(uint i = 0; i < gNFTs.length; i++){
				weights[i] = prices[i].mul(1e18).div(total);
			}
		}
	}

	function setAuctionFinish(uint groupId) external onlyOwner {
		hasFinished[groupId] = true;
	}

	function getBonusRewardRates(uint groupId) public view returns(uint[] memory bonusRewardRates) {
		uint[] memory weights = getTradeWeights(groupId);
		NFT[] memory gNFTs = groupNFTs[groupId];
		bonusRewardRates = new uint[](gNFTs.length);
		(, uint[] memory inflations) = getWeightsAndInflations(groupId);
		uint bonus = bonusCap.mul(inflations[inflations.length - 1]).div(1e18);

		for(uint i = 0; i < gNFTs.length; i++) {
			if(nftVotes[gNFTs[i].uid] == 0) {
				bonusRewardRates[i] = 0;
			} else {
				bonusRewardRates[i] = bonus.mul(weights[i]).div(nftVotes[gNFTs[i].uid]);
			}
		}
	}

	function getDailyVotes(uint groupId, uint date) public view returns(uint256) {
		uint votes = 0;
		for(uint i = 0; i < groupNFTs[groupId].length; i++) {
			uint uid = groupNFTs[groupId][i].uid;
			votes = votes.add(dayVotes[date][uid]);
		}
		return votes;
	}

	function getWeightsAndInflations(uint groupId)
		public
		view
		returns(
			uint[] memory weights,
			uint[] memory inflations
		) 
	{

		uint[] memory dates = getVotableDates(groupId);
		weights = new uint[](dates.length);
		inflations = new uint[](dates.length);

		for(uint i = 0; i < dates.length; i++) {
			uint dailyVotes = getDailyVotes(groupId, dates[i]);
			weights[i] = dailyVotes.mul(1e18).div(stakingBases[groupId]);
			if(weights[i] < 3 * 1e17) {
				inflations[i] = 2 * 1e17;
			} else if(weights[i] >= 3 * 1e17 &&  weights[i] < 7 * 1e17) {
				inflations[i] = weights[i];
			} else {
				inflations[i] = 1e18;
			}
		}
	}

	function getBaseRewardRates(uint groupId) 
		public view 
		returns(uint[] memory rewardRates) 
	{

		uint[] memory dates = getVotableDates(groupId);
		(,uint[] memory inflations) = getWeightsAndInflations(groupId);
		rewardRates = new uint[](dates.length);

		for(uint i = 0; i < dates.length; i++) {
			if(dates[i] > getDate(block.timestamp)) {
				continue;
			}
			uint dailyTotalVotes = getDailyVotes(groupId, dates[i]);
			rewardRates[i] = inflations[i].mul(dailyVoteRewardCap).div(dailyTotalVotes);
		}
	}

	function getMintRewardsPerNFT(uint groupId)
		public view 
		returns(uint[] memory mintRewards) 
	{
		mintRewards = new uint[](groupNFTs[groupId].length);
		for(uint i = 0; i < groupNFTs[groupId].length; i++) {
			if(groupVotes[groupId] > 0) {
				mintRewards[i] = nftVotes[groupNFTs[groupId][i].uid].mul(dailyMintRewardCap).div(groupVotes[groupId]);
			}
		}
	}
}