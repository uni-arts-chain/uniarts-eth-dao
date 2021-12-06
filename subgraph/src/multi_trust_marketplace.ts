import { BigInt } from "@graphprotocol/graph-ts"
import {
  MultiTokenTrustMarketplace,
  BidAccepted,
  BidCancelled,
  BidCreated,
  ChangedFeePerMillion,
  OrderCancelled,
  OrderCreated,
  OrderSuccessful,
  OrderUpdated,
  OwnershipTransferred,
  Paused,
  SetNewPayToken,
  Unpaused
} from "../generated/MultiTokenTrustMarketplace/MultiTokenTrustMarketplace"
import { TrustMarketplaceOrder, TrustMarketplaceBid } from "../generated/schema"

export function handleBidAccepted(event: BidAccepted): void {
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
  // - contract._INTERFACE_ID_ERC1155(...)
  // - contract.bidByOrderId(...)
  // - contract.cutPerMillion(...)
  // - contract.maxCutPerMillion(...)
  // - contract.onERC1155BatchReceived(...)
  // - contract.onERC1155Received(...)
  // - contract.orderByOrderId(...)
  // - contract.owner(...)
  // - contract.paused(...)
  // - contract.payTokens(...)
  // - contract.supportsInterface(...)
  // - contract.getOrderSize(...)
  // - contract.getOrderId(...)
}

export function handleBidCancelled(event: BidCancelled): void {}

export function handleBidCreated(event: BidCreated): void {
  let id = event.params.id.toHex()
  let tx_hash = event.transaction.hash.toHex()
  let block_number = event.block.number

  // Entities only exist after they have been saved to the store;
  // `null` checks allow to create entities on demand
  let entity = new TrustMarketplaceBid(id)
  entity.bidder = event.params.bidder
  entity.nft_address = event.params.nftAddress
  entity.token_id = event.params.assetId
  entity.token_amount = event.params.assetAmount
  entity.pay_token_address = event.params.payTokenAddress
  entity.price_in_wei = event.params.priceInWei
  entity.expires_at = event.params.expiresAt
  entity.tx_hash = tx_hash
  entity.block_number = block_number
  entity.save()
}

export function handleChangedFeePerMillion(event: ChangedFeePerMillion): void {}

export function handleOrderCancelled(event: OrderCancelled): void {
  let id = event.params.id.toHex()
  let block_number = event.block.number

  // Entities only exist after they have been saved to the store;
  // `null` checks allow to create entities on demand
  let entity = TrustMarketplaceOrder.load(id)
  entity.cancel_block_number = block_number
  entity.save()
}

export function handleOrderCreated(event: OrderCreated): void {
  let id = event.params.id.toHex()
  let tx_hash = event.transaction.hash.toHex()
  let block_number = event.block.number

  // Entities only exist after they have been saved to the store;
  // `null` checks allow to create entities on demand
  let entity = new TrustMarketplaceOrder(id)
  entity.seller = event.params.seller
  entity.nft_address = event.params.nftAddress
  entity.token_id = event.params.assetId
  entity.token_amount = event.params.assetAmount
  entity.pay_token_address = event.params.payTokenAddress
  entity.price_in_wei = event.params.priceInWei
  entity.expires_at = event.params.expiresAt
  entity.is_succ = BigInt.fromI32(0)
  entity.create_block_number = block_number
  entity.succ_block_number = BigInt.fromI32(0)
  entity.cancel_block_number = BigInt.fromI32(0)
  entity.tx_hash = tx_hash
  entity.save()
}

export function handleOrderSuccessful(event: OrderSuccessful): void {
  let id = event.params.id.toHex()
  let buyer = event.params.buyer
  let block_number = event.block.number

  // Entities only exist after they have been saved to the store;
  // `null` checks allow to create entities on demand
  let entity = TrustMarketplaceOrder.load(id)
  entity.is_succ = BigInt.fromI32(1)
  entity.succ_block_number = block_number
  entity.buyer = buyer
  entity.save()
}

export function handleOrderUpdated(event: OrderUpdated): void {}

export function handleOwnershipTransferred(event: OwnershipTransferred): void {}

export function handlePaused(event: Paused): void {}

export function handleSetNewPayToken(event: SetNewPayToken): void {}

export function handleUnpaused(event: Unpaused): void {}
