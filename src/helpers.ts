import { BigInt, BigDecimal, Address } from "@graphprotocol/graph-ts";
import { DayData, Wallet } from "../generated/schema";

export let ZERO_BI = BigInt.fromI32(0);
export let ONE_BI = BigInt.fromI32(1);
export let ZERO_BD = BigDecimal.fromString("0");
export let ONE_BD = BigDecimal.fromString("1");
export let BI_18 = BigInt.fromI32(18);

export function fetchWallet(tokenAddress: Address): Wallet {
  let wallet = Wallet.load(tokenAddress.toString());

  if (wallet == null) {
    wallet = new Wallet(tokenAddress.toString());
    wallet.balance = ZERO_BI;
    wallet.txCount = ZERO_BI;
    wallet.save();
  }

  return wallet;
}

export function fetchDayData(dayID: number): DayData {
  let dayStartTimestamp = dayID * 86400;

  let dayData = DayData.load(dayID.toString());
  if (dayData === null) {
    dayData = new DayData(dayID.toString());
    dayData.date = dayStartTimestamp;
    dayData.walletCount = ZERO_BI;
    dayData.txCount = ZERO_BI;
    dayData.save();
  }

  return dayData;
}
