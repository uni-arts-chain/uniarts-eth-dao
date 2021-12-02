import { ethereum, Address, BigInt } from "@graphprotocol/graph-ts"
import {
  UniArtsSouvenirs,
  ApprovalForAll as ApprovalForAllEvent,
	TransferBatch  as TransferBatchEvent,
	TransferSingle as TransferSingleEvent,
	URI            as URIEvent
} from "../generated/UniArtsSouvenirs/UniArtsSouvenirs"
import { MultiToken, MultiTokenRegistry, MultiTokenAccount, MultiTokenBalance, MultiTokenTransfer } from "../generated/schema"

function fetchToken(registry: MultiTokenRegistry, id: BigInt): MultiToken {
	let tokenid = registry.id.concat('-').concat(id.toHex())
	let token = MultiToken.load(tokenid)
	if (token == null) {
		token = new MultiToken(tokenid)
		token.registry    = registry.id
		token.identifier  = id
		token.totalSupply = constants.BIGINT_ZERO
	}
	return token as MultiToken
}

function fetchBalance(token: MultiToken, account: MultiTokenAccount): MultiTokenBalance {
	let balanceid = token.id.concat('-').concat(account.id)
	let balance = MultiTokenBalance.load(balanceid)
	if (balance == null) {
		balance = new MultiTokenBalance(balanceid)
		balance.token   = token.id
		balance.account = account.id
		balance.value   = constants.BIGINT_ZERO
	}
	return balance as MultiTokenBalance
}

function registerTransfer(
	event:    ethereum.Event,
	suffix:   String,
	registry: MultiTokenRegistry,
	operator: MultiTokenAccount,
	from:     MultiTokenAccount,
	to:       MultiTokenAccount,
	id:       BigInt,
	value:    BigInt)
: void
{
	let token = fetchToken(registry, id)
	let ev = new MultiTokenTransfer(events.id(event).concat(suffix))
	ev.transaction = transactions.log(event).id
	ev.timestamp   = event.block.timestamp
	ev.token       = token.id
	ev.operator    = operator.id
	ev.from        = from.id
	ev.to          = to.id
	ev.value       = value

	if (from.id == constants.ADDRESS_ZERO) {
		token.totalSupply = integers.increment(token.totalSupply, value)
	} else {
		let balance = fetchBalance(token, from)
		balance.value = integers.decrement(balance.value, value)
		balance.save()
		ev.fromBalance = balance.id
	}

	if (to.id == constants.ADDRESS_ZERO) {
		token.totalSupply = integers.decrement(token.totalSupply, value)
	} else {
		let balance = fetchBalance(token, to)
		balance.value = integers.increment(balance.value, value)
		balance.save()
		ev.toBalance = balance.id
	}

	token.save()
	ev.save()
}

export function handleApprovalForAll(event: ApprovalForAllEvent): void {
	// event.account
	// event.operator
	// event.approved
}

export function handleTransferSingle(event: TransferSingleEvent): void
{
	let registry = new MultiTokenRegistry(event.address.toHex())
	let operator = new MultiTokenAccount(event.params.operator.toHex())
	let from     = new MultiTokenAccount(event.params.from.toHex())
	let to       = new MultiTokenAccount(event.params.to.toHex())
	registry.save()
	operator.save()
	from.save()
	to.save()

	registerTransfer(
		event,
		"",
		registry,
		operator,
		from,
		to,
		event.params.id,
		event.params.value
	)
}

export function handleTransferBatch(event: TransferBatchEvent): void
{
	let registry = new MultiTokenRegistry(event.address.toHex())
	let operator = new MultiTokenAccount(event.params.operator.toHex())
	let from     = new MultiTokenAccount(event.params.from.toHex())
	let to       = new MultiTokenAccount(event.params.to.toHex())
	registry.save()
	operator.save()
	from.save()
	to.save()

	let ids    = event.params.ids
	let values = event.params.values
	for (let i = 0;  i < ids.length; ++i)
	{
		registerTransfer(
			event,
			"-".concat(i.toString()),
			registry,
			operator,
			from,
			to,
			ids[i],
			values[i]
		)
	}
}


export function handleURI(event: URIEvent): void
{
	let registry = new MultiTokenRegistry(event.address.toHex())
	registry.save()

	let token = fetchToken(registry, event.params.id)
	token.URI = event.params.value
	token.save()
}
