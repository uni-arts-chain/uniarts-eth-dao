const { accounts, contract } = require('@openzeppelin/test-environment');
const { expect } = require('chai');
const { toBN } = require('web3-utils');
const { BN, expectEvent, expectRevert, time, constants, balance } = require('@openzeppelin/test-helpers');

const [ admin, user1, user2, deployer, voter1, voter2 ] = accounts;

const VoteMining = contract.fromArtifact('VoteMining');
const UINK = contract.fromArtifact('UINK');
const USDT = contract.fromArtifact('USDT');
const UinkTreasury = contract.fromArtifact('UinkTreasury');
const TokenLocker = contract.fromArtifact('TokenLocker');
const MockNFT = contract.fromArtifact('MockNFT');
const Auction = contract.fromArtifact('Auction');

describe('VoteMining', () => {
	beforeEach(async () => {
		this.Uink = await UINK.new({ from: deployer })
    this.USDT = await USDT.new({ from: deployer })
		this.Treasury = await UinkTreasury.new(this.Uink.address)
    await this.Uink.transfer(this.Treasury.address, toBN(400000 * 1e12), { from: deployer })

		this.TokenLocker = await TokenLocker.new()
    this.VoteMining = await VoteMining.new(this.Treasury.address, this.TokenLocker.address, { from: admin });
    this.MockNFT = await MockNFT.new();
    await this.Treasury.addOperator(this.VoteMining.address)

    this.Auction = await Auction.new(this.USDT.address)

    await this.VoteMining.setAuctionAddress(this.Auction.address, { from: admin })

    const now = parseInt(new Date().getTime() / 1000)
    this.today = now - now % (24 * 3600)
  });


  const addGroup = async() => {
  	let now = await time.latest()
    now = now.toNumber()
  	const date = now - now % (24 * 3600)
  	const matchId = "1"
  	await this.VoteMining.addGroup(toBN(50000 * 1e12), date, matchId, { from: admin })
  	const groupId = await this.VoteMining.currentGroupId()
  	return groupId
  }

  const addGroupAndNFTs = async() => {
  	const groupId = await addGroup()
  	await this.MockNFT.mint(deployer, 1)
  	await this.MockNFT.mint(deployer, 2)
  	const nftAddrs = [ this.MockNFT.address, this.MockNFT.address ]
  	const nftIds = [ 1, 2 ]
  	await this.VoteMining.addNFT(groupId, nftAddrs, nftIds, { from: admin })

    const matchId = "1"
    let openBlock = await time.latestBlock()
    openBlock = openBlock.add(toBN(10))
    const expiryBlock = openBlock.add(toBN(1000))
    const nfts = [
      [
        this.MockNFT.address,
        1,
        toBN(10 * 1e18),
        toBN(100 * 1e18)
      ],
      [
        this.MockNFT.address,
        2,
        toBN(20 * 1e18),
        toBN(200 * 1e18)
      ]
    ]
    await this.MockNFT.approve(this.Auction.address, 1, { from: deployer })
    await this.MockNFT.approve(this.Auction.address, 2, { from: deployer })
    await this.Auction.createAuction(matchId, openBlock, expiryBlock, 10, 1, nfts, { from: deployer })

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

    const now = parseInt(new Date().getTime() / 1000)
    const date = now - now % (24 * 3600)
    const matchId = "1"

    await expectRevert(
      this.VoteMining.addGroup(toBN(50000 * 1e12), date, matchId, { from: admin }),
      "Previous group is not over."
    );
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


  it("stake/unstake/voteBonded/unvoteBonded/unbond/redeemUnbonding", async() => {
  	const groupId = await addGroupAndNFTs()
  	await this.Uink.approve(this.VoteMining.address, constants.MAX_UINT256, { from: deployer })
  	const amount = toBN(100 * 1e12)
  	await this.VoteMining.stake(this.MockNFT.address, 1, this.Uink.address, amount, { from: deployer })

  	const bal = await this.VoteMining.getAvailableBalance(deployer, this.Uink.address, this.MockNFT.address, 1)
  	expect(bal.toNumber()).to.eq(0)

  	const uid = await this.VoteMining.nfts(this.MockNFT.address, 1)

  	const dayVotes = await this.VoteMining.dayVotes(this.today, uid)
  	expect(dayVotes.toString()).to.eq(amount.toString())

  	const userVotes = await this.VoteMining.userVotes(deployer, this.today, uid)
  	expect(userVotes.toString()).to.eq(amount.toString())

  	const userNFTVotes = await this.VoteMining.userNFTVotes(deployer, uid)
  	expect(userNFTVotes.toString()).to.eq(amount.mul(toBN(14)).toString())

  	await time.increase(1 * 24 * 3600 + 1)
  	const bal2 = await this.VoteMining.getAvailableBalance(deployer, this.Uink.address, this.MockNFT.address, 1)
  	expect(bal2.toString()).to.eq(amount.toString())


    await this.VoteMining.unstake(this.MockNFT.address, 1, this.Uink.address, toBN(20 * 1e12), {  from: deployer })
    const bal3 = await this.VoteMining.getAvailableBalance(deployer, this.Uink.address, this.MockNFT.address, 1)
    expect(bal3.toString()).to.eq(toBN(80 * 1e12).toString())



    const bondedBalance = await this.VoteMining.getBondedBalance(deployer)
    expect(bondedBalance.toString()).to.eq('1428571428571428')

    await this.VoteMining.voteBonded(this.MockNFT.address, 2, toBN('1428571428571428'), { from: deployer })
    const bondedBalance2 = await this.VoteMining.getBondedBalance(deployer)
    expect(bondedBalance2.toString()).to.eq('0')

    let unvotableBalance1 = await this.VoteMining.getUnvotableBalance(deployer, this.MockNFT.address, 2)
    expect(unvotableBalance1.toString()).to.eq('0')

    await time.increase(1 * 24 * 3600 + 1)
    const bondedBalance3 = await this.VoteMining.getBondedBalance(deployer)
    expect(bondedBalance3.toString()).to.eq('1428571428571428')

    let unvotableBalance = await this.VoteMining.getUnvotableBalance(deployer, this.MockNFT.address, 2)
    expect(unvotableBalance.toString()).to.eq('1428571428571428')


    await this.VoteMining.unvoteBonded(this.MockNFT.address, 2, toBN('1428571428571428'), { from: deployer })
    let unvotableBalance3 = await this.VoteMining.getUnvotableBalance(deployer, this.MockNFT.address, 2)
    expect(unvotableBalance3.toString()).to.eq('0')

    let bondedTokens = await this.VoteMining.getBondedBalance(deployer)
    expect(bondedTokens.toString()).to.eq(toBN(1428571428571428 * 2).toString())


    let noRedeems = await this.VoteMining.getRedeemableBalance(deployer, this.Uink.address)
    expect(noRedeems.toString()).to.eq('0')

    await time.increase(12 * 24 * 3600 + 1)
    let redeems = await this.VoteMining.getRedeemableBalance(deployer, this.Uink.address)
    expect(redeems.toString()).to.eq(toBN(80 * 1e12).toString())

    let balanceBefore = await this.Uink.balanceOf(deployer)
    await this.VoteMining.redeemToken(this.Uink.address, { from: deployer })
    let balanceAfter = await this.Uink.balanceOf(deployer)
    expect(balanceAfter.sub(balanceBefore).toString()).to.eq(toBN(80 * 1e12).toString())

    const uid2 = await this.VoteMining.nfts(this.MockNFT.address, 2)

    let rewardRates = await this.VoteMining.getMintRewardsPerNFT(groupId)
    expect(rewardRates.map(a=>a.toString())).to.have.members(['44382647385984437', '55617352614015562'])


    const bondedBal = await this.VoteMining.getBondedBalance(deployer)
    expect(bondedBal.toString()).to.eq('19999999999999992')
    await this.VoteMining.unbond(bondedBal, {  from: deployer })
    const bondedBalAfter = await this.VoteMining.getBondedBalance(deployer)
    expect(bondedBalAfter.toString()).to.eq('0')

    const redeemBeforeBal = await this.Uink.balanceOf(deployer)
    await time.increase(1 * 24 * 3600 + 1)
    await this.VoteMining.redeemUnbonding(0, { from: deployer })
    const redeemAfterBal = await this.Uink.balanceOf(deployer)

    expect(redeemAfterBal.sub(redeemBeforeBal).toString()).to.eq('333333333333333')


    const redeemBeforeBal2 = await this.Uink.balanceOf(deployer)
    await time.increase(59 * 24 * 3600 + 1)
    await this.VoteMining.redeemUnbonding(0, {  from: deployer })
    const redeemAfterBal2 = await this.Uink.balanceOf(deployer)
    expect(redeemAfterBal2.sub(redeemBeforeBal2).toString()).to.eq('19666666666666659')

  })

  it("getAuctionRewardRates/getAuctionRewards", async() => {
    const groupId = await addGroupAndNFTs()

    const amount1 = toBN(200 * 1e12)
    const amount2 = toBN(100 * 1e12)

    await this.Uink.transfer(voter1, amount1, { from: deployer })
    await this.Uink.transfer(voter2, amount2, { from: deployer })
    await this.Uink.approve(this.VoteMining.address, constants.MAX_UINT256, { from: voter1 })
    await this.Uink.approve(this.VoteMining.address, constants.MAX_UINT256, { from: voter2 })
    await this.VoteMining.stake(this.MockNFT.address, 1, this.Uink.address, amount1, { from: voter1 })
    await this.VoteMining.stake(this.MockNFT.address, 2, this.Uink.address, amount2, { from: voter2 })

    await time.increase(14 * 24 * 3600 + 1)

    // const result = await this.VoteMining.getWeightsAndInflations(groupId)
    // console.log(result.inflations.map(a=>a.toString()))

    const price1 = toBN(15 * 1e18)
    const price2 = toBN(25 * 1e18)
    await this.USDT.transfer(user1, price1, { from: deployer })
    await this.USDT.transfer(user2, price2, { from: deployer })
    await this.USDT.approve(this.Auction.address, constants.MAX_UINT256, { from: user1 })
    await this.USDT.approve(this.Auction.address, constants.MAX_UINT256, { from: user2 })

    let openBlock = await time.latestBlock()
    openBlock = openBlock.add(toBN(10))
    await time.advanceBlockTo(openBlock)

    await this.Auction.player_bid("1", 0, price1, { from: user1 })
    await this.Auction.player_bid("1", 1, price2, { from: user2 })

    const rates = await this.VoteMining.getAuctionRewardRates(groupId)
    expect(rates.map(a=>a.toString())).to.have.members([
      '5357142857142857142',
      '17857142857142857142'
    ])

    await this.VoteMining.setAuctionFinish(groupId, { from: admin })
    const rewards1 = await this.VoteMining.getAuctionRewards(voter1, groupId)
    const rewards2 = await this.VoteMining.getAuctionRewards(voter2, groupId)

    expect(rewards1.toString()).to.eq('14999999999999999')
    expect(rewards2.toString()).to.eq('24999999999999999')
  })

  
})