import { BigInt } from "@graphprotocol/graph-ts"
import {
  TrustMarketplace,
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
  Unpaused
} from "../generated/TrustMarketplace/TrustMarketplace"
import { TrustMarketplaceOrder, TrustMarketplaceBid } from "../generated/schema"

export function handleBidAccepted(event: BidAccepted): void {
  // It is also possible to access smart contracts from mappings. For
  // example, the contract that has emitted the event can be connected to
  // with:
  //
  // let contract = Contract.bind(event.address)
  //
  // The following functions can then be called on this contract to access
  // state variables and other data:
  //
  // - contract._INTERFACE_ID_ERC721(...)
  // - contract.acceptedToken(...)
  // - contract.bidByOrderId(...)
  // - contract.cutPerMillion(...)
  // - contract.maxCutPerMillion(...)
  // - contract.onERC721Received(...)
  // - contract.orderByAssetId(...)
  // - contract.owner(...)
  // - contract.paused(...)
}

export function handleBidCancelled(event: BidCancelled): void {}

export function handleBidCreated(event: BidCreated): void {
  let id = event.params.id.toHex()

  // Entities only exist after they have been saved to the store;
  // `null` checks allow to create entities on demand
  let entity = new TrustMarketplaceBid(id)
  entity.bidder = event.params.bidder
  entity.nft_address = event.params.nftAddress
  entity.token_id = event.params.assetId
  entity.price_in_wei = event.params.priceInWei
  entity.expires_at = event.params.expiresAt
  entity.save()
}

export function handleChangedFeePerMillion(event: ChangedFeePerMillion): void {}

export function handleOrderCancelled(event: OrderCancelled): void {}

export function handleOrderCreated(event: OrderCreated): void {
  let id = event.params.id.toHex()

  // Entities only exist after they have been saved to the store;
  // `null` checks allow to create entities on demand
  let entity = new TrustMarketplaceOrder(id)
  entity.seller = event.params.seller
  entity.nft_address = event.params.nftAddress
  entity.token_id = event.params.assetId
  entity.price_in_wei = event.params.priceInWei
  entity.expires_at = event.params.expiresAt
  entity.is_succ = BigInt.fromI32(0)
  entity.save()
}

export function handleOrderSuccessful(event: OrderSuccessful): void {}

export function handleOrderUpdated(event: OrderUpdated): void {}

export function handleOwnershipTransferred(event: OwnershipTransferred): void {}

export function handlePaused(event: Paused): void {}

export function handleUnpaused(event: Unpaused): void {}
