import { BigInt } from "@graphprotocol/graph-ts"
import {
  Auction,
  CreateAuctionEvent,
  PlayerBidEvent,
  RewardEvent
} from "../generated/Auction/Auction"
import { AuctionList } from "../generated/schema"

export function handleCreateAuctionEvent(event: CreateAuctionEvent): void {
  let tokenId = event.params.nfts.tokenId
  let contractAddress = entity.nft_contract_address = event.params.nfts.contractAddress
  let id = event.transaction.hash.toHex() + '_' + contractAddress.toString() + '_' + tokenId.toString()

  // Entities only exist after they have been saved to the store;
  // `null` checks allow to create entities on demand
  let entity = new AuctionList(id)

  entity.count = BigInt.fromI32(1)
  entity.creatorAddress = event.params.creatorAddress
  entity.matchId = event.params.matchId
  entity.openBlock = event.params.openBlock
  entity.expiryBlock = event.params.expiryBlock
  entity.increment = event.params.increment
  entity.expiryExtension = event.params.expiryExtension
  entity.nft_contract_address = event.params.nfts.contractAddress
  entity.nft_token_id = event.params.nfts.tokenId
  entity.nft_min_bid = event.params.nfts.minBid
  entity.nft_fixed_price = event.params.nfts.fixedPrice
  entity.save()

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
  // - contract.USDT_ADDRESS(...)
  // - contract.matchNFTs(...)
  // - contract.matchResults(...)
  // - contract.matches(...)
  // - contract.onERC721Received(...)
  // - contract.get_match(...)
  // - contract.get_current_result(...)
  // - contract.get_player_bid(...)
  // - contract.get_creator_balance(...)
}

export function handlePlayerBidEvent(event: PlayerBidEvent): void {}

export function handleRewardEvent(event: RewardEvent): void {}
