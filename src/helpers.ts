import { BigInt, Address } from "@graphprotocol/graph-ts";
import { DayData, MasterData, Wallet } from "../generated/schema";

export let ZERO_BI = BigInt.fromI32(0);
export let ONE_BI = BigInt.fromI32(1);
export let BI_18 = BigInt.fromI32(18);
export let EXP_18 = BigInt.fromString("1000000000000000000");

export function fetchMasterData(contract: string): MasterData | null {
  let data = MasterData.load(contract);

  if (data == null) {
    data = new MasterData(contract);
    data.txCount = ZERO_BI;
    data.walletCount = ZERO_BI;
    data.save();
    return data;
  }

  return data;
}

export function fetchWallet(
  tokenAddress: Address,
  contract: string
): Wallet | null {
  const id = `${tokenAddress.toString()}:${contract}`;

  let wallet = Wallet.load(id);

  if (wallet == null) {
    wallet = new Wallet(id);
    wallet.balance = ZERO_BI;
    wallet.txCount = ZERO_BI;
    wallet.contract = contract;
    wallet.address = tokenAddress.toHexString();
    wallet.save();
    return wallet;
  }

  return wallet;
}

export function fetchDayData(dayID: number, contract: string): DayData | null {
  const id = `${dayID.toString()}:${contract}`;
  let dayData = DayData.load(id);

  if (dayData === null) {
    let dayStartTimestamp = BigInt.fromI32((dayID * 86400) as i32);

    dayData = new DayData(id);
    dayData.date = dayStartTimestamp;
    dayData.walletCount = ZERO_BI;
    dayData.txCount = ZERO_BI;
    dayData.contract = contract;
    dayData.save();
    return dayData;
  }

  return dayData;
}
