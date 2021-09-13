import { store, Bytes, BigInt } from "@graphprotocol/graph-ts"
import {
  UniArtsNFT,
  Approval,
  ApprovalForAll,
  RoleAdminChanged,
  RoleGranted,
  RoleRevoked,
  Transfer
} from "../generated/UniArtsNFT/UniArtsNFT"
import { ExampleEntity } from "../generated/schema"
import { Token, TokenContract, Owner, All, OwnerPerTokenContract, TokenTransaction } from '../generated/schema'

let zeroAddress = '0x0000000000000000000000000000000000000000';

function toBytes(hexString: String): Bytes {
    let result = new Uint8Array(hexString.length/2);
    for (let i = 0; i < hexString.length; i += 2) {
        result[i/2] = parseInt(hexString.substr(i, 2), 16) as u32;
    }
    return result as Bytes;
}

function supportsInterface(contract: UniArtsNFT, interfaceId: String, expected : boolean = true) : boolean {
    let supports = contract.try_supportsInterface(toBytes(interfaceId));
    return !supports.reverted && supports.value == expected;
}

function setCharAt(str: string, index: i32, char: string): string {
    if(index > str.length-1) return str;
    return str.substr(0,index) + char + str.substr(index+1);
}

function normalize(strValue: string): string {
    if (strValue.length === 1 && strValue.charCodeAt(0) === 0) {
        return "";    
    } else {
        for (let i = 0; i < strValue.length; i++) {
            if (strValue.charCodeAt(i) === 0) {
                strValue = setCharAt(strValue, i, '\ufffd'); // graph-node db does not support string with '\u0000'
            }
        }
        return strValue;
    }
}

export function handleApproval(event: Approval): void {
  // Entities can be loaded from the store using a string ID; this ID
  // needs to be unique across all entities of the same type
  let entity = ExampleEntity.load(event.transaction.from.toHex())

  // Entities only exist after they have been saved to the store;
  // `null` checks allow to create entities on demand
  if (entity == null) {
    entity = new ExampleEntity(event.transaction.from.toHex())

    // Entity fields can be set using simple assignments
    entity.count = BigInt.fromI32(0)
  }

  // BigInt and BigDecimal math are supported
  entity.count = entity.count + BigInt.fromI32(1)

  // Entity fields can be set based on event parameters
  entity.owner = event.params.owner
  entity.approved = event.params.approved

  // Entities can be written to the store with `.save()`
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
  // - contract.DEFAULT_ADMIN_ROLE(...)
  // - contract.MINTER_ROLE(...)
  // - contract.balanceOf(...)
  // - contract.getApproved(...)
  // - contract.getRoleAdmin(...)
  // - contract.hasRole(...)
  // - contract.isApprovedForAll(...)
  // - contract.name(...)
  // - contract.ownerOf(...)
  // - contract.symbol(...)
  // - contract.tokenByIndex(...)
  // - contract.tokenOfOwnerByIndex(...)
  // - contract.tokenURI(...)
  // - contract.token_infos(...)
  // - contract.totalSupply(...)
  // - contract.baseURI(...)
  // - contract.getNFT(...)
  // - contract.supportsInterface(...)
}

export function handleApprovalForAll(event: ApprovalForAll): void {}

export function handleRoleAdminChanged(event: RoleAdminChanged): void {}

export function handleRoleGranted(event: RoleGranted): void {}

export function handleRoleRevoked(event: RoleRevoked): void {}

export function handleTransfer(event: Transfer): void {
  let tokenId = event.params.tokenId;
  let id = event.address.toHex() + '_' + tokenId.toString();
  let contractId = event.address.toHex();
  let from = event.params.from.toHex();
  let to = event.params.to.toHex();
  let tx_hash = event.transaction.hash.toHex();

  let all = All.load('all');
  if (all == null) {
      all = new All('all');
      all.numOwners = BigInt.fromI32(0);
      all.numTokens = BigInt.fromI32(0);
      all.numTokenContracts = BigInt.fromI32(0);
  }

  // TokenTransaction
  let transaction = new TokenTransaction(tx_hash);
  transaction.token_id = tokenId;
  transaction.tx_hash = tx_hash;
  transaction.save();
  
  let contract = UniArtsNFT.bind(event.address);
  let tokenContract = TokenContract.load(contractId);
  if(tokenContract == null) {
      // log.error('contract : {}',[event.address.toHexString()]);
      let supportsEIP165Identifier = supportsInterface(contract, '01ffc9a7');
      let supportsEIP721Identifier = supportsInterface(contract, '80ac58cd');
      let supportsNullIdentifierFalse = supportsInterface(contract, '00000000', false);
      let supportsEIP721 = supportsEIP165Identifier && supportsEIP721Identifier && supportsNullIdentifierFalse;

      let supportsEIP721Metadata = false;
      if(supportsEIP721) {
          supportsEIP721Metadata = supportsInterface(contract, '5b5e139f');
          // log.error('NEW CONTRACT eip721Metadata for {} : {}', [event.address.toHex(), supportsEIP721Metadata ? 'true' : 'false']);
      }
      if (supportsEIP721) {
          tokenContract = new TokenContract(contractId);
          tokenContract.doAllAddressesOwnTheirIdByDefault = false;
          tokenContract.supportsEIP721Metadata = supportsEIP721Metadata;
          tokenContract.numTokens = BigInt.fromI32(0);
          tokenContract.numOwners = BigInt.fromI32(0);
          let name = contract.try_name();
          if(!name.reverted) {
              tokenContract.name = normalize(name.value);
          }
          let symbol = contract.try_symbol();
          if(!symbol.reverted) {
              tokenContract.symbol = normalize(symbol.value);
          }
      } else {
          return;
      }
      all.numTokenContracts = all.numTokenContracts.plus(BigInt.fromI32(1));
  }

  if (from != zeroAddress || to != zeroAddress) { // skip if from zero to zero

      if (from != zeroAddress) { // existing token
          let currentOwnerPerTokenContractId = contractId + '_' + from;
          let currentOwnerPerTokenContract = OwnerPerTokenContract.load(currentOwnerPerTokenContractId);
          if (currentOwnerPerTokenContract != null) {
              if (currentOwnerPerTokenContract.numTokens.equals(BigInt.fromI32(1))) {
                  tokenContract.numOwners = tokenContract.numOwners.minus(BigInt.fromI32(1));
              }
              currentOwnerPerTokenContract.numTokens = currentOwnerPerTokenContract.numTokens.minus(BigInt.fromI32(1));
              currentOwnerPerTokenContract.save();
          }

          let currentOwner = Owner.load(from);
          if (currentOwner != null) {
              if (currentOwner.numTokens.equals(BigInt.fromI32(1))) {
                  all.numOwners = all.numOwners.minus(BigInt.fromI32(1));
              }
              currentOwner.numTokens = currentOwner.numTokens.minus(BigInt.fromI32(1));
              currentOwner.save();
          }
      } // else minting
      
      
      if(to != zeroAddress) { // transfer
          let newOwner = Owner.load(to);
          if (newOwner == null) {
              newOwner = new Owner(to);
              newOwner.numTokens = BigInt.fromI32(0);
          }

          let eip721Token = Token.load(id);
          if(eip721Token == null) {
              eip721Token = new Token(id);
              eip721Token.contract = tokenContract.id;
              eip721Token.tokenID = tokenId;
              eip721Token.mintTime = event.block.timestamp;
              if (tokenContract.supportsEIP721Metadata) {
                  let metadataURI = contract.try_tokenURI(tokenId);
                  if(!metadataURI.reverted) {
                      eip721Token.tokenURI = normalize(metadataURI.value);
                  } else {
                      eip721Token.tokenURI = "";
                  }
              } else {
                  // log.error('tokenURI not supported {}', [tokenContract.id]);
                  eip721Token.tokenURI = ""; // TODO null ?
              }
          }
          
          if (from == zeroAddress) { // mint +1
              all.numTokens = all.numTokens.plus(BigInt.fromI32(1));
          }
          
          eip721Token.owner = newOwner.id;
          eip721Token.save();

          if (newOwner.numTokens.equals(BigInt.fromI32(0))) {
              all.numOwners = all.numOwners.plus(BigInt.fromI32(1));
          }
          newOwner.numTokens = newOwner.numTokens.plus(BigInt.fromI32(1));
          newOwner.save();

          let newOwnerPerTokenContractId = contractId + '_' + to;
          let newOwnerPerTokenContract = OwnerPerTokenContract.load(newOwnerPerTokenContractId);
          if (newOwnerPerTokenContract == null) {
              newOwnerPerTokenContract = new OwnerPerTokenContract(newOwnerPerTokenContractId);
              newOwnerPerTokenContract.owner = newOwner.id;
              newOwnerPerTokenContract.contract = tokenContract.id;
              newOwnerPerTokenContract.numTokens = BigInt.fromI32(0);
          }

          if (newOwnerPerTokenContract.numTokens.equals(BigInt.fromI32(0))) {
              tokenContract.numOwners = tokenContract.numOwners.plus(BigInt.fromI32(1));
          }
          newOwnerPerTokenContract.numTokens = newOwnerPerTokenContract.numTokens.plus(BigInt.fromI32(1));
          newOwnerPerTokenContract.save();

          tokenContract.numTokens = tokenContract.numTokens.plus(BigInt.fromI32(1));
      } else { // burn
          store.remove('Token', id);
          all.numTokens = all.numTokens.minus(BigInt.fromI32(1));
          tokenContract.numTokens = tokenContract.numTokens.minus(BigInt.fromI32(1));
      }
  }
  tokenContract.save();
  all.save();
}
