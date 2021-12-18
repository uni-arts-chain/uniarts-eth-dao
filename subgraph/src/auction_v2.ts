import { BigInt } from "@graphprotocol/graph-ts"
import {
  Auction,
  CreateAuctionEvent,
  PlayerBidEvent,
  RewardEvent,
  ProcessWithdrawNft
} from "../generated/AuctionV2/AuctionV2"
import { AuctionList, AuctionBidList, AuctionRewardList } from "../generated/schema"

export function handleCreateAuctionEvent(event: CreateAuctionEvent): void {
  let matchId = event.params.matchId
  let tokenIndex = event.params.tokenIndex
  let contractAddress = event.transaction.to.toHex()
  let id = contractAddress + '_' + matchId.toString() + '_' + tokenIndex.toString()

  // Entities only exist after they have been saved to the store;
  // `null` checks allow to create entities on demand
  let entity = new AuctionList(id)

  entity.count = BigInt.fromI32(1)
  entity.contractAddress = event.transaction.to.toHex()
  entity.creatorAddress = event.params.creatorAddress
  entity.matchId = event.params.matchId
  entity.openBlock = event.params.openBlock
  entity.expiryBlock = event.params.expiryBlock
  entity.cancel_block_number = BigInt.fromI32(0)
  entity.increment = event.params.increment
  entity.expiryExtension = event.params.expiryExtension
  entity.tokenIndex = event.params.tokenIndex
  entity.nft_contract_address = event.params.nfts.contractAddress
  entity.nft_token_id = event.params.nfts.tokenId
  entity.nft_min_bid = event.params.nfts.minBid
  entity.nft_fixed_price = event.params.nfts.fixedPrice
  entity.save()
}

export function handlePlayerBidEvent(event: PlayerBidEvent): void {
  let matchId = event.params.matchId
  let tokenIndex = event.params.tokenIndex
  let contractAddress = event.transaction.to.toHex()
  let id = contractAddress + '_' + matchId.toString() + '_' + tokenIndex.toString()

  // Entities only exist after they have been saved to the store;
  // `null` checks allow to create entities on demand
  let entity = new AuctionBidList(id)

  entity.contractAddress = event.transaction.to.toHex()
  entity.matchId = event.params.matchId
  entity.playerAddress = event.params.playerAddress
  entity.tokenIndex = event.params.tokenIndex
  entity.bid = event.params.bid
  entity.expiryBlock = event.params.expiryBlock
  entity.save()
}

export function handleRewardEvent(event: RewardEvent): void {
  let matchId = event.params.matchId
  let tokenIndex = event.params.tokenIndex
  let contractAddress = event.transaction.to.toHex()
  let id = contractAddress + '_' + matchId.toString() + '_' + tokenIndex.toString()

  // Entities only exist after they have been saved to the store;
  // `null` checks allow to create entities on demand
  let entity = new AuctionRewardList(id)

  entity.contractAddress = event.transaction.to.toHex()
  entity.matchId = event.params.matchId
  entity.tokenIndex = event.params.tokenIndex
  entity.winnerAddress = event.params.winnerAddress
  entity.save()
}

export function handleProcessWithdrawNft(event: ProcessWithdrawNft): void {
  let matchId = event.params.matchId
  let tokenIndex = event.params.tokenIndex
  let contractAddress = event.transaction.to.toHex()
  let id = contractAddress + '_' + matchId.toString() + '_' + tokenIndex.toString()
  let block_number = event.block.number
  let entity = AuctionList.load(id)
  if (entity !== null) {
    entity.cancel_block_number = block_number
    entity.save()
  }
}
