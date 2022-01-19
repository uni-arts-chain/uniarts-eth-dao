import { BigInt } from "@graphprotocol/graph-ts"
import { Pin, OwnershipTransferred, Pinned } from "../generated/Pin/Pin"
import { TokenPin } from "../generated/schema"

export function handleOwnershipTransferred(event: OwnershipTransferred): void {
}

export function handlePinned(event: Pinned): void {
  let user_address = event.params.user
  let nft_address = event.params.nftAddress
  let token_id = event.params.nftId
  let id = event.transaction.hash.toHex() 
  let entity = new TokenPin(id)

  entity.user_address = user_address
  entity.nft_address = nft_address
  entity.token_id = token_id
  entity.block_number = event.block.number
  entity.save()
}
