import { BigInt, Address } from "@graphprotocol/graph-ts";
import { DayData, FinalData, Wallet } from "../generated/schema";

export let ZERO_BI = BigInt.fromI32(0);
export let ONE_BI = BigInt.fromI32(1);
export let BI_18 = BigInt.fromI32(18);
export let EXP_18 = BigInt.fromString("1000000000000000000");

export function fetchFinalData(): FinalData | null {
  let data = FinalData.load("1");

  if (data == null) {
    data = new FinalData("1");
    data.txCount = ZERO_BI;
    data.walletCount = ZERO_BI;
    data.save();
    return data;
  }

  return data;
}

export function fetchWallet(tokenAddress: Address): Wallet | null {
  let wallet = Wallet.load(tokenAddress.toHexString());

  if (wallet == null) {
    wallet = new Wallet(tokenAddress.toHexString());
    wallet.balance = ZERO_BI;
    wallet.txCount = ZERO_BI;
    wallet.address = tokenAddress.toHexString();
    wallet.save();
    return wallet;
  }

  return wallet;
}

export function fetchDayData(dayID: number): DayData | null {
  let dayData = DayData.load(dayID.toString());

  if (dayData === null) {
    let dayStartTimestamp = BigInt.fromI32((dayID * 86400) as i32);

    dayData = new DayData(dayID.toString());
    dayData.date = dayStartTimestamp;
    dayData.walletCount = ZERO_BI;
    dayData.txCount = ZERO_BI;
    dayData.save();
    return dayData;
  }

  return dayData;
}
