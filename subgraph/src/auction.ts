import { BigInt } from "@graphprotocol/graph-ts"
import {
  Auction,
  CreateAuctionEvent,
  PlayerBidEvent,
  RewardEvent
} from "../generated/Auction/Auction"


export function handleCreateAuctionEvent(event: CreateAuctionEvent): void {
  
}

export function handlePlayerBidEvent(event: PlayerBidEvent): void {}

export function handleRewardEvent(event: RewardEvent): void {}
