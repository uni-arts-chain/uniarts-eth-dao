// THIS IS AN AUTOGENERATED FILE. DO NOT EDIT THIS FILE DIRECTLY.

import {
  ethereum,
  JSONValue,
  TypedMap,
  Entity,
  Bytes,
  Address,
  BigInt
} from "@graphprotocol/graph-ts";

export class ChangedFeePerMillion extends ethereum.Event {
  get params(): ChangedFeePerMillion__Params {
    return new ChangedFeePerMillion__Params(this);
  }
}

export class ChangedFeePerMillion__Params {
  _event: ChangedFeePerMillion;

  constructor(event: ChangedFeePerMillion) {
    this._event = event;
  }

  get cutPerMillion(): BigInt {
    return this._event.parameters[0].value.toBigInt();
  }
}

export class CreateAuctionEvent extends ethereum.Event {
  get params(): CreateAuctionEvent__Params {
    return new CreateAuctionEvent__Params(this);
  }
}

export class CreateAuctionEvent__Params {
  _event: CreateAuctionEvent;

  constructor(event: CreateAuctionEvent) {
    this._event = event;
  }

  get creatorAddress(): Address {
    return this._event.parameters[0].value.toAddress();
  }

  get matchId(): string {
    return this._event.parameters[1].value.toString();
  }

  get payTokenAddress(): Address {
    return this._event.parameters[2].value.toAddress();
  }

  get openBlock(): BigInt {
    return this._event.parameters[3].value.toBigInt();
  }

  get expiryBlock(): BigInt {
    return this._event.parameters[4].value.toBigInt();
  }

  get increment(): BigInt {
    return this._event.parameters[5].value.toBigInt();
  }

  get expiryExtension(): BigInt {
    return this._event.parameters[6].value.toBigInt();
  }

  get tokenIndex(): BigInt {
    return this._event.parameters[7].value.toBigInt();
  }

  get nfts(): CreateAuctionEventNftsStruct {
    return this._event.parameters[8].value.toTuple() as CreateAuctionEventNftsStruct;
  }
}

export class CreateAuctionEventNftsStruct extends ethereum.Tuple {
  get contractAddress(): Address {
    return this[0].toAddress();
  }

  get tokenId(): BigInt {
    return this[1].toBigInt();
  }

  get amount(): BigInt {
    return this[2].toBigInt();
  }

  get minBid(): BigInt {
    return this[3].toBigInt();
  }

  get fixedPrice(): BigInt {
    return this[4].toBigInt();
  }
}

export class CreatorWithdrawProfit extends ethereum.Event {
  get params(): CreatorWithdrawProfit__Params {
    return new CreatorWithdrawProfit__Params(this);
  }
}

export class CreatorWithdrawProfit__Params {
  _event: CreatorWithdrawProfit;

  constructor(event: CreatorWithdrawProfit) {
    this._event = event;
  }

  get creatorAddress(): Address {
    return this._event.parameters[0].value.toAddress();
  }

  get payTokenAddress(): Address {
    return this._event.parameters[1].value.toAddress();
  }

  get balance(): BigInt {
    return this._event.parameters[2].value.toBigInt();
  }
}

export class OwnershipTransferred extends ethereum.Event {
  get params(): OwnershipTransferred__Params {
    return new OwnershipTransferred__Params(this);
  }
}

export class OwnershipTransferred__Params {
  _event: OwnershipTransferred;

  constructor(event: OwnershipTransferred) {
    this._event = event;
  }

  get previousOwner(): Address {
    return this._event.parameters[0].value.toAddress();
  }

  get newOwner(): Address {
    return this._event.parameters[1].value.toAddress();
  }
}

export class PlayerBidEvent extends ethereum.Event {
  get params(): PlayerBidEvent__Params {
    return new PlayerBidEvent__Params(this);
  }
}

export class PlayerBidEvent__Params {
  _event: PlayerBidEvent;

  constructor(event: PlayerBidEvent) {
    this._event = event;
  }

  get matchId(): string {
    return this._event.parameters[0].value.toString();
  }

  get playerAddress(): Address {
    return this._event.parameters[1].value.toAddress();
  }

  get tokenIndex(): BigInt {
    return this._event.parameters[2].value.toBigInt();
  }

  get payTokenAddress(): Address {
    return this._event.parameters[3].value.toAddress();
  }

  get bid(): BigInt {
    return this._event.parameters[4].value.toBigInt();
  }

  get expiryBlock(): BigInt {
    return this._event.parameters[5].value.toBigInt();
  }
}

export class PlayerWithdrawBid extends ethereum.Event {
  get params(): PlayerWithdrawBid__Params {
    return new PlayerWithdrawBid__Params(this);
  }
}

export class PlayerWithdrawBid__Params {
  _event: PlayerWithdrawBid;

  constructor(event: PlayerWithdrawBid) {
    this._event = event;
  }

  get matchId(): string {
    return this._event.parameters[0].value.toString();
  }

  get tokenIndex(): BigInt {
    return this._event.parameters[1].value.toBigInt();
  }
}

export class ProcessWithdrawNft extends ethereum.Event {
  get params(): ProcessWithdrawNft__Params {
    return new ProcessWithdrawNft__Params(this);
  }
}

export class ProcessWithdrawNft__Params {
  _event: ProcessWithdrawNft;

  constructor(event: ProcessWithdrawNft) {
    this._event = event;
  }

  get matchId(): string {
    return this._event.parameters[0].value.toString();
  }

  get tokenIndex(): BigInt {
    return this._event.parameters[1].value.toBigInt();
  }
}

export class RewardEvent extends ethereum.Event {
  get params(): RewardEvent__Params {
    return new RewardEvent__Params(this);
  }
}

export class RewardEvent__Params {
  _event: RewardEvent;

  constructor(event: RewardEvent) {
    this._event = event;
  }

  get matchId(): string {
    return this._event.parameters[0].value.toString();
  }

  get tokenIndex(): BigInt {
    return this._event.parameters[1].value.toBigInt();
  }

  get winnerAddress(): Address {
    return this._event.parameters[2].value.toAddress();
  }
}

export class SetNewPayToken extends ethereum.Event {
  get params(): SetNewPayToken__Params {
    return new SetNewPayToken__Params(this);
  }
}

export class SetNewPayToken__Params {
  _event: SetNewPayToken;

  constructor(event: SetNewPayToken) {
    this._event = event;
  }

  get tokenName(): string {
    return this._event.parameters[0].value.toString();
  }

  get tokenAddress(): Address {
    return this._event.parameters[1].value.toAddress();
  }
}

export class MultiTokenAuction__matchNFTsResult {
  value0: Address;
  value1: BigInt;
  value2: BigInt;
  value3: BigInt;
  value4: BigInt;

  constructor(
    value0: Address,
    value1: BigInt,
    value2: BigInt,
    value3: BigInt,
    value4: BigInt
  ) {
    this.value0 = value0;
    this.value1 = value1;
    this.value2 = value2;
    this.value3 = value3;
    this.value4 = value4;
  }

  toMap(): TypedMap<string, ethereum.Value> {
    let map = new TypedMap<string, ethereum.Value>();
    map.set("value0", ethereum.Value.fromAddress(this.value0));
    map.set("value1", ethereum.Value.fromUnsignedBigInt(this.value1));
    map.set("value2", ethereum.Value.fromUnsignedBigInt(this.value2));
    map.set("value3", ethereum.Value.fromUnsignedBigInt(this.value3));
    map.set("value4", ethereum.Value.fromUnsignedBigInt(this.value4));
    return map;
  }
}

export class MultiTokenAuction__matchResultsResult {
  value0: Address;
  value1: BigInt;
  value2: BigInt;

  constructor(value0: Address, value1: BigInt, value2: BigInt) {
    this.value0 = value0;
    this.value1 = value1;
    this.value2 = value2;
  }

  toMap(): TypedMap<string, ethereum.Value> {
    let map = new TypedMap<string, ethereum.Value>();
    map.set("value0", ethereum.Value.fromAddress(this.value0));
    map.set("value1", ethereum.Value.fromUnsignedBigInt(this.value1));
    map.set("value2", ethereum.Value.fromUnsignedBigInt(this.value2));
    return map;
  }
}

export class MultiTokenAuction__matchesResult {
  value0: Address;
  value1: Address;
  value2: BigInt;
  value3: BigInt;
  value4: BigInt;
  value5: BigInt;
  value6: BigInt;

  constructor(
    value0: Address,
    value1: Address,
    value2: BigInt,
    value3: BigInt,
    value4: BigInt,
    value5: BigInt,
    value6: BigInt
  ) {
    this.value0 = value0;
    this.value1 = value1;
    this.value2 = value2;
    this.value3 = value3;
    this.value4 = value4;
    this.value5 = value5;
    this.value6 = value6;
  }

  toMap(): TypedMap<string, ethereum.Value> {
    let map = new TypedMap<string, ethereum.Value>();
    map.set("value0", ethereum.Value.fromAddress(this.value0));
    map.set("value1", ethereum.Value.fromAddress(this.value1));
    map.set("value2", ethereum.Value.fromUnsignedBigInt(this.value2));
    map.set("value3", ethereum.Value.fromUnsignedBigInt(this.value3));
    map.set("value4", ethereum.Value.fromUnsignedBigInt(this.value4));
    map.set("value5", ethereum.Value.fromUnsignedBigInt(this.value5));
    map.set("value6", ethereum.Value.fromUnsignedBigInt(this.value6));
    return map;
  }
}

export class MultiTokenAuction__get_matchResult {
  value0: Address;
  value1: Address;
  value2: BigInt;
  value3: BigInt;
  value4: BigInt;
  value5: BigInt;
  value6: BigInt;

  constructor(
    value0: Address,
    value1: Address,
    value2: BigInt,
    value3: BigInt,
    value4: BigInt,
    value5: BigInt,
    value6: BigInt
  ) {
    this.value0 = value0;
    this.value1 = value1;
    this.value2 = value2;
    this.value3 = value3;
    this.value4 = value4;
    this.value5 = value5;
    this.value6 = value6;
  }

  toMap(): TypedMap<string, ethereum.Value> {
    let map = new TypedMap<string, ethereum.Value>();
    map.set("value0", ethereum.Value.fromAddress(this.value0));
    map.set("value1", ethereum.Value.fromAddress(this.value1));
    map.set("value2", ethereum.Value.fromUnsignedBigInt(this.value2));
    map.set("value3", ethereum.Value.fromUnsignedBigInt(this.value3));
    map.set("value4", ethereum.Value.fromUnsignedBigInt(this.value4));
    map.set("value5", ethereum.Value.fromUnsignedBigInt(this.value5));
    map.set("value6", ethereum.Value.fromUnsignedBigInt(this.value6));
    return map;
  }
}

export class MultiTokenAuction__get_pay_tokenResult {
  value0: string;
  value1: Address;

  constructor(value0: string, value1: Address) {
    this.value0 = value0;
    this.value1 = value1;
  }

  toMap(): TypedMap<string, ethereum.Value> {
    let map = new TypedMap<string, ethereum.Value>();
    map.set("value0", ethereum.Value.fromString(this.value0));
    map.set("value1", ethereum.Value.fromAddress(this.value1));
    return map;
  }
}

export class MultiTokenAuction__get_current_resultResult {
  value0: Address;
  value1: BigInt;

  constructor(value0: Address, value1: BigInt) {
    this.value0 = value0;
    this.value1 = value1;
  }

  toMap(): TypedMap<string, ethereum.Value> {
    let map = new TypedMap<string, ethereum.Value>();
    map.set("value0", ethereum.Value.fromAddress(this.value0));
    map.set("value1", ethereum.Value.fromUnsignedBigInt(this.value1));
    return map;
  }
}

export class MultiTokenAuction extends ethereum.SmartContract {
  static bind(address: Address): MultiTokenAuction {
    return new MultiTokenAuction("MultiTokenAuction", address);
  }

  cutPerMillion(): BigInt {
    let result = super.call("cutPerMillion", "cutPerMillion():(uint256)", []);

    return result[0].toBigInt();
  }

  try_cutPerMillion(): ethereum.CallResult<BigInt> {
    let result = super.tryCall(
      "cutPerMillion",
      "cutPerMillion():(uint256)",
      []
    );
    if (result.reverted) {
      return new ethereum.CallResult();
    }
    let value = result.value;
    return ethereum.CallResult.fromValue(value[0].toBigInt());
  }

  matchNFTs(
    param0: string,
    param1: BigInt
  ): MultiTokenAuction__matchNFTsResult {
    let result = super.call(
      "matchNFTs",
      "matchNFTs(string,uint256):(address,uint256,uint256,uint256,uint256)",
      [
        ethereum.Value.fromString(param0),
        ethereum.Value.fromUnsignedBigInt(param1)
      ]
    );

    return new MultiTokenAuction__matchNFTsResult(
      result[0].toAddress(),
      result[1].toBigInt(),
      result[2].toBigInt(),
      result[3].toBigInt(),
      result[4].toBigInt()
    );
  }

  try_matchNFTs(
    param0: string,
    param1: BigInt
  ): ethereum.CallResult<MultiTokenAuction__matchNFTsResult> {
    let result = super.tryCall(
      "matchNFTs",
      "matchNFTs(string,uint256):(address,uint256,uint256,uint256,uint256)",
      [
        ethereum.Value.fromString(param0),
        ethereum.Value.fromUnsignedBigInt(param1)
      ]
    );
    if (result.reverted) {
      return new ethereum.CallResult();
    }
    let value = result.value;
    return ethereum.CallResult.fromValue(
      new MultiTokenAuction__matchNFTsResult(
        value[0].toAddress(),
        value[1].toBigInt(),
        value[2].toBigInt(),
        value[3].toBigInt(),
        value[4].toBigInt()
      )
    );
  }

  matchResults(
    param0: string,
    param1: BigInt
  ): MultiTokenAuction__matchResultsResult {
    let result = super.call(
      "matchResults",
      "matchResults(string,uint256):(address,uint256,uint256)",
      [
        ethereum.Value.fromString(param0),
        ethereum.Value.fromUnsignedBigInt(param1)
      ]
    );

    return new MultiTokenAuction__matchResultsResult(
      result[0].toAddress(),
      result[1].toBigInt(),
      result[2].toBigInt()
    );
  }

  try_matchResults(
    param0: string,
    param1: BigInt
  ): ethereum.CallResult<MultiTokenAuction__matchResultsResult> {
    let result = super.tryCall(
      "matchResults",
      "matchResults(string,uint256):(address,uint256,uint256)",
      [
        ethereum.Value.fromString(param0),
        ethereum.Value.fromUnsignedBigInt(param1)
      ]
    );
    if (result.reverted) {
      return new ethereum.CallResult();
    }
    let value = result.value;
    return ethereum.CallResult.fromValue(
      new MultiTokenAuction__matchResultsResult(
        value[0].toAddress(),
        value[1].toBigInt(),
        value[2].toBigInt()
      )
    );
  }

  matches(param0: string): MultiTokenAuction__matchesResult {
    let result = super.call(
      "matches",
      "matches(string):(address,address,uint96,uint96,uint96,uint32,uint32)",
      [ethereum.Value.fromString(param0)]
    );

    return new MultiTokenAuction__matchesResult(
      result[0].toAddress(),
      result[1].toAddress(),
      result[2].toBigInt(),
      result[3].toBigInt(),
      result[4].toBigInt(),
      result[5].toBigInt(),
      result[6].toBigInt()
    );
  }

  try_matches(
    param0: string
  ): ethereum.CallResult<MultiTokenAuction__matchesResult> {
    let result = super.tryCall(
      "matches",
      "matches(string):(address,address,uint96,uint96,uint96,uint32,uint32)",
      [ethereum.Value.fromString(param0)]
    );
    if (result.reverted) {
      return new ethereum.CallResult();
    }
    let value = result.value;
    return ethereum.CallResult.fromValue(
      new MultiTokenAuction__matchesResult(
        value[0].toAddress(),
        value[1].toAddress(),
        value[2].toBigInt(),
        value[3].toBigInt(),
        value[4].toBigInt(),
        value[5].toBigInt(),
        value[6].toBigInt()
      )
    );
  }

  maxCutPerMillion(): BigInt {
    let result = super.call(
      "maxCutPerMillion",
      "maxCutPerMillion():(uint256)",
      []
    );

    return result[0].toBigInt();
  }

  try_maxCutPerMillion(): ethereum.CallResult<BigInt> {
    let result = super.tryCall(
      "maxCutPerMillion",
      "maxCutPerMillion():(uint256)",
      []
    );
    if (result.reverted) {
      return new ethereum.CallResult();
    }
    let value = result.value;
    return ethereum.CallResult.fromValue(value[0].toBigInt());
  }

  owner(): Address {
    let result = super.call("owner", "owner():(address)", []);

    return result[0].toAddress();
  }

  try_owner(): ethereum.CallResult<Address> {
    let result = super.tryCall("owner", "owner():(address)", []);
    if (result.reverted) {
      return new ethereum.CallResult();
    }
    let value = result.value;
    return ethereum.CallResult.fromValue(value[0].toAddress());
  }

  payTokens(param0: string): Address {
    let result = super.call("payTokens", "payTokens(string):(address)", [
      ethereum.Value.fromString(param0)
    ]);

    return result[0].toAddress();
  }

  try_payTokens(param0: string): ethereum.CallResult<Address> {
    let result = super.tryCall("payTokens", "payTokens(string):(address)", [
      ethereum.Value.fromString(param0)
    ]);
    if (result.reverted) {
      return new ethereum.CallResult();
    }
    let value = result.value;
    return ethereum.CallResult.fromValue(value[0].toAddress());
  }

  supportsInterface(interfaceId: Bytes): boolean {
    let result = super.call(
      "supportsInterface",
      "supportsInterface(bytes4):(bool)",
      [ethereum.Value.fromFixedBytes(interfaceId)]
    );

    return result[0].toBoolean();
  }

  try_supportsInterface(interfaceId: Bytes): ethereum.CallResult<boolean> {
    let result = super.tryCall(
      "supportsInterface",
      "supportsInterface(bytes4):(bool)",
      [ethereum.Value.fromFixedBytes(interfaceId)]
    );
    if (result.reverted) {
      return new ethereum.CallResult();
    }
    let value = result.value;
    return ethereum.CallResult.fromValue(value[0].toBoolean());
  }

  onERC1155Received(
    operator: Address,
    from: Address,
    id: BigInt,
    value: BigInt,
    data: Bytes
  ): Bytes {
    let result = super.call(
      "onERC1155Received",
      "onERC1155Received(address,address,uint256,uint256,bytes):(bytes4)",
      [
        ethereum.Value.fromAddress(operator),
        ethereum.Value.fromAddress(from),
        ethereum.Value.fromUnsignedBigInt(id),
        ethereum.Value.fromUnsignedBigInt(value),
        ethereum.Value.fromBytes(data)
      ]
    );

    return result[0].toBytes();
  }

  try_onERC1155Received(
    operator: Address,
    from: Address,
    id: BigInt,
    value: BigInt,
    data: Bytes
  ): ethereum.CallResult<Bytes> {
    let result = super.tryCall(
      "onERC1155Received",
      "onERC1155Received(address,address,uint256,uint256,bytes):(bytes4)",
      [
        ethereum.Value.fromAddress(operator),
        ethereum.Value.fromAddress(from),
        ethereum.Value.fromUnsignedBigInt(id),
        ethereum.Value.fromUnsignedBigInt(value),
        ethereum.Value.fromBytes(data)
      ]
    );
    if (result.reverted) {
      return new ethereum.CallResult();
    }
    let value = result.value;
    return ethereum.CallResult.fromValue(value[0].toBytes());
  }

  onERC1155BatchReceived(
    operator: Address,
    from: Address,
    ids: Array<BigInt>,
    values: Array<BigInt>,
    data: Bytes
  ): Bytes {
    let result = super.call(
      "onERC1155BatchReceived",
      "onERC1155BatchReceived(address,address,uint256[],uint256[],bytes):(bytes4)",
      [
        ethereum.Value.fromAddress(operator),
        ethereum.Value.fromAddress(from),
        ethereum.Value.fromUnsignedBigIntArray(ids),
        ethereum.Value.fromUnsignedBigIntArray(values),
        ethereum.Value.fromBytes(data)
      ]
    );

    return result[0].toBytes();
  }

  try_onERC1155BatchReceived(
    operator: Address,
    from: Address,
    ids: Array<BigInt>,
    values: Array<BigInt>,
    data: Bytes
  ): ethereum.CallResult<Bytes> {
    let result = super.tryCall(
      "onERC1155BatchReceived",
      "onERC1155BatchReceived(address,address,uint256[],uint256[],bytes):(bytes4)",
      [
        ethereum.Value.fromAddress(operator),
        ethereum.Value.fromAddress(from),
        ethereum.Value.fromUnsignedBigIntArray(ids),
        ethereum.Value.fromUnsignedBigIntArray(values),
        ethereum.Value.fromBytes(data)
      ]
    );
    if (result.reverted) {
      return new ethereum.CallResult();
    }
    let value = result.value;
    return ethereum.CallResult.fromValue(value[0].toBytes());
  }

  get_match(matchId: string): MultiTokenAuction__get_matchResult {
    let result = super.call(
      "get_match",
      "get_match(string):(address,address,uint256,uint256,uint256,uint256,uint256)",
      [ethereum.Value.fromString(matchId)]
    );

    return new MultiTokenAuction__get_matchResult(
      result[0].toAddress(),
      result[1].toAddress(),
      result[2].toBigInt(),
      result[3].toBigInt(),
      result[4].toBigInt(),
      result[5].toBigInt(),
      result[6].toBigInt()
    );
  }

  try_get_match(
    matchId: string
  ): ethereum.CallResult<MultiTokenAuction__get_matchResult> {
    let result = super.tryCall(
      "get_match",
      "get_match(string):(address,address,uint256,uint256,uint256,uint256,uint256)",
      [ethereum.Value.fromString(matchId)]
    );
    if (result.reverted) {
      return new ethereum.CallResult();
    }
    let value = result.value;
    return ethereum.CallResult.fromValue(
      new MultiTokenAuction__get_matchResult(
        value[0].toAddress(),
        value[1].toAddress(),
        value[2].toBigInt(),
        value[3].toBigInt(),
        value[4].toBigInt(),
        value[5].toBigInt(),
        value[6].toBigInt()
      )
    );
  }

  get_pay_token(payTokenName: string): MultiTokenAuction__get_pay_tokenResult {
    let result = super.call(
      "get_pay_token",
      "get_pay_token(string):(string,address)",
      [ethereum.Value.fromString(payTokenName)]
    );

    return new MultiTokenAuction__get_pay_tokenResult(
      result[0].toString(),
      result[1].toAddress()
    );
  }

  try_get_pay_token(
    payTokenName: string
  ): ethereum.CallResult<MultiTokenAuction__get_pay_tokenResult> {
    let result = super.tryCall(
      "get_pay_token",
      "get_pay_token(string):(string,address)",
      [ethereum.Value.fromString(payTokenName)]
    );
    if (result.reverted) {
      return new ethereum.CallResult();
    }
    let value = result.value;
    return ethereum.CallResult.fromValue(
      new MultiTokenAuction__get_pay_tokenResult(
        value[0].toString(),
        value[1].toAddress()
      )
    );
  }

  get_current_result(
    matchId: string,
    tokenIndex: BigInt
  ): MultiTokenAuction__get_current_resultResult {
    let result = super.call(
      "get_current_result",
      "get_current_result(string,uint256):(address,uint256)",
      [
        ethereum.Value.fromString(matchId),
        ethereum.Value.fromUnsignedBigInt(tokenIndex)
      ]
    );

    return new MultiTokenAuction__get_current_resultResult(
      result[0].toAddress(),
      result[1].toBigInt()
    );
  }

  try_get_current_result(
    matchId: string,
    tokenIndex: BigInt
  ): ethereum.CallResult<MultiTokenAuction__get_current_resultResult> {
    let result = super.tryCall(
      "get_current_result",
      "get_current_result(string,uint256):(address,uint256)",
      [
        ethereum.Value.fromString(matchId),
        ethereum.Value.fromUnsignedBigInt(tokenIndex)
      ]
    );
    if (result.reverted) {
      return new ethereum.CallResult();
    }
    let value = result.value;
    return ethereum.CallResult.fromValue(
      new MultiTokenAuction__get_current_resultResult(
        value[0].toAddress(),
        value[1].toBigInt()
      )
    );
  }

  get_player_bid(
    matchId: string,
    playerAddress: Address,
    tokenIndex: BigInt,
    payTokenAddress: Address
  ): BigInt {
    let result = super.call(
      "get_player_bid",
      "get_player_bid(string,address,uint256,address):(uint256)",
      [
        ethereum.Value.fromString(matchId),
        ethereum.Value.fromAddress(playerAddress),
        ethereum.Value.fromUnsignedBigInt(tokenIndex),
        ethereum.Value.fromAddress(payTokenAddress)
      ]
    );

    return result[0].toBigInt();
  }

  try_get_player_bid(
    matchId: string,
    playerAddress: Address,
    tokenIndex: BigInt,
    payTokenAddress: Address
  ): ethereum.CallResult<BigInt> {
    let result = super.tryCall(
      "get_player_bid",
      "get_player_bid(string,address,uint256,address):(uint256)",
      [
        ethereum.Value.fromString(matchId),
        ethereum.Value.fromAddress(playerAddress),
        ethereum.Value.fromUnsignedBigInt(tokenIndex),
        ethereum.Value.fromAddress(payTokenAddress)
      ]
    );
    if (result.reverted) {
      return new ethereum.CallResult();
    }
    let value = result.value;
    return ethereum.CallResult.fromValue(value[0].toBigInt());
  }

  get_creator_balance(
    creatorAddress: Address,
    payTokenAddress: Address
  ): BigInt {
    let result = super.call(
      "get_creator_balance",
      "get_creator_balance(address,address):(uint256)",
      [
        ethereum.Value.fromAddress(creatorAddress),
        ethereum.Value.fromAddress(payTokenAddress)
      ]
    );

    return result[0].toBigInt();
  }

  try_get_creator_balance(
    creatorAddress: Address,
    payTokenAddress: Address
  ): ethereum.CallResult<BigInt> {
    let result = super.tryCall(
      "get_creator_balance",
      "get_creator_balance(address,address):(uint256)",
      [
        ethereum.Value.fromAddress(creatorAddress),
        ethereum.Value.fromAddress(payTokenAddress)
      ]
    );
    if (result.reverted) {
      return new ethereum.CallResult();
    }
    let value = result.value;
    return ethereum.CallResult.fromValue(value[0].toBigInt());
  }
}

export class ConstructorCall extends ethereum.Call {
  get inputs(): ConstructorCall__Inputs {
    return new ConstructorCall__Inputs(this);
  }

  get outputs(): ConstructorCall__Outputs {
    return new ConstructorCall__Outputs(this);
  }
}

export class ConstructorCall__Inputs {
  _call: ConstructorCall;

  constructor(call: ConstructorCall) {
    this._call = call;
  }

  get _payTokenName(): string {
    return this._call.inputValues[0].value.toString();
  }

  get _payTokenAddress(): Address {
    return this._call.inputValues[1].value.toAddress();
  }
}

export class ConstructorCall__Outputs {
  _call: ConstructorCall;

  constructor(call: ConstructorCall) {
    this._call = call;
  }
}

export class RenounceOwnershipCall extends ethereum.Call {
  get inputs(): RenounceOwnershipCall__Inputs {
    return new RenounceOwnershipCall__Inputs(this);
  }

  get outputs(): RenounceOwnershipCall__Outputs {
    return new RenounceOwnershipCall__Outputs(this);
  }
}

export class RenounceOwnershipCall__Inputs {
  _call: RenounceOwnershipCall;

  constructor(call: RenounceOwnershipCall) {
    this._call = call;
  }
}

export class RenounceOwnershipCall__Outputs {
  _call: RenounceOwnershipCall;

  constructor(call: RenounceOwnershipCall) {
    this._call = call;
  }
}

export class SetOwnerCutPerMillionCall extends ethereum.Call {
  get inputs(): SetOwnerCutPerMillionCall__Inputs {
    return new SetOwnerCutPerMillionCall__Inputs(this);
  }

  get outputs(): SetOwnerCutPerMillionCall__Outputs {
    return new SetOwnerCutPerMillionCall__Outputs(this);
  }
}

export class SetOwnerCutPerMillionCall__Inputs {
  _call: SetOwnerCutPerMillionCall;

  constructor(call: SetOwnerCutPerMillionCall) {
    this._call = call;
  }

  get _cutPerMillion(): BigInt {
    return this._call.inputValues[0].value.toBigInt();
  }
}

export class SetOwnerCutPerMillionCall__Outputs {
  _call: SetOwnerCutPerMillionCall;

  constructor(call: SetOwnerCutPerMillionCall) {
    this._call = call;
  }
}

export class TransferOwnershipCall extends ethereum.Call {
  get inputs(): TransferOwnershipCall__Inputs {
    return new TransferOwnershipCall__Inputs(this);
  }

  get outputs(): TransferOwnershipCall__Outputs {
    return new TransferOwnershipCall__Outputs(this);
  }
}

export class TransferOwnershipCall__Inputs {
  _call: TransferOwnershipCall;

  constructor(call: TransferOwnershipCall) {
    this._call = call;
  }

  get newOwner(): Address {
    return this._call.inputValues[0].value.toAddress();
  }
}

export class TransferOwnershipCall__Outputs {
  _call: TransferOwnershipCall;

  constructor(call: TransferOwnershipCall) {
    this._call = call;
  }
}

export class SetPayTokenCall extends ethereum.Call {
  get inputs(): SetPayTokenCall__Inputs {
    return new SetPayTokenCall__Inputs(this);
  }

  get outputs(): SetPayTokenCall__Outputs {
    return new SetPayTokenCall__Outputs(this);
  }
}

export class SetPayTokenCall__Inputs {
  _call: SetPayTokenCall;

  constructor(call: SetPayTokenCall) {
    this._call = call;
  }

  get _token_name(): string {
    return this._call.inputValues[0].value.toString();
  }

  get _token_address(): Address {
    return this._call.inputValues[1].value.toAddress();
  }
}

export class SetPayTokenCall__Outputs {
  _call: SetPayTokenCall;

  constructor(call: SetPayTokenCall) {
    this._call = call;
  }
}

export class CreateAuctionCall extends ethereum.Call {
  get inputs(): CreateAuctionCall__Inputs {
    return new CreateAuctionCall__Inputs(this);
  }

  get outputs(): CreateAuctionCall__Outputs {
    return new CreateAuctionCall__Outputs(this);
  }
}

export class CreateAuctionCall__Inputs {
  _call: CreateAuctionCall;

  constructor(call: CreateAuctionCall) {
    this._call = call;
  }

  get matchId(): string {
    return this._call.inputValues[0].value.toString();
  }

  get payTokenName(): string {
    return this._call.inputValues[1].value.toString();
  }

  get openBlock(): BigInt {
    return this._call.inputValues[2].value.toBigInt();
  }

  get expiryBlock(): BigInt {
    return this._call.inputValues[3].value.toBigInt();
  }

  get expiryExtension(): BigInt {
    return this._call.inputValues[4].value.toBigInt();
  }

  get minIncrement(): BigInt {
    return this._call.inputValues[5].value.toBigInt();
  }

  get nfts(): Array<CreateAuctionCallNftsStruct> {
    return this._call.inputValues[6].value.toTupleArray<
      CreateAuctionCallNftsStruct
    >();
  }
}

export class CreateAuctionCall__Outputs {
  _call: CreateAuctionCall;

  constructor(call: CreateAuctionCall) {
    this._call = call;
  }
}

export class CreateAuctionCallNftsStruct extends ethereum.Tuple {
  get contractAddress(): Address {
    return this[0].toAddress();
  }

  get tokenId(): BigInt {
    return this[1].toBigInt();
  }

  get amount(): BigInt {
    return this[2].toBigInt();
  }

  get minBid(): BigInt {
    return this[3].toBigInt();
  }

  get fixedPrice(): BigInt {
    return this[4].toBigInt();
  }
}

export class AddAuctionNFTCall extends ethereum.Call {
  get inputs(): AddAuctionNFTCall__Inputs {
    return new AddAuctionNFTCall__Inputs(this);
  }

  get outputs(): AddAuctionNFTCall__Outputs {
    return new AddAuctionNFTCall__Outputs(this);
  }
}

export class AddAuctionNFTCall__Inputs {
  _call: AddAuctionNFTCall;

  constructor(call: AddAuctionNFTCall) {
    this._call = call;
  }

  get matchId(): string {
    return this._call.inputValues[0].value.toString();
  }

  get nft(): AddAuctionNFTCallNftStruct {
    return this._call.inputValues[1].value.toTuple() as AddAuctionNFTCallNftStruct;
  }
}

export class AddAuctionNFTCall__Outputs {
  _call: AddAuctionNFTCall;

  constructor(call: AddAuctionNFTCall) {
    this._call = call;
  }
}

export class AddAuctionNFTCallNftStruct extends ethereum.Tuple {
  get contractAddress(): Address {
    return this[0].toAddress();
  }

  get tokenId(): BigInt {
    return this[1].toBigInt();
  }

  get amount(): BigInt {
    return this[2].toBigInt();
  }

  get minBid(): BigInt {
    return this[3].toBigInt();
  }

  get fixedPrice(): BigInt {
    return this[4].toBigInt();
  }
}

export class Player_bidCall extends ethereum.Call {
  get inputs(): Player_bidCall__Inputs {
    return new Player_bidCall__Inputs(this);
  }

  get outputs(): Player_bidCall__Outputs {
    return new Player_bidCall__Outputs(this);
  }
}

export class Player_bidCall__Inputs {
  _call: Player_bidCall;

  constructor(call: Player_bidCall) {
    this._call = call;
  }

  get matchId(): string {
    return this._call.inputValues[0].value.toString();
  }

  get tokenIndex(): BigInt {
    return this._call.inputValues[1].value.toBigInt();
  }

  get amount(): BigInt {
    return this._call.inputValues[2].value.toBigInt();
  }
}

export class Player_bidCall__Outputs {
  _call: Player_bidCall;

  constructor(call: Player_bidCall) {
    this._call = call;
  }
}

export class Player_fixed_priceCall extends ethereum.Call {
  get inputs(): Player_fixed_priceCall__Inputs {
    return new Player_fixed_priceCall__Inputs(this);
  }

  get outputs(): Player_fixed_priceCall__Outputs {
    return new Player_fixed_priceCall__Outputs(this);
  }
}

export class Player_fixed_priceCall__Inputs {
  _call: Player_fixed_priceCall;

  constructor(call: Player_fixed_priceCall) {
    this._call = call;
  }

  get matchId(): string {
    return this._call.inputValues[0].value.toString();
  }

  get tokenIndex(): BigInt {
    return this._call.inputValues[1].value.toBigInt();
  }
}

export class Player_fixed_priceCall__Outputs {
  _call: Player_fixed_priceCall;

  constructor(call: Player_fixed_priceCall) {
    this._call = call;
  }
}

export class Player_withdraw_bidCall extends ethereum.Call {
  get inputs(): Player_withdraw_bidCall__Inputs {
    return new Player_withdraw_bidCall__Inputs(this);
  }

  get outputs(): Player_withdraw_bidCall__Outputs {
    return new Player_withdraw_bidCall__Outputs(this);
  }
}

export class Player_withdraw_bidCall__Inputs {
  _call: Player_withdraw_bidCall;

  constructor(call: Player_withdraw_bidCall) {
    this._call = call;
  }

  get matchId(): string {
    return this._call.inputValues[0].value.toString();
  }

  get tokenIndex(): BigInt {
    return this._call.inputValues[1].value.toBigInt();
  }
}

export class Player_withdraw_bidCall__Outputs {
  _call: Player_withdraw_bidCall;

  constructor(call: Player_withdraw_bidCall) {
    this._call = call;
  }
}

export class RewardCall extends ethereum.Call {
  get inputs(): RewardCall__Inputs {
    return new RewardCall__Inputs(this);
  }

  get outputs(): RewardCall__Outputs {
    return new RewardCall__Outputs(this);
  }
}

export class RewardCall__Inputs {
  _call: RewardCall;

  constructor(call: RewardCall) {
    this._call = call;
  }

  get matchId(): string {
    return this._call.inputValues[0].value.toString();
  }

  get tokenIndex(): BigInt {
    return this._call.inputValues[1].value.toBigInt();
  }
}

export class RewardCall__Outputs {
  _call: RewardCall;

  constructor(call: RewardCall) {
    this._call = call;
  }
}

export class Creator_withdraw_nft_batchCall extends ethereum.Call {
  get inputs(): Creator_withdraw_nft_batchCall__Inputs {
    return new Creator_withdraw_nft_batchCall__Inputs(this);
  }

  get outputs(): Creator_withdraw_nft_batchCall__Outputs {
    return new Creator_withdraw_nft_batchCall__Outputs(this);
  }
}

export class Creator_withdraw_nft_batchCall__Inputs {
  _call: Creator_withdraw_nft_batchCall;

  constructor(call: Creator_withdraw_nft_batchCall) {
    this._call = call;
  }

  get matchId(): string {
    return this._call.inputValues[0].value.toString();
  }
}

export class Creator_withdraw_nft_batchCall__Outputs {
  _call: Creator_withdraw_nft_batchCall;

  constructor(call: Creator_withdraw_nft_batchCall) {
    this._call = call;
  }
}

export class Creator_withdraw_nftCall extends ethereum.Call {
  get inputs(): Creator_withdraw_nftCall__Inputs {
    return new Creator_withdraw_nftCall__Inputs(this);
  }

  get outputs(): Creator_withdraw_nftCall__Outputs {
    return new Creator_withdraw_nftCall__Outputs(this);
  }
}

export class Creator_withdraw_nftCall__Inputs {
  _call: Creator_withdraw_nftCall;

  constructor(call: Creator_withdraw_nftCall) {
    this._call = call;
  }

  get matchId(): string {
    return this._call.inputValues[0].value.toString();
  }

  get tokenIndex(): BigInt {
    return this._call.inputValues[1].value.toBigInt();
  }
}

export class Creator_withdraw_nftCall__Outputs {
  _call: Creator_withdraw_nftCall;

  constructor(call: Creator_withdraw_nftCall) {
    this._call = call;
  }
}

export class Creator_withdraw_profitCall extends ethereum.Call {
  get inputs(): Creator_withdraw_profitCall__Inputs {
    return new Creator_withdraw_profitCall__Inputs(this);
  }

  get outputs(): Creator_withdraw_profitCall__Outputs {
    return new Creator_withdraw_profitCall__Outputs(this);
  }
}

export class Creator_withdraw_profitCall__Inputs {
  _call: Creator_withdraw_profitCall;

  constructor(call: Creator_withdraw_profitCall) {
    this._call = call;
  }

  get payTokenName(): string {
    return this._call.inputValues[0].value.toString();
  }
}

export class Creator_withdraw_profitCall__Outputs {
  _call: Creator_withdraw_profitCall;

  constructor(call: Creator_withdraw_profitCall) {
    this._call = call;
  }
}