// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/math/SafeMath.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC721/IERC721.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/IERC20Metadata.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";


interface ITreasury {
	function sendRewards(address to, uint256 amount) external returns(uint256 val);
	function uink() external view returns(address);
}

interface IAuction {
	function matchResults(string calldata matchId, uint index) external view returns(address, uint, uint);
}

interface ITokenLocker {
	function subLockForVote(uint256 lockId, address accountAddress) external returns(uint);
}

interface IVoteMiningV1 {
	function getBondedBalance(address user) external view returns(uint);
	function unbondingBalances(address user, uint index) external view returns(uint, uint, uint);
	function getUnbondingBalancesLength(address user) external view returns(uint);
	function getUnvotableBalance(address user, address nftAddr, uint nftId) external view returns(uint);
	function groupNFTs(uint groupId, uint index) external view returns(uint uid, address addr, uint id, address owner);
	function groupNFTsLength(uint groupId) external view returns(uint);

}


contract VoteMiningV3 is Ownable, ReentrancyGuard {
	using SafeMath for uint256;
	using SafeERC20 for IERC20;

	uint public VOTE_TIME_UNIT = 1 days;
	uint public VOTE_DAYS = 14;
	uint public VOTE_DURATION = VOTE_DAYS * VOTE_TIME_UNIT;

	uint public weeklyCap = 400000 * 1e12;
	uint public dailyVoteRewardCap = weeklyCap / 4 / VOTE_DAYS; // 1/14 of 25% of group cap 
	uint public mintRewardCap = weeklyCap / 4; // 25% of group cap 
	uint public bonusCap = weeklyCap  / 2; // 50% of group cap
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
	uint public currentGroupId = 1; // V2 starts from 1
	uint public startGroupId = 2;
	// group id => matchId
	mapping (uint => string) public matches;
	// group id => finished or not
	mapping (uint => bool) public hasFinished;
	
	
	// group id => NFT[]
	mapping (uint => NFT[]) public groupNFTs;

	// date => NFT uid => votes
	mapping (uint => mapping (uint => uint)) public dayVotes;

	// user => date => NFT id => amount
	mapping (address => mapping (uint => mapping (uint => uint))) public userVotes;

	// user => groupId => date => votes
	mapping (address => mapping (uint => mapping (uint => uint))) public userDailyVotes;

	// user => nft uid => votes 
	mapping (address => mapping (uint => uint)) public userNFTVotes;
	

	// nft address => nftId => internal id
	mapping (address => mapping (uint => uint)) public nfts;
	uint public nextNFTId = 0;

	// group id => votes
	mapping (uint => uint) public groupVotes;

	// uid => votes
	mapping (uint => uint) public nftVotes;

	// date => votes
	// mapping (uint => uint) public dailyTotalVotes;
	

	// uid => group id
	mapping (uint => uint) public nftGroup;
	
	address[] public voteTokens;
	// token => ratio
	mapping (address => uint) public voteRatio;

	uint public voteRatioMax = 10000;

	mapping (address => bool) public migrated;
	
	
	address internal v1;

	struct Balance {
		uint available;
		uint freezed;
		uint votedAt;
	}

	struct UnbondingBalance {
		uint value;
		uint unbondedAt;
		uint redeemed;
	}

	// user => token => uid => Balance
	mapping (address => mapping (address => mapping (uint => Balance))) public balances;

	// user => token => balance
	mapping (address => mapping (address => uint)) public userTokenBalances;

	// user => uid => Balance
	mapping (address => mapping (uint => Balance)) public votedBalances; // bonded => voted 
	
	// user => voted amount
	mapping (address => uint) public totalVotedBalances;

	// user => bonded amount
	mapping (address => uint) public bondedBalances;

	// user => UnbondingBalance[]
	mapping (address => UnbondingBalance[]) public unbondingBalances;
	
	// user => total unbonded amount
	mapping (address => uint) public unbondedBalances;
	

	// uid => price
	mapping (uint => uint) public nftTradedPrices;
	// user => group => date => bool
	mapping (address => mapping (uint => mapping (uint => bool))) public voteRewardsClaimed;
	// user = > group id => bool
	mapping (address => mapping (uint => bool)) public bonusRewardsClaimed;
	// nft uid => bool
	mapping (uint => bool) public mintRewardsClaimed;

	// groupId => user => token => balance
	mapping (uint => mapping (address => mapping (address => uint))) public groupTokenBalances;
		

	mapping (address => bool) public operators;

	address public pinAddress;

	uint public tokenLockId = 0;

	address public tokenLocker;

	event AddGroup(uint groupId, uint stakingBase, uint startTime, string matchId);
	event AddNFT(uint groupId, address nftAddr, uint nftId, uint uid);
	event Redeem(address indexed user, uint groupId, address token, uint amount);
	event RedeemUnbonding(address indexed user, uint index, uint amount);
	event Unbond(address indexed user, uint amount, uint at);
	event Stake(address indexed user, address nftAddr, uint nftId, address token, uint amount);
	event Unstake(address indexed user, address nftAddr, uint nftId, address token, uint amount);
	event VoteBonded(address indexed user, address nftAddr, uint nftId, uint amount);
	event UnvoteBonded(address indexed user, address nftAddr, uint nftId, uint amount);
	event MintRewardsClaimed(address nftAddr, uint nftId, address to);
	event MigrateBonded(address indexed user, uint amount);
	event MigrateUnbonding(address indexed user, uint index, uint amount, uint unbondedAt, uint redeemed);


	modifier checkNFT(address nftAddr, uint nftId) { 
		require(nfts[nftAddr][nftId] > 0, "Invalid NFT");
		_; 
	}

	modifier onlyPin() { 
		require(msg.sender == pinAddress, "Forbidden"); 
		_; 
	}

	modifier onlyOperator() { 
		require (operators[msg.sender] || owner() == _msgSender(), "Not operator"); 
		_; 
	}
	
	

	modifier checkVotingTime() { 
		require(groups[currentGroupId] <= block.timestamp, "Voting is not start");
		require(groups[currentGroupId].add(VOTE_DURATION) >= block.timestamp, "Voting is over");
		_; 
	}

	modifier checkVoteToken(address _token) { 
		bool isValid = false;
		for(uint i = 0; i < voteTokens.length; i++) {
			if(voteTokens[i] == _token) {
				isValid = true;
				break;
			}
		}
		require(isValid, "Invalid Vote Token");
		_; 
	}

	constructor(address _treasury, address _tokenLocker){
		require(_treasury != address(0), "_treasury is zero address");
		require(_tokenLocker != address(0), "_tokenLocker is zero address");
		treasury = ITreasury(_treasury);
		uink = treasury.uink();
		tokenLocker = _tokenLocker;

		voteTokens.push(uink);
		voteRatio[uink] = voteRatioMax;
	}

	function addVoteToken(address _token, uint _ratio) external onlyOperator {
		voteRatio[_token] = _ratio;
		for(uint i = 0; i < voteTokens.length; i++) {
			if(voteTokens[i] == _token) {
				return;
			}
		}
		voteTokens.push(_token);
	}

	function setAuctionAddress(address _auction) external onlyOwner {
		auction = _auction;
	}

	function setV1Address(address _v1) external onlyOwner {
		v1 = _v1;
	}

	function setPinAddress(address _pin) external onlyOwner {
		pinAddress = _pin;
	}

	function setTokenLockId(uint lockId) external onlyOwner {
		tokenLockId = lockId;
	}

	function setOperator(address operator, bool isOperator) external onlyOwner {
		operators[operator] = isOperator;
	}

	function setVoteDays(uint _days) external onlyOwner {
		VOTE_DAYS = _days;
	}

	function setMatchId(uint groupId, string calldata matchId) external onlyOperator {
		matches[groupId] = matchId;
	}

	function addGroup(uint stakingBase, uint startTime, string calldata matchId) external onlyOperator {
		require(currentGroupId == startGroupId || groups[currentGroupId].add(VOTE_DURATION) <= block.timestamp, "Previous group is not over.");
		require(startTime >= getDate(block.timestamp), "Invalid start time");
		currentGroupId++;
		groups[currentGroupId] = startTime;
		stakingBases[currentGroupId] = stakingBase;
		matches[currentGroupId] = matchId;

		emit AddGroup(currentGroupId, stakingBase, startTime, matchId);
	}

	function addNFT(uint groupId, address[] calldata nftAddrs, uint[] calldata nftIds) external onlyOperator {
		require(nftAddrs.length == nftIds.length, "Invalid params");
		require(groups[groupId] > block.timestamp, "Voting has started");

		NFT[] storage inputNFTs = groupNFTs[groupId];

		for(uint i = 0; i < nftAddrs.length; i++) {
			require(nfts[nftAddrs[i]][nftIds[i]] == 0, "NFT has been added");
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

			emit AddNFT(groupId, nftAddrs[i], nftIds[i], nextNFTId);
		}
	}

	function groupNFTsLength(uint groupId) public view returns(uint256) {
		return groupNFTs[groupId].length;
	}

	function getAuctionPrices(uint groupId) public view returns(uint[] memory prices, uint totalAmount) {
		prices = new uint[](groupNFTs[groupId].length);
		for(uint i = 0; i < groupNFTs[groupId].length; i++) {
			(,, uint price) = IAuction(auction).matchResults(matches[groupId], i);
			prices[i] = price;
			totalAmount = totalAmount.add(price);
		}
	}

	
	function getDate(uint256 ts) public view returns(uint256) {
		return ts.sub(ts.mod(VOTE_TIME_UNIT));
	}

	function getVotableDates(uint groupId) public view returns(uint[] memory dates) {
		uint start = groups[groupId];
		dates = new uint[](VOTE_DAYS);
		uint firstDate = getDate(start);
		for(uint i = 0; i < VOTE_DAYS; i++) {
			dates[i] = firstDate.add(i * VOTE_TIME_UNIT);
		}
	}

	function _vote(address user, address nftAddr, uint nftId, uint votes) internal {
		uint groupId = nftGroup[nfts[nftAddr][nftId]];
		if(groups[groupId].add(VOTE_DURATION) < block.timestamp) {
			return;
		}
		uint today = getDate(block.timestamp);
		uint[] memory dates = getVotableDates(groupId);
		uint uid = nfts[nftAddr][nftId];

		for(uint i = 0; i < dates.length; i++) {
			if(dates[i] >= today) {
				uint date = dates[i];
				dayVotes[date][uid] = dayVotes[date][uid].add(votes);
				userVotes[user][date][uid] = userVotes[user][date][uid].add(votes);
				userDailyVotes[user][groupId][date] = userDailyVotes[user][groupId][date].add(votes);
				userNFTVotes[user][uid] = userNFTVotes[user][uid].add(votes);
				
				nftVotes[uid] = nftVotes[uid].add(votes);
				groupVotes[groupId] = groupVotes[groupId].add(votes);
			}
		}
	}

	function getUserNFTVotes(address user, address nftAddr, uint nftId) public view returns(uint256) {
		uint today = getDate(block.timestamp);
		uint groupId = nftGroup[nfts[nftAddr][nftId]];
		uint[] memory dates = getVotableDates(groupId);
		uint uid = nfts[nftAddr][nftId];
		uint votes = 0;
		for(uint i = 0; i < dates.length; i++) {
			if(dates[i] <= today) {
				votes = votes.add(userVotes[user][dates[i]][uid]);
			}
		}
		return votes;
	}

	function getNFTVotes(address nftAddr, uint nftId) public view returns(uint256) {
		uint today = getDate(block.timestamp);
		uint groupId = nftGroup[nfts[nftAddr][nftId]];
		uint[] memory dates = getVotableDates(groupId);
		uint uid = nfts[nftAddr][nftId];
		
		uint votes = 0;
		for(uint i = 0; i < dates.length; i++) {
			if(dates[i] <= today) {
				votes = votes.add(dayVotes[dates[i]][uid]);
			}
		}
		return votes;
	}

	function _unvote(address user, address nftAddr, uint nftId, uint votes) internal {
		uint groupId = nftGroup[nfts[nftAddr][nftId]];
		if(groups[groupId].add(VOTE_DURATION) < block.timestamp) {
			return;
		}
		uint today = getDate(block.timestamp);
		uint[] memory dates = getVotableDates(groupId);
		uint uid = nfts[nftAddr][nftId];

		for(uint i = 0; i < dates.length; i++) {
			if(dates[i] >= today) {
				uint date = dates[i];
				dayVotes[date][uid] = dayVotes[date][uid].sub(votes);
				userVotes[user][date][uid] = userVotes[user][date][uid].sub(votes);
				userDailyVotes[user][groupId][date] = userDailyVotes[user][groupId][date].sub(votes);
				userNFTVotes[user][uid] = userNFTVotes[user][uid].sub(votes);
				
				nftVotes[uid] = nftVotes[uid].sub(votes);
				groupVotes[groupId] = groupVotes[groupId].sub(votes);
			}
		}
	}

	function calcVotes(address token, uint amount) internal view returns(uint256) {
		int8 delta = int8(IERC20Metadata(token).decimals()) - int8(IERC20Metadata(uink).decimals());
		if(delta >= 0) {
			return voteRatio[token].mul(amount).div(voteRatioMax).div(10 ** uint8(delta));
		} else {
			return voteRatio[token].mul(amount).div(voteRatioMax).mul(10 ** uint8(-delta));
		}
	}

	function getAvailableBalance(address user, address token, address nftAddr, uint nftId) public view returns(uint256) {
		uint uid = nfts[nftAddr][nftId];
		Balance memory balance = balances[user][token][uid];
		uint available = balance.available;
		if(getDate(balance.votedAt) < getDate(block.timestamp)) {
			available = available.add(balance.freezed);
		}
		return available;
	}

	// stake and vote
	function stake(address nftAddr, uint nftId, address token, uint amount)
		external 
		checkVoteToken(token)
		checkVotingTime
		checkNFT(nftAddr, nftId)
		nonReentrant
	{
		require(amount > 0, "Amount is zero");
		uint votes = calcVotes(token, amount);
		_vote(msg.sender, nftAddr, nftId, votes);

		uint groupId = nftGroup[nfts[nftAddr][nftId]];

		IERC20(token).safeTransferFrom(msg.sender, address(this), amount);
		groupTokenBalances[groupId][msg.sender][token] = groupTokenBalances[groupId][msg.sender][token].add(amount);

		uint uid = nfts[nftAddr][nftId];

		Balance storage balance = balances[msg.sender][token][uid];
		if(getDate(balance.votedAt) < getDate(block.timestamp)) {
			balance.available = balance.available.add(balance.freezed);
			balance.freezed = 0;
		}
		balance.freezed = balance.freezed.add(amount);
		balance.votedAt = block.timestamp;

		userTokenBalances[msg.sender][token] = userTokenBalances[msg.sender][token].add(amount);

		emit Stake(msg.sender, nftAddr, nftId, token, amount);

	}

	function unstake(address nftAddr, uint nftId, address token, uint amount)
		external 
		checkVoteToken(token)
		checkNFT(nftAddr, nftId)
		nonReentrant
	{
		require(amount > 0, "Amount is zero");
		
		uint available = getAvailableBalance(msg.sender, token, nftAddr, nftId);
		require(available >= amount, "Insufficient balance");

		uint votes = calcVotes(token, amount);
		_unvote(msg.sender, nftAddr, nftId, votes);

		IERC20(token).safeTransfer(msg.sender, amount);

		uint groupId = nftGroup[nfts[nftAddr][nftId]];

		groupTokenBalances[groupId][msg.sender][token] = groupTokenBalances[groupId][msg.sender][token].sub(amount);

		uint uid = nfts[nftAddr][nftId];
		Balance storage balance = balances[msg.sender][token][uid];
		if(getDate(balance.votedAt) < getDate(block.timestamp)) {
			balance.available = balance.available.add(balance.freezed);
			balance.freezed = 0;
		}
		balance.available = balance.available.sub(amount);

		userTokenBalances[msg.sender][token] = userTokenBalances[msg.sender][token].sub(amount);

		emit Unstake(msg.sender, nftAddr, nftId, token, amount);
	}

	function getRedeemableBalance(address user, address token) public view returns(uint256) {
		uint total = 0;
		for(uint groupId = startGroupId; groupId <= currentGroupId; groupId++){
			if(groups[groupId] + VOTE_DURATION < block.timestamp) {
				total = total.add(groupTokenBalances[groupId][user][token]);
			}
		}
		return total;
	}

	function rescueToken(address token, uint amount) external onlyOwner {
		IERC20(token).safeTransfer(msg.sender, amount);
	}

	function getTotalRewards(address user) public view returns(uint) {
		uint rewards = 0;
		for(uint groupId = startGroupId; groupId <= currentGroupId; groupId++) {
			rewards = rewards.add(getBaseRewards(user, groupId)).add(getAuctionRewards(user, groupId));
		}
		return rewards;
	}

	function getBaseRewards(address user, uint groupId) public view returns(uint) {
		uint[] memory dates = getVotableDates(groupId);
		uint[] memory rawardRates = getBaseRewardRates(groupId);
		uint rewards = 0;
		uint today = getDate(block.timestamp);

		for(uint i = 0; i < dates.length; i++) {
			if(dates[i] >= today) {
				break;
			}
			uint dayRewards = userDailyVotes[user][groupId][dates[i]].mul(rawardRates[i]).div(1e18);
			rewards = rewards.add(dayRewards);
		}
		return rewards;
	}

	function getAuctionRewards(address user, uint groupId) public view returns(uint) {
		if(!hasFinished[groupId]) {
			return 0;
		}
		uint rewards = 0;
		uint[] memory rewardRates = getAuctionRewardRates(groupId);
		for(uint i = 0; i < groupNFTs[groupId].length; i++) {
			uint votes = userNFTVotes[user][groupNFTs[groupId][i].uid];
			rewards = votes.mul(rewardRates[i]).div(1e18).add(rewards);
		}
		return rewards;
	}

	function getBondedBalance(address user) public view returns(uint) {
		uint balance = getTotalRewards(user).add(bondedBalances[user]);
		uint freezedBalance = totalVotedBalances[user].add(unbondedBalances[user]);
		return balance > freezedBalance ? balance.sub(freezedBalance) : 0;
	}

	function getUnvotableBalance(address user, address nftAddr, uint nftId) public view returns(uint256) {
		uint uid = nfts[nftAddr][nftId];
		Balance memory balance = votedBalances[user][uid];
		uint available = balance.available;
		if(getDate(balance.votedAt) < getDate(block.timestamp)) {
			available = available.add(balance.freezed);
		}
		return available;
	}

	function collectFromLock(uint lockId) 
		external 
	{
		uint amount = ITokenLocker(tokenLocker).subLockForVote(lockId, msg.sender);
		bondedBalances[msg.sender] = bondedBalances[msg.sender].add(amount);
		userTokenBalances[msg.sender][uink] = userTokenBalances[msg.sender][uink].add(amount);
	}

	
	function voteBonded(address nftAddr, uint nftId, uint amount) 
		external 
		checkVotingTime
		checkNFT(nftAddr, nftId)
	{
		uint bondedBalance = getBondedBalance(msg.sender);
		require(bondedBalance >= amount, "Insufficient bonded balance");

		_vote(msg.sender, nftAddr, nftId, amount);

		uint uid = nfts[nftAddr][nftId];
		Balance storage votedBalance = votedBalances[msg.sender][uid];

		if(getDate(votedBalance.votedAt) < getDate(block.timestamp)) {
			votedBalance.available = votedBalance.available.add(votedBalance.freezed);
			votedBalance.freezed = 0;
		}
		votedBalance.freezed = votedBalance.freezed.add(amount);
		votedBalance.votedAt = block.timestamp;

		totalVotedBalances[msg.sender] = totalVotedBalances[msg.sender].add(amount);
		userTokenBalances[msg.sender][uink] = userTokenBalances[msg.sender][uink].add(amount);

		emit VoteBonded(msg.sender, nftAddr, nftId, amount);
	}

	function unvoteBonded(address nftAddr, uint nftId, uint amount)
		external
		checkNFT(nftAddr, nftId)
	{
		uint unvotable = getUnvotableBalance(msg.sender, nftAddr, nftId);
		require(unvotable >= amount, "Insufficient unvotable balance");
		_unvote(msg.sender, nftAddr, nftId, amount);

		uint uid = nfts[nftAddr][nftId];
		Balance storage votedBalance = votedBalances[msg.sender][uid];

		if(getDate(votedBalance.votedAt) < getDate(block.timestamp)) {
			votedBalance.available = votedBalance.available.add(votedBalance.freezed);
			votedBalance.freezed = 0;
		}
		votedBalance.available = votedBalance.available.sub(amount);

		totalVotedBalances[msg.sender] = totalVotedBalances[msg.sender].sub(amount);
		userTokenBalances[msg.sender][uink] = userTokenBalances[msg.sender][uink].sub(amount);

		emit UnvoteBonded(msg.sender, nftAddr, nftId, amount);
	}

	function getUnbondingBalancesLength(address user) public view returns(uint) {
		return unbondingBalances[user].length;
	}

	function unbond(uint amount) external {
		uint bondedBalance = getBondedBalance(msg.sender);
		require(bondedBalance >= amount, "Insufficient bonded balance");

		unbondingBalances[msg.sender].push(UnbondingBalance({
			value: amount,
			unbondedAt: block.timestamp,
			redeemed: 0
		}));
		
		unbondedBalances[msg.sender] = unbondedBalances[msg.sender].add(amount);

		emit Unbond(msg.sender, amount, block.timestamp);
	}

	function redeemUnbonding(uint index) 
		external 
	{ 
		UnbondingBalance storage unbondingBalance = unbondingBalances[msg.sender][index];
		uint passDays = getDate(block.timestamp).sub(getDate(unbondingBalance.unbondedAt)).div(VOTE_TIME_UNIT);
		if(passDays > 60) {
			passDays = 60;
		}
		uint released = passDays.mul(unbondingBalance.value).div(60);
		uint available = released.sub(unbondingBalance.redeemed);
		unbondingBalance.redeemed = released;
		uint sent = treasury.sendRewards(msg.sender, available);
		require(sent == available, "Insufficient treasury balance");

		emit RedeemUnbonding(msg.sender, index, sent);
	}

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

		emit MintRewardsClaimed(nftAddr, nftId, to);
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

	function setAuctionFinish(uint groupId) external onlyOperator {
		hasFinished[groupId] = true;
	}

	function getAuctionRewardRates(uint groupId) public view returns(uint[] memory auctionRewardRates) {
		uint[] memory weights = getTradeWeights(groupId);
		NFT[] memory gNFTs = groupNFTs[groupId];
		auctionRewardRates = new uint[](gNFTs.length);
		(, uint[] memory inflations) = getWeightsAndInflations(groupId);
		uint bonus = bonusCap.mul(inflations[inflations.length - 1]).div(1e18);

		for(uint i = 0; i < gNFTs.length; i++) {
			if(nftVotes[gNFTs[i].uid] == 0) {
				auctionRewardRates[i] = 0;
			} else {
				auctionRewardRates[i] = bonus.mul(weights[i]).div(nftVotes[gNFTs[i].uid]);
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
				break;
			}
			uint dailyTotalVotes = getDailyVotes(groupId, dates[i]);
			if(dailyTotalVotes > 0) {
				rewardRates[i] = inflations[i].mul(dailyVoteRewardCap).div(dailyTotalVotes);
			}
		}
	}

	function getMintRewardsPerNFT(uint groupId)
		public view 
		returns(uint[] memory mintRewards) 
	{
		mintRewards = new uint[](groupNFTs[groupId].length);
		(,uint[] memory inflations) = getWeightsAndInflations(groupId);
		uint totalMintRewards = mintRewardCap.mul(inflations[inflations.length - 1]).div(1e18);

		for(uint i = 0; i < groupNFTs[groupId].length; i++) {
			if(groupVotes[groupId] > 0) {
				mintRewards[i] = nftVotes[groupNFTs[groupId][i].uid].mul(totalMintRewards).div(groupVotes[groupId]);
			}
		}
	}

	function getMintRewards(address nftAddr, uint nftId) public view returns(uint) {
		uint groupId = nftGroup[nfts[nftAddr][nftId]];
		(,uint[] memory inflations) = getWeightsAndInflations(groupId);
		uint totalMintRewards = mintRewardCap.mul(inflations[inflations.length - 1]).div(1e18);
		if(groupVotes[groupId] > 0) {
			return nftVotes[nfts[nftAddr][nftId]].mul(totalMintRewards).div(groupVotes[groupId]);
		} else {
			return 0;
		}
	}

	function migrate() external {
		require(!migrated[msg.sender], "Already migrated");
		uint amount = IVoteMiningV1(v1).getBondedBalance(msg.sender);
		for(uint i = 0; i < IVoteMiningV1(v1).groupNFTsLength(1); i++) {
			(,address nftAddr,uint nftId,) = IVoteMiningV1(v1).groupNFTs(1, i);
			uint unvotable = IVoteMiningV1(v1).getUnvotableBalance(msg.sender, nftAddr, nftId);
			if(unvotable > 0) {
				amount = amount.add(unvotable);
			}
		}

		bondedBalances[msg.sender] = bondedBalances[msg.sender].add(amount);
		userTokenBalances[msg.sender][uink] = userTokenBalances[msg.sender][uink].add(amount);
		
		// uint val = treasury.sendRewards(address(this), amount);
		// require(val == amount, "Treasury has insufficient balance");

		emit MigrateBonded(msg.sender, amount);

		uint size = IVoteMiningV1(v1).getUnbondingBalancesLength(msg.sender);
		for(uint i = 0; i < size; i++) {
			(uint value, uint unbondedAt, uint redeemed) = IVoteMiningV1(v1).unbondingBalances(msg.sender, i);
			unbondingBalances[msg.sender].push(UnbondingBalance({
				value: value,
				unbondedAt: unbondedAt,
				redeemed: redeemed
			}));
			emit MigrateUnbonding(msg.sender, i, value, unbondedAt, redeemed);
		}

		migrated[msg.sender] = true;
	}
}