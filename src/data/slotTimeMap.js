// slotTimeMap.js
// Format: SLOT : { start: minutes, end: minutes }

const t = (h, m) => h * 60 + m;

export const SLOT_TIME_MAP = {
  // THEORY
  A1: { start: t(8, 0), end: t(8, 50) },
  B1: { start: t(9, 0), end: t(9, 50) },
  C1: { start: t(9, 1), end: t(9, 51) },
  D1: { start: t(10, 0), end: t(10, 50) },
  E1: { start: t(10, 1), end: t(10, 51) },
  F1: { start: t(11, 0), end: t(11, 50) },
  G1: { start: t(11, 1), end: t(11, 51) },

  A2: { start: t(14, 0), end: t(14, 50) },
  B2: { start: t(15, 0), end: t(15, 50) },
  C2: { start: t(15, 1), end: t(15, 51) },
  D2: { start: t(16, 0), end: t(16, 50) },
  E2: { start: t(16, 1), end: t(16, 51) },
  F2: { start: t(17, 0), end: t(17, 50) },
  G2: { start: t(17, 1), end: t(17, 51) },

  // TUTORIAL SLOTS (same times as primary slots)
  TA1: { start: t(8, 0), end: t(8, 50) },
  TB1: { start: t(9, 0), end: t(9, 50) },
  TC1: { start: t(9, 1), end: t(9, 51) },
  TD1: { start: t(10, 0), end: t(10, 50) },
  TE1: { start: t(10, 1), end: t(10, 51) },
  TF1: { start: t(11, 0), end: t(11, 50) },
  TG1: { start: t(11, 1), end: t(11, 51) },

  TA2: { start: t(14, 0), end: t(14, 50) },
  TB2: { start: t(15, 0), end: t(15, 50) },
  TC2: { start: t(15, 1), end: t(15, 51) },
  TD2: { start: t(16, 0), end: t(16, 50) },
  TE2: { start: t(16, 1), end: t(16, 51) },
  TF2: { start: t(17, 0), end: t(17, 50) },
  TG2: { start: t(17, 1), end: t(17, 51) },

  // ALTERNATIVE TUTORIAL SLOTS
  TAA1: { start: t(8, 0), end: t(8, 50) },
  TBB1: { start: t(9, 0), end: t(9, 50) },
  TCC1: { start: t(9, 1), end: t(9, 51) },
  TDD1: { start: t(10, 0), end: t(10, 50) },
  TEE1: { start: t(10, 1), end: t(10, 51) },
  TFF1: { start: t(11, 0), end: t(11, 50) },
  TGG1: { start: t(11, 1), end: t(11, 51) },

  TAA2: { start: t(14, 0), end: t(14, 50) },
  TBB2: { start: t(15, 0), end: t(15, 50) },
  TCC2: { start: t(15, 1), end: t(15, 51) },
  TDD2: { start: t(16, 0), end: t(16, 50) },
  TEE2: { start: t(16, 1), end: t(16, 51) },
  TFF2: { start: t(17, 0), end: t(17, 50) },
  TGG2: { start: t(17, 1), end: t(17, 51) },

  // SPECIAL SLOTS (tutorial variations)
  SC1: { start: t(9, 1), end: t(9, 51) },
  SC2: { start: t(15, 1), end: t(15, 51) },
  SD1: { start: t(10, 0), end: t(10, 50) },
  SD2: { start: t(16, 0), end: t(16, 50) },
  SE1: { start: t(10, 1), end: t(10, 51) },
  SE2: { start: t(16, 1), end: t(16, 51) },

  // LAB
  L1: { start: t(8, 0), end: t(8, 50) },
  L2: { start: t(9, 0), end: t(9, 50) },
  L3: { start: t(9, 51), end: t(10, 40) },
  L4: { start: t(10, 41), end: t(11, 30) },
  L5: { start: t(11, 40), end: t(12, 30) },

  L31: { start: t(14, 0), end: t(14, 50) },
  L32: { start: t(14, 51), end: t(15, 40) },
  L33: { start: t(15, 41), end: t(16, 30) },
};
