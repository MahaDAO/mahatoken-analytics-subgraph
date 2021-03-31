import { BigInt } from "@graphprotocol/graph-ts";
import { Approval, Transfer } from "../generated/MahaDAO/MahaDAO";
import { DayData, FinalData } from "../generated/schema";
import { fetchDayData, fetchWallet, ZERO_BD } from "./helpers";

export function handleApproval(event: Approval): void {}

export function handleTransfer(event: Transfer): void {
  let timestamp = event.block.timestamp.toI32();
  let dayID = timestamp / 86400;

  let finalData = FinalData.load("1");
  const dayData = fetchDayData(dayID);

  // update balances
  const from = fetchWallet(event.params.from);
  const to = fetchWallet(event.params.from);
  const val = event.params.value;

  from.txCount += 1;
  to.txCount += 1;

  if (from.balance.ge(val)) from.balance = from.balance.minus(val);
  to.balance = to.balance.plus(val);

  // from.balance = from.balance - val;
  // to.balance += val;

  dayData.walletCount += finalData.walletCount;
  dayData.txCount += 1;
  dayData.save();
}
