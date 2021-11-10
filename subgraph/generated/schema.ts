// THIS IS AN AUTOGENERATED FILE. DO NOT EDIT THIS FILE DIRECTLY.

import {
  TypedMap,
  Entity,
  Value,
  ValueKind,
  store,
  Address,
  Bytes,
  BigInt,
  BigDecimal
} from "@graphprotocol/graph-ts";

export class ExampleEntity extends Entity {
  constructor(id: string) {
    super();
    this.set("id", Value.fromString(id));
  }

  save(): void {
    let id = this.get("id");
    assert(id !== null, "Cannot save ExampleEntity entity without an ID");
    assert(
      id.kind == ValueKind.STRING,
      "Cannot save ExampleEntity entity with non-string ID. " +
        'Considering using .toHex() to convert the "id" to a string.'
    );
    store.set("ExampleEntity", id.toString(), this);
  }

  static load(id: string): ExampleEntity | null {
    return store.get("ExampleEntity", id) as ExampleEntity | null;
  }

  get id(): string {
    let value = this.get("id");
    return value.toString();
  }

  set id(value: string) {
    this.set("id", Value.fromString(value));
  }

  get count(): BigInt {
    let value = this.get("count");
    return value.toBigInt();
  }

  set count(value: BigInt) {
    this.set("count", Value.fromBigInt(value));
  }

  get owner(): Bytes {
    let value = this.get("owner");
    return value.toBytes();
  }

  set owner(value: Bytes) {
    this.set("owner", Value.fromBytes(value));
  }

  get approved(): Bytes {
    let value = this.get("approved");
    return value.toBytes();
  }

  set approved(value: Bytes) {
    this.set("approved", Value.fromBytes(value));
  }
}

export class All extends Entity {
  constructor(id: string) {
    super();
    this.set("id", Value.fromString(id));
  }

  save(): void {
    let id = this.get("id");
    assert(id !== null, "Cannot save All entity without an ID");
    assert(
      id.kind == ValueKind.STRING,
      "Cannot save All entity with non-string ID. " +
        'Considering using .toHex() to convert the "id" to a string.'
    );
    store.set("All", id.toString(), this);
  }

  static load(id: string): All | null {
    return store.get("All", id) as All | null;
  }

  get id(): string {
    let value = this.get("id");
    return value.toString();
  }

  set id(value: string) {
    this.set("id", Value.fromString(value));
  }

  get numTokenContracts(): BigInt {
    let value = this.get("numTokenContracts");
    return value.toBigInt();
  }

  set numTokenContracts(value: BigInt) {
    this.set("numTokenContracts", Value.fromBigInt(value));
  }

  get numTokens(): BigInt {
    let value = this.get("numTokens");
    return value.toBigInt();
  }

  set numTokens(value: BigInt) {
    this.set("numTokens", Value.fromBigInt(value));
  }

  get numOwners(): BigInt {
    let value = this.get("numOwners");
    return value.toBigInt();
  }

  set numOwners(value: BigInt) {
    this.set("numOwners", Value.fromBigInt(value));
  }
}

export class Token extends Entity {
  constructor(id: string) {
    super();
    this.set("id", Value.fromString(id));
  }

  save(): void {
    let id = this.get("id");
    assert(id !== null, "Cannot save Token entity without an ID");
    assert(
      id.kind == ValueKind.STRING,
      "Cannot save Token entity with non-string ID. " +
        'Considering using .toHex() to convert the "id" to a string.'
    );
    store.set("Token", id.toString(), this);
  }

  static load(id: string): Token | null {
    return store.get("Token", id) as Token | null;
  }

  get id(): string {
    let value = this.get("id");
    return value.toString();
  }

  set id(value: string) {
    this.set("id", Value.fromString(value));
  }

  get contract(): string {
    let value = this.get("contract");
    return value.toString();
  }

  set contract(value: string) {
    this.set("contract", Value.fromString(value));
  }

  get tokenID(): BigInt {
    let value = this.get("tokenID");
    return value.toBigInt();
  }

  set tokenID(value: BigInt) {
    this.set("tokenID", Value.fromBigInt(value));
  }

  get owner(): string {
    let value = this.get("owner");
    return value.toString();
  }

  set owner(value: string) {
    this.set("owner", Value.fromString(value));
  }

  get mintTime(): BigInt {
    let value = this.get("mintTime");
    return value.toBigInt();
  }

  set mintTime(value: BigInt) {
    this.set("mintTime", Value.fromBigInt(value));
  }

  get tokenURI(): string {
    let value = this.get("tokenURI");
    return value.toString();
  }

  set tokenURI(value: string) {
    this.set("tokenURI", Value.fromString(value));
  }
}

export class TokenContract extends Entity {
  constructor(id: string) {
    super();
    this.set("id", Value.fromString(id));
  }

  save(): void {
    let id = this.get("id");
    assert(id !== null, "Cannot save TokenContract entity without an ID");
    assert(
      id.kind == ValueKind.STRING,
      "Cannot save TokenContract entity with non-string ID. " +
        'Considering using .toHex() to convert the "id" to a string.'
    );
    store.set("TokenContract", id.toString(), this);
  }

  static load(id: string): TokenContract | null {
    return store.get("TokenContract", id) as TokenContract | null;
  }

  get id(): string {
    let value = this.get("id");
    return value.toString();
  }

  set id(value: string) {
    this.set("id", Value.fromString(value));
  }

  get name(): string | null {
    let value = this.get("name");
    if (value === null || value.kind == ValueKind.NULL) {
      return null;
    } else {
      return value.toString();
    }
  }

  set name(value: string | null) {
    if (value === null) {
      this.unset("name");
    } else {
      this.set("name", Value.fromString(value as string));
    }
  }

  get symbol(): string | null {
    let value = this.get("symbol");
    if (value === null || value.kind == ValueKind.NULL) {
      return null;
    } else {
      return value.toString();
    }
  }

  set symbol(value: string | null) {
    if (value === null) {
      this.unset("symbol");
    } else {
      this.set("symbol", Value.fromString(value as string));
    }
  }

  get doAllAddressesOwnTheirIdByDefault(): boolean {
    let value = this.get("doAllAddressesOwnTheirIdByDefault");
    return value.toBoolean();
  }

  set doAllAddressesOwnTheirIdByDefault(value: boolean) {
    this.set("doAllAddressesOwnTheirIdByDefault", Value.fromBoolean(value));
  }

  get supportsEIP721Metadata(): boolean {
    let value = this.get("supportsEIP721Metadata");
    return value.toBoolean();
  }

  set supportsEIP721Metadata(value: boolean) {
    this.set("supportsEIP721Metadata", Value.fromBoolean(value));
  }

  get tokens(): Array<string> {
    let value = this.get("tokens");
    return value.toStringArray();
  }

  set tokens(value: Array<string>) {
    this.set("tokens", Value.fromStringArray(value));
  }

  get numTokens(): BigInt {
    let value = this.get("numTokens");
    return value.toBigInt();
  }

  set numTokens(value: BigInt) {
    this.set("numTokens", Value.fromBigInt(value));
  }

  get numOwners(): BigInt {
    let value = this.get("numOwners");
    return value.toBigInt();
  }

  set numOwners(value: BigInt) {
    this.set("numOwners", Value.fromBigInt(value));
  }
}

export class TokenInfo extends Entity {
  constructor(id: string) {
    super();
    this.set("id", Value.fromString(id));
  }

  save(): void {
    let id = this.get("id");
    assert(id !== null, "Cannot save TokenInfo entity without an ID");
    assert(
      id.kind == ValueKind.STRING,
      "Cannot save TokenInfo entity with non-string ID. " +
        'Considering using .toHex() to convert the "id" to a string.'
    );
    store.set("TokenInfo", id.toString(), this);
  }

  static load(id: string): TokenInfo | null {
    return store.get("TokenInfo", id) as TokenInfo | null;
  }

  get id(): string {
    let value = this.get("id");
    return value.toString();
  }

  set id(value: string) {
    this.set("id", Value.fromString(value));
  }

  get title(): string {
    let value = this.get("title");
    return value.toString();
  }

  set title(value: string) {
    this.set("title", Value.fromString(value));
  }

  get class_id(): BigInt {
    let value = this.get("class_id");
    return value.toBigInt();
  }

  set class_id(value: BigInt) {
    this.set("class_id", Value.fromBigInt(value));
  }

  get size(): BigInt {
    let value = this.get("size");
    return value.toBigInt();
  }

  set size(value: BigInt) {
    this.set("size", Value.fromBigInt(value));
  }
}

export class Owner extends Entity {
  constructor(id: string) {
    super();
    this.set("id", Value.fromString(id));
  }

  save(): void {
    let id = this.get("id");
    assert(id !== null, "Cannot save Owner entity without an ID");
    assert(
      id.kind == ValueKind.STRING,
      "Cannot save Owner entity with non-string ID. " +
        'Considering using .toHex() to convert the "id" to a string.'
    );
    store.set("Owner", id.toString(), this);
  }

  static load(id: string): Owner | null {
    return store.get("Owner", id) as Owner | null;
  }

  get id(): string {
    let value = this.get("id");
    return value.toString();
  }

  set id(value: string) {
    this.set("id", Value.fromString(value));
  }

  get tokens(): Array<string> {
    let value = this.get("tokens");
    return value.toStringArray();
  }

  set tokens(value: Array<string>) {
    this.set("tokens", Value.fromStringArray(value));
  }

  get numTokens(): BigInt {
    let value = this.get("numTokens");
    return value.toBigInt();
  }

  set numTokens(value: BigInt) {
    this.set("numTokens", Value.fromBigInt(value));
  }
}

export class OwnerPerTokenContract extends Entity {
  constructor(id: string) {
    super();
    this.set("id", Value.fromString(id));
  }

  save(): void {
    let id = this.get("id");
    assert(
      id !== null,
      "Cannot save OwnerPerTokenContract entity without an ID"
    );
    assert(
      id.kind == ValueKind.STRING,
      "Cannot save OwnerPerTokenContract entity with non-string ID. " +
        'Considering using .toHex() to convert the "id" to a string.'
    );
    store.set("OwnerPerTokenContract", id.toString(), this);
  }

  static load(id: string): OwnerPerTokenContract | null {
    return store.get(
      "OwnerPerTokenContract",
      id
    ) as OwnerPerTokenContract | null;
  }

  get id(): string {
    let value = this.get("id");
    return value.toString();
  }

  set id(value: string) {
    this.set("id", Value.fromString(value));
  }

  get owner(): string {
    let value = this.get("owner");
    return value.toString();
  }

  set owner(value: string) {
    this.set("owner", Value.fromString(value));
  }

  get contract(): string {
    let value = this.get("contract");
    return value.toString();
  }

  set contract(value: string) {
    this.set("contract", Value.fromString(value));
  }

  get numTokens(): BigInt {
    let value = this.get("numTokens");
    return value.toBigInt();
  }

  set numTokens(value: BigInt) {
    this.set("numTokens", Value.fromBigInt(value));
  }
}

export class TokenTransaction extends Entity {
  constructor(id: string) {
    super();
    this.set("id", Value.fromString(id));
  }

  save(): void {
    let id = this.get("id");
    assert(id !== null, "Cannot save TokenTransaction entity without an ID");
    assert(
      id.kind == ValueKind.STRING,
      "Cannot save TokenTransaction entity with non-string ID. " +
        'Considering using .toHex() to convert the "id" to a string.'
    );
    store.set("TokenTransaction", id.toString(), this);
  }

  static load(id: string): TokenTransaction | null {
    return store.get("TokenTransaction", id) as TokenTransaction | null;
  }

  get id(): string {
    let value = this.get("id");
    return value.toString();
  }

  set id(value: string) {
    this.set("id", Value.fromString(value));
  }

  get token_id(): BigInt {
    let value = this.get("token_id");
    return value.toBigInt();
  }

  set token_id(value: BigInt) {
    this.set("token_id", Value.fromBigInt(value));
  }

  get tx_hash(): string {
    let value = this.get("tx_hash");
    return value.toString();
  }

  set tx_hash(value: string) {
    this.set("tx_hash", Value.fromString(value));
  }
}

export class AuctionList extends Entity {
  constructor(id: string) {
    super();
    this.set("id", Value.fromString(id));
  }

  save(): void {
    let id = this.get("id");
    assert(id !== null, "Cannot save AuctionList entity without an ID");
    assert(
      id.kind == ValueKind.STRING,
      "Cannot save AuctionList entity with non-string ID. " +
        'Considering using .toHex() to convert the "id" to a string.'
    );
    store.set("AuctionList", id.toString(), this);
  }

  static load(id: string): AuctionList | null {
    return store.get("AuctionList", id) as AuctionList | null;
  }

  get id(): string {
    let value = this.get("id");
    return value.toString();
  }

  set id(value: string) {
    this.set("id", Value.fromString(value));
  }

  get count(): BigInt {
    let value = this.get("count");
    return value.toBigInt();
  }

  set count(value: BigInt) {
    this.set("count", Value.fromBigInt(value));
  }

  get creatorAddress(): Bytes {
    let value = this.get("creatorAddress");
    return value.toBytes();
  }

  set creatorAddress(value: Bytes) {
    this.set("creatorAddress", Value.fromBytes(value));
  }

  get contractAddress(): string {
    let value = this.get("contractAddress");
    return value.toString();
  }

  set contractAddress(value: string) {
    this.set("contractAddress", Value.fromString(value));
  }

  get matchId(): string {
    let value = this.get("matchId");
    return value.toString();
  }

  set matchId(value: string) {
    this.set("matchId", Value.fromString(value));
  }

  get openBlock(): BigInt {
    let value = this.get("openBlock");
    return value.toBigInt();
  }

  set openBlock(value: BigInt) {
    this.set("openBlock", Value.fromBigInt(value));
  }

  get expiryBlock(): BigInt {
    let value = this.get("expiryBlock");
    return value.toBigInt();
  }

  set expiryBlock(value: BigInt) {
    this.set("expiryBlock", Value.fromBigInt(value));
  }

  get increment(): BigInt {
    let value = this.get("increment");
    return value.toBigInt();
  }

  set increment(value: BigInt) {
    this.set("increment", Value.fromBigInt(value));
  }

  get expiryExtension(): BigInt {
    let value = this.get("expiryExtension");
    return value.toBigInt();
  }

  set expiryExtension(value: BigInt) {
    this.set("expiryExtension", Value.fromBigInt(value));
  }

  get tokenIndex(): BigInt {
    let value = this.get("tokenIndex");
    return value.toBigInt();
  }

  set tokenIndex(value: BigInt) {
    this.set("tokenIndex", Value.fromBigInt(value));
  }

  get nft_contract_address(): Bytes {
    let value = this.get("nft_contract_address");
    return value.toBytes();
  }

  set nft_contract_address(value: Bytes) {
    this.set("nft_contract_address", Value.fromBytes(value));
  }

  get nft_token_id(): BigInt {
    let value = this.get("nft_token_id");
    return value.toBigInt();
  }

  set nft_token_id(value: BigInt) {
    this.set("nft_token_id", Value.fromBigInt(value));
  }

  get nft_min_bid(): BigInt {
    let value = this.get("nft_min_bid");
    return value.toBigInt();
  }

  set nft_min_bid(value: BigInt) {
    this.set("nft_min_bid", Value.fromBigInt(value));
  }

  get nft_fixed_price(): BigInt {
    let value = this.get("nft_fixed_price");
    return value.toBigInt();
  }

  set nft_fixed_price(value: BigInt) {
    this.set("nft_fixed_price", Value.fromBigInt(value));
  }
}

export class AuctionBidList extends Entity {
  constructor(id: string) {
    super();
    this.set("id", Value.fromString(id));
  }

  save(): void {
    let id = this.get("id");
    assert(id !== null, "Cannot save AuctionBidList entity without an ID");
    assert(
      id.kind == ValueKind.STRING,
      "Cannot save AuctionBidList entity with non-string ID. " +
        'Considering using .toHex() to convert the "id" to a string.'
    );
    store.set("AuctionBidList", id.toString(), this);
  }

  static load(id: string): AuctionBidList | null {
    return store.get("AuctionBidList", id) as AuctionBidList | null;
  }

  get id(): string {
    let value = this.get("id");
    return value.toString();
  }

  set id(value: string) {
    this.set("id", Value.fromString(value));
  }

  get contractAddress(): string {
    let value = this.get("contractAddress");
    return value.toString();
  }

  set contractAddress(value: string) {
    this.set("contractAddress", Value.fromString(value));
  }

  get matchId(): string {
    let value = this.get("matchId");
    return value.toString();
  }

  set matchId(value: string) {
    this.set("matchId", Value.fromString(value));
  }

  get playerAddress(): Bytes {
    let value = this.get("playerAddress");
    return value.toBytes();
  }

  set playerAddress(value: Bytes) {
    this.set("playerAddress", Value.fromBytes(value));
  }

  get tokenIndex(): BigInt {
    let value = this.get("tokenIndex");
    return value.toBigInt();
  }

  set tokenIndex(value: BigInt) {
    this.set("tokenIndex", Value.fromBigInt(value));
  }

  get bid(): BigInt {
    let value = this.get("bid");
    return value.toBigInt();
  }

  set bid(value: BigInt) {
    this.set("bid", Value.fromBigInt(value));
  }

  get expiryBlock(): BigInt {
    let value = this.get("expiryBlock");
    return value.toBigInt();
  }

  set expiryBlock(value: BigInt) {
    this.set("expiryBlock", Value.fromBigInt(value));
  }
}

export class AuctionRewardList extends Entity {
  constructor(id: string) {
    super();
    this.set("id", Value.fromString(id));
  }

  save(): void {
    let id = this.get("id");
    assert(id !== null, "Cannot save AuctionRewardList entity without an ID");
    assert(
      id.kind == ValueKind.STRING,
      "Cannot save AuctionRewardList entity with non-string ID. " +
        'Considering using .toHex() to convert the "id" to a string.'
    );
    store.set("AuctionRewardList", id.toString(), this);
  }

  static load(id: string): AuctionRewardList | null {
    return store.get("AuctionRewardList", id) as AuctionRewardList | null;
  }

  get id(): string {
    let value = this.get("id");
    return value.toString();
  }

  set id(value: string) {
    this.set("id", Value.fromString(value));
  }

  get contractAddress(): string {
    let value = this.get("contractAddress");
    return value.toString();
  }

  set contractAddress(value: string) {
    this.set("contractAddress", Value.fromString(value));
  }

  get matchId(): string {
    let value = this.get("matchId");
    return value.toString();
  }

  set matchId(value: string) {
    this.set("matchId", Value.fromString(value));
  }

  get tokenIndex(): BigInt {
    let value = this.get("tokenIndex");
    return value.toBigInt();
  }

  set tokenIndex(value: BigInt) {
    this.set("tokenIndex", Value.fromBigInt(value));
  }

  get winnerAddress(): Bytes {
    let value = this.get("winnerAddress");
    return value.toBytes();
  }

  set winnerAddress(value: Bytes) {
    this.set("winnerAddress", Value.fromBytes(value));
  }
}

export class TrustMarketplaceOrder extends Entity {
  constructor(id: string) {
    super();
    this.set("id", Value.fromString(id));
  }

  save(): void {
    let id = this.get("id");
    assert(
      id !== null,
      "Cannot save TrustMarketplaceOrder entity without an ID"
    );
    assert(
      id.kind == ValueKind.STRING,
      "Cannot save TrustMarketplaceOrder entity with non-string ID. " +
        'Considering using .toHex() to convert the "id" to a string.'
    );
    store.set("TrustMarketplaceOrder", id.toString(), this);
  }

  static load(id: string): TrustMarketplaceOrder | null {
    return store.get(
      "TrustMarketplaceOrder",
      id
    ) as TrustMarketplaceOrder | null;
  }

  get id(): string {
    let value = this.get("id");
    return value.toString();
  }

  set id(value: string) {
    this.set("id", Value.fromString(value));
  }

  get seller(): Bytes {
    let value = this.get("seller");
    return value.toBytes();
  }

  set seller(value: Bytes) {
    this.set("seller", Value.fromBytes(value));
  }

  get nft_address(): Bytes {
    let value = this.get("nft_address");
    return value.toBytes();
  }

  set nft_address(value: Bytes) {
    this.set("nft_address", Value.fromBytes(value));
  }

  get token_id(): BigInt {
    let value = this.get("token_id");
    return value.toBigInt();
  }

  set token_id(value: BigInt) {
    this.set("token_id", Value.fromBigInt(value));
  }

  get price_in_wei(): BigInt {
    let value = this.get("price_in_wei");
    return value.toBigInt();
  }

  set price_in_wei(value: BigInt) {
    this.set("price_in_wei", Value.fromBigInt(value));
  }

  get expires_at(): BigInt {
    let value = this.get("expires_at");
    return value.toBigInt();
  }

  set expires_at(value: BigInt) {
    this.set("expires_at", Value.fromBigInt(value));
  }

  get tx_hash(): string {
    let value = this.get("tx_hash");
    return value.toString();
  }

  set tx_hash(value: string) {
    this.set("tx_hash", Value.fromString(value));
  }

  get is_succ(): BigInt {
    let value = this.get("is_succ");
    return value.toBigInt();
  }

  set is_succ(value: BigInt) {
    this.set("is_succ", Value.fromBigInt(value));
  }

  get create_block_number(): BigInt {
    let value = this.get("create_block_number");
    return value.toBigInt();
  }

  set create_block_number(value: BigInt) {
    this.set("create_block_number", Value.fromBigInt(value));
  }

  get succ_block_number(): BigInt {
    let value = this.get("succ_block_number");
    return value.toBigInt();
  }

  set succ_block_number(value: BigInt) {
    this.set("succ_block_number", Value.fromBigInt(value));
  }

  get cancel_block_number(): BigInt {
    let value = this.get("cancel_block_number");
    return value.toBigInt();
  }

  set cancel_block_number(value: BigInt) {
    this.set("cancel_block_number", Value.fromBigInt(value));
  }

}

export class TrustMarketplaceBid extends Entity {
  constructor(id: string) {
    super();
    this.set("id", Value.fromString(id));
  }

  save(): void {
    let id = this.get("id");
    assert(id !== null, "Cannot save TrustMarketplaceBid entity without an ID");
    assert(
      id.kind == ValueKind.STRING,
      "Cannot save TrustMarketplaceBid entity with non-string ID. " +
        'Considering using .toHex() to convert the "id" to a string.'
    );
    store.set("TrustMarketplaceBid", id.toString(), this);
  }

  static load(id: string): TrustMarketplaceBid | null {
    return store.get("TrustMarketplaceBid", id) as TrustMarketplaceBid | null;
  }

  get id(): string {
    let value = this.get("id");
    return value.toString();
  }

  set id(value: string) {
    this.set("id", Value.fromString(value));
  }

  get nft_address(): Bytes {
    let value = this.get("nft_address");
    return value.toBytes();
  }

  set nft_address(value: Bytes) {
    this.set("nft_address", Value.fromBytes(value));
  }

  get tx_hash(): string {
    let value = this.get("tx_hash");
    return value.toString();
  }

  set tx_hash(value: string) {
    this.set("tx_hash", Value.fromString(value));
  }

  get token_id(): BigInt {
    let value = this.get("token_id");
    return value.toBigInt();
  }

  set token_id(value: BigInt) {
    this.set("token_id", Value.fromBigInt(value));
  }

  get block_number(): BigInt {
    let value = this.get("block_number");
    return value.toBigInt();
  }

  set block_number(value: BigInt) {
    this.set("block_number", Value.fromBigInt(value));
  }

  get bidder(): Bytes {
    let value = this.get("bidder");
    return value.toBytes();
  }

  set bidder(value: Bytes) {
    this.set("bidder", Value.fromBytes(value));
  }

  get price_in_wei(): BigInt {
    let value = this.get("price_in_wei");
    return value.toBigInt();
  }

  set price_in_wei(value: BigInt) {
    this.set("price_in_wei", Value.fromBigInt(value));
  }

  get expires_at(): BigInt {
    let value = this.get("expires_at");
    return value.toBigInt();
  }

  set expires_at(value: BigInt) {
    this.set("expires_at", Value.fromBigInt(value));
  }
}


