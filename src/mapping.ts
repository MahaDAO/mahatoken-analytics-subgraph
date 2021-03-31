import { Transfer } from "../generated/MahaDAO/MahaDAO";
import {
  EXP_18,
  fetchDayData,
  fetchFinalData,
  ZERO_BI,
  fetchWallet,
  ONE_BI,
} from "./helpers";

export function handleTransfer(event: Transfer): void {
  let timestamp = event.block.timestamp.toI32();
  let dayID = timestamp / 86400;

  const finalData = fetchFinalData();
  const dayData = fetchDayData(dayID);

  // update balances
  const from = fetchWallet(event.params.from);
  const to = fetchWallet(event.params.to);
  const val = event.params.value;

  const beforeFromBalance = from.balance;
  const beforeToBalance = to.balance;

  from.txCount = from.txCount.plus(ONE_BI);
  to.txCount = to.txCount.plus(ONE_BI);

  if (from.balance.ge(val)) from.balance = from.balance.minus(val);
  to.balance = to.balance.plus(val);

  const afterFromBalance = from.balance;
  const afterToBalance = to.balance;

  const minBal = EXP_18;
  if (beforeFromBalance.le(minBal) && afterFromBalance.gt(minBal))
    finalData.walletCount = finalData.walletCount.plus(ONE_BI);

  if (beforeToBalance.le(minBal) && afterToBalance.gt(minBal))
    finalData.walletCount = finalData.walletCount.plus(ONE_BI);

  if (
    beforeFromBalance.gt(minBal) &&
    afterFromBalance.le(minBal) &&
    finalData.walletCount.notEqual(ZERO_BI)
  )
    finalData.walletCount = finalData.walletCount.minus(ONE_BI);

  if (
    beforeToBalance.gt(minBal) &&
    afterToBalance.le(minBal) &&
    finalData.walletCount.notEqual(ZERO_BI)
  )
    finalData.walletCount = finalData.walletCount.minus(ONE_BI);

  finalData.txCount = finalData.txCount.plus(ONE_BI);
  dayData.txCount = dayData.txCount.plus(ONE_BI);
  dayData.walletCount = finalData.walletCount;

  from.save();
  to.save();
  finalData.save();
  dayData.save();
}
