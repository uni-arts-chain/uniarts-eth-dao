import { BigInt } from "@graphprotocol/graph-ts"
import {
  MultiTokenAuction,
  ChangedFeePerMillion,
  CreateAuctionEvent,
  CreatorWithdrawProfit,
  OwnershipTransferred,
  PlayerBidEvent,
  PlayerWithdrawBid,
  ProcessWithdrawNft,
  RewardEvent,
  SetNewPayToken
} from "../generated/MultiTokenAuction/MultiTokenAuction"
import { AuctionList, AuctionBidList, AuctionRewardList } from "../generated/schema"

export function handleChangedFeePerMillion(event: ChangedFeePerMillion): void {
  // Note: If a handler doesn't require existing field values, it is faster
  // _not_ to load the entity from the store. Instead, create it fresh with
  // `new Entity(...)`, set the fields that should be updated and save the
  // entity back to the store. Fields that were not set or unset remain
  // unchanged, allowing for partial updates to be applied.

  // It is also possible to access smart contracts from mappings. For
  // example, the contract that has emitted the event can be connected to
  // with:
  //
  // let contract = Contract.bind(event.address)
  //
  // The following functions can then be called on this contract to access
  // state variables and other data:
  //
  // - contract.cutPerMillion(...)
  // - contract.matchNFTs(...)
  // - contract.matchResults(...)
  // - contract.matches(...)
  // - contract.maxCutPerMillion(...)
  // - contract.owner(...)
  // - contract.payTokens(...)
  // - contract.supportsInterface(...)
  // - contract.onERC1155Received(...)
  // - contract.onERC1155BatchReceived(...)
  // - contract.get_match(...)
  // - contract.get_pay_token(...)
  // - contract.get_current_result(...)
  // - contract.get_player_bid(...)
  // - contract.get_creator_balance(...)
}

export function handleCreateAuctionEvent(event: CreateAuctionEvent): void {
  let tokenIndex = event.params.tokenIndex
  let id = event.transaction.hash.toHex() + '_' + tokenIndex.toString()

  // Entities only exist after they have been saved to the store;
  // `null` checks allow to create entities on demand
  let entity = new AuctionList(id)

  entity.count = BigInt.fromI32(1)
  entity.contractAddress = event.transaction.to.toHex()
  entity.creatorAddress = event.params.creatorAddress
  entity.matchId = event.params.matchId
  entity.openBlock = event.params.openBlock
  entity.expiryBlock = event.params.expiryBlock
  entity.increment = event.params.increment
  entity.expiryExtension = event.params.expiryExtension
  entity.tokenIndex = event.params.tokenIndex
  entity.pay_token_address = event.params.payTokenAddress
  entity.nft_contract_address = event.params.nfts.contractAddress
  entity.nft_token_id = event.params.nfts.tokenId
  entity.nft_token_amount = event.params.nfts.amount
  entity.nft_min_bid = event.params.nfts.minBid
  entity.nft_fixed_price = event.params.nfts.fixedPrice
  entity.save()
}

export function handleCreatorWithdrawProfit(
  event: CreatorWithdrawProfit
): void {}

export function handleOwnershipTransferred(event: OwnershipTransferred): void {}

export function handlePlayerBidEvent(event: PlayerBidEvent): void {
  let matchId = event.params.matchId
  let tokenIndex = event.params.tokenIndex 
  let id = event.transaction.hash.toHex() + '_' + matchId.toString() + '_' + tokenIndex.toString()

  // Entities only exist after they have been saved to the store;
  // `null` checks allow to create entities on demand
  let entity = new AuctionBidList(id)

  entity.contractAddress = event.transaction.to.toHex()
  entity.matchId = event.params.matchId
  entity.playerAddress = event.params.playerAddress
  entity.pay_token_address = event.params.payTokenAddress
  entity.tokenIndex = event.params.tokenIndex
  entity.bid = event.params.bid
  entity.expiryBlock = event.params.expiryBlock
  entity.save()
}

export function handlePlayerWithdrawBid(event: PlayerWithdrawBid): void {}

export function handleProcessWithdrawNft(event: ProcessWithdrawNft): void {}

export function handleRewardEvent(event: RewardEvent): void {
  let matchId = event.params.matchId
  let tokenIndex = event.params.tokenIndex 
  let id = event.transaction.hash.toHex() + '_' + matchId.toString() + '_' + tokenIndex.toString()

  // Entities only exist after they have been saved to the store;
  // `null` checks allow to create entities on demand
  let entity = new AuctionRewardList(id)

  entity.contractAddress = event.transaction.to.toHex()
  entity.matchId = event.params.matchId
  entity.tokenIndex = event.params.tokenIndex
  entity.winnerAddress = event.params.winnerAddress
  entity.save()
}

export function handleSetNewPayToken(event: SetNewPayToken): void {}
