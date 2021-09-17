const { accounts, contract } = require('@openzeppelin/test-environment');
const { expect } = require('chai');
const { toBN } = require('web3-utils');
const { BN, expectEvent, expectRevert, time, constants, balance } = require('@openzeppelin/test-helpers');

const [ admin, user1, user2, deployer ] = accounts;

const VoteMining = contract.fromArtifact('VoteMining');
const UINK = contract.fromArtifact('UINK');
const UinkTreasury = contract.fromArtifact('UinkTreasury');
const TokenLocker = contract.fromArtifact('TokenLocker');
const MockNFT = contract.fromArtifact('MockNFT');

describe('VoteMining', () => {
	beforeEach(async () => {
		this.Uink = await UINK.new({ from: deployer })
		this.Treasury = await UinkTreasury.new(this.Uink.address)
		this.TokenLocker = await TokenLocker.new()
    this.VoteMining = await VoteMining.new(this.Treasury.address, this.TokenLocker.address, { from: admin });
    this.MockNFT = await MockNFT.new();
    const now = parseInt(new Date().getTime() / 1000)
    this.today = now - now % (24 * 3600)
  });

  const addGroup = async() => {
  	const now = parseInt(new Date().getTime() / 1000)
  	const date = now - now % (24 * 3600)
  	const matchId = "1"
  	await this.VoteMining.addGroup(toBN(50000 * 1e12), date, matchId, { from: admin })
  	const groupId = await this.VoteMining.currentGroupId()
  	return groupId
  }

  const addGroupAndNFTs = async() => {
  	const groupId = await addGroup()
  	await this.MockNFT.mint(user1, 1)
  	await this.MockNFT.mint(user2, 2)
  	const nftAddrs = [ this.MockNFT.address, this.MockNFT.address ]
  	const nftIds = [ 1, 2 ]
  	await this.VoteMining.addNFT(groupId, nftAddrs, nftIds, { from: admin })
  	return groupId
  }

  it('constructor', async() => {
  	expect(true).to.be.true
  })

  it("voteTokens", async() => {
  	const voteToken = await this.VoteMining.voteTokens(0)
  	expect(voteToken).to.eq(this.Uink.address)
  })

  it("addGroup", async() => {
  	await addGroup()
  	const groupId = await this.VoteMining.currentGroupId()
  	expect(groupId.toNumber()).to.eq(1)
  	const startTime = await this.VoteMining.groups(groupId)
  	expect(startTime.toNumber()).to.eq(this.today)
  })

  it("addNFT", async() => {
  	const groupId = await addGroupAndNFTs()
  	const nft1 = await this.VoteMining.groupNFTs(groupId, 0)
  	expect(nft1.addr).to.eq(this.MockNFT.address)
  	expect(nft1.id.toNumber()).to.eq(1)

  	const nft2 = await this.VoteMining.groupNFTs(groupId, 1)
  	expect(nft2.addr).to.eq(this.MockNFT.address)
  	expect(nft2.id.toNumber()).to.eq(2)
  })


  it("stake", async() => {
  	const groupId = await addGroupAndNFTs()
  	await this.Uink.approve(this.VoteMining.address, constants.MAX_UINT256, { from: deployer })
  	const amount = toBN(100 * 1e12)
  	await this.VoteMining.stake(this.MockNFT.address, 1, this.Uink.address, amount, { from: deployer })

  	const bal = await this.VoteMining.getAvailableBalance(deployer, this.Uink.address, this.MockNFT.address, 1)
  	expect(bal.toNumber()).to.eq(0)

  	const uid = await this.VoteMining.nfts(this.MockNFT.address, 1)


  	// dayVotes[date][uid]
		// userVotes[user][date][uid]
		// userDailyVotes[user][currentGroupId][date]
		// userNFTVotes[user][uid]

  	const dayVotes = await this.VoteMining.dayVotes(this.today, uid)
  	expect(dayVotes.toString()).to.eq(amount.toString())

  	const userVotes = await this.VoteMining.userVotes(deployer, this.today, uid)
  	expect(userVotes.toString()).to.eq(amount.toString())

  	const userNFTVotes = await this.VoteMining.userNFTVotes(deployer, uid)
  	expect(userNFTVotes.toString()).to.eq(amount.mul(toBN(7)).toString())

  	await time.increase(24 * 3600 + 1)
  	const bal2 = await this.VoteMining.getAvailableBalance(deployer, this.Uink.address, this.MockNFT.address, 1)
  	expect(bal2.toString()).to.eq(amount.toString())

  })
})