import { SLOT_TIME_MAP } from "../data/slotTimeMap";
import { TIMETABLE } from "../data/timetableData";

/**
 * Find which day(s) and position(s) a slot appears in the timetable
 * Returns array of {day, position, type} objects
 */
function findSlotPositions(slotToken) {
  const positions = [];
  
  for (const [day, rows] of Object.entries(TIMETABLE)) {
    // Check THEORY row
    rows.THEORY.forEach((cell, index) => {
      if (cell && cell.toUpperCase().includes(slotToken)) {
        positions.push({ day, position: index, type: 'THEORY' });
      }
    });
    
    // Check LAB row
    rows.LAB.forEach((cell, index) => {
      if (cell && cell.toUpperCase().includes(slotToken)) {
        positions.push({ day, position: index, type: 'LAB' });
      }
    });
  }
  
  return positions;
}

/**
 * Check if two slot tokens clash
 * Clash if they appear on the same day at the same position (column)
 */
export function doSlotsClash(slot1, slot2) {
  if (slot1 === slot2) return false; // Same slot
  
  const positions1 = findSlotPositions(slot1);
  const positions2 = findSlotPositions(slot2);
  
  // Check if any positions overlap (same day and same column index)
  for (const pos1 of positions1) {
    for (const pos2 of positions2) {
      // If same day and same position (time column), they clash
      if (pos1.day === pos2.day && pos1.position === pos2.position) {
        return true;
      }
    }
  }
  
  // Fallback to time-based check if slots are in SLOT_TIME_MAP
  const time1 = SLOT_TIME_MAP[slot1];
  const time2 = SLOT_TIME_MAP[slot2];
  
  if (time1 && time2) {
    // Check if they share any common day
    const days1 = positions1.map(p => p.day);
    const days2 = positions2.map(p => p.day);
    const commonDays = days1.filter(day => days2.includes(day));
    
    if (commonDays.length > 0) {
      // Time ranges overlap if start1 < end2 AND start2 < end1
      return time1.start < time2.end && time2.start < time1.end;
    }
  }
  
  return false;
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
