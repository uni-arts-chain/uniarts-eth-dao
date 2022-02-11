import { BigInt } from "@graphprotocol/graph-ts"
import { MerkleMint, Claimed } from "../generated/MerkleMint/MerkleMint"
import { TokenMint } from "../generated/schema"

export function handleClaimed(event: Claimed): void {
  let index = event.params.index
  let user_address = event.params.account
  let amount = event.params.amount
  let id = event.transaction.hash.toHex() 
  let entity = new TokenMint(index.toString())

  entity.user_address = user_address
  entity.amount = amount
  entity.save()
}
