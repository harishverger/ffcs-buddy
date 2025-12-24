import { SLOT_TIME_MAP } from "../data/slotTimeMap";
import { TIMETABLE } from "../data/timetableData";

/**
 * Find which day(s) a slot appears in the timetable
 */
function findSlotDays(slotToken) {
  const days = [];
  for (const [day, rows] of Object.entries(TIMETABLE)) {
    const allCells = [...rows.THEORY, ...rows.LAB];
    if (allCells.some(cell => cell.includes(slotToken))) {
      days.push(day);
    }
  }
  return days;
}

/**
 * Check if two slot tokens clash
 * Clash only if:
 *  - appear on the same day
 *  - overlapping time range
 */
export function doSlotsClash(slot1, slot2) {
  // Get days for both slots
  const days1 = findSlotDays(slot1);
  const days2 = findSlotDays(slot2);
  
  // Check if they share any common day
  const commonDays = days1.filter(day => days2.includes(day));
  if (commonDays.length === 0) return false;

  // Check time overlap
  const time1 = SLOT_TIME_MAP[slot1];
  const time2 = SLOT_TIME_MAP[slot2];

  if (!time1 || !time2) return false;

  // Time ranges overlap if start1 < end2 AND start2 < end1
  return time1.start < time2.end && time2.start < time1.end;
}

/**
 * Check if incoming slot clashes with any selected slot
 */
export function hasClash(selectedSlots, incomingSlot) {
  return selectedSlots.some(existingSlot =>
    doSlotsClash(existingSlot, incomingSlot)
  );
}

/**
 * Legacy functions for backward compatibility
 */
export function isSlotClashing(existing, incoming) {
  if (existing.day !== incoming.day) return false;

  const a = SLOT_TIME_MAP[existing.slot];
  const b = SLOT_TIME_MAP[incoming.slot];

  if (!a || !b) return false;

  return a.start < b.end && b.start < a.end;
}
