// SPDX-License-Identifier: GPL-3.0-only
// Copyright (C) 2026 Sihle Mpungose
// null means unknown. Zero is a real input, never a substitute for missing data.
export function numberOrNull(value) { return value === '' || value == null ? null : Number(value); }
export function petrolCost(returnKm, litresPer100Km, pricePerLitre) {
  const values = [returnKm, litresPer100Km, pricePerLitre];
  if (values.some(x => x == null)) return null;
  if (values.some(x => !Number.isFinite(x) || x < 0)) throw new Error('Petrol inputs must be non-negative numbers.');
  return returnKm / 100 * litresPer100Km * pricePerLitre;
}
export function evaluateCosts(job) {
  const n = key => numberOrNull(job[key]);
  const days = n('days');
  if (days != null && (!Number.isInteger(days) || days < 0 || days > 7)) throw new Error('Commuting days must be a whole number from 0 to 7.');
  let daily = null;
  if (job.transport === 'none') daily = 0;
  if (job.transport === 'fare') { const fare = n('fare'); daily = fare == null ? null : fare * (job.fareBasis === 'oneway' ? 2 : 1); }
  if (job.transport === 'car') daily = petrolCost(n('distance'), n('consumption'), n('fuelPrice'));
  const parking = n('parking'), tolls = n('tolls');
  const dailyTotal = [daily, parking, tolls].some(x => x == null) ? null : daily + parking + tolls;
  const weekly = dailyTotal == null || days == null ? null : dailyTotal * days;
  const fixed = n('fixed');
  const monthly = weekly == null || fixed == null ? null : weekly * 52 / 12 + fixed;
  const gross = n('salary'), deductions = n('deductions');
  const takeHome = gross == null || deductions == null ? null : gross - deductions;
  const remaining = takeHome == null || monthly == null ? null : takeHome - monthly;
  return {petrol: daily, daily: dailyTotal, weekly, monthly, gross, deductions, takeHome, remaining};
}
