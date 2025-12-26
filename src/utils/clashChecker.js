import { SLOT_TIME_MAP } from "../data/slotTimeMap";
import { TIMETABLE, TIME_COLUMNS } from "../data/timetableData";

/**
 * Find which day(s) and position(s) a slot appears in the timetable
 * Returns array of {day, position, type} objects
 */
function findSlotPositions(slotToken) {
  const positions = [];
  const upperSlot = slotToken.toUpperCase();
  
  for (const [day, rows] of Object.entries(TIMETABLE)) {
    // Check THEORY row
    rows.THEORY.forEach((cell, index) => {
      if (cell) {
        // Extract exact tokens from the cell
        const cellText = String(cell).toUpperCase();
        const tokens = cellText.match(/[A-Z]{1,3}\d{1,2}/g) || [];
        
        if (tokens.includes(upperSlot)) {
          positions.push({ day, position: index, type: 'THEORY' });
        }
      }
    });
    
    // Check LAB row
    rows.LAB.forEach((cell, index) => {
      if (cell) {
        // Extract exact tokens from the cell
        const cellText = String(cell).toUpperCase();
        const tokens = cellText.match(/[A-Z]{1,3}\d{1,2}/g) || [];
        
        if (tokens.includes(upperSlot)) {
          positions.push({ day, position: index, type: 'LAB' });
        }
      }
    });
  }
  
  return positions;
}

// Convert timetable column index into a start/end minute range using TIME_COLUMNS
function positionToRange(position) {
  const startLabel = TIME_COLUMNS[position];

  if (!startLabel || startLabel === "LUNCH") return null;

  const toMinutes = (label) => {
    const [h, m] = label.split(":").map(Number);
    return h * 60 + m;
  };

  const start = toMinutes(startLabel);
  const end = start + 50; // treat every column as a 50-minute block to preserve column-based separation

  return { start, end };
}

/**
 * Check if two slot tokens clash
 * Clash if they appear on the same day at the same position (column)
 */
export function doSlotsClash(slot1, slot2) {
  const normalized1 = String(slot1).toUpperCase();
  const normalized2 = String(slot2).toUpperCase();

  // Same slot should always be treated as a clash to prevent duplicates
  if (normalized1 === normalized2) return true;
  
  const positions1 = findSlotPositions(normalized1);
  const positions2 = findSlotPositions(normalized2);

  // No positions found = slot doesn't exist in timetable, can't clash
  if (positions1.length === 0 || positions2.length === 0) {
    return false;
  }

  // Check if slots clash on same day
  for (const pos1 of positions1) {
    for (const pos2 of positions2) {
      if (pos1.day === pos2.day) {
        // Same position (column) = always clash
        if (pos1.position === pos2.position) {
          return true;
        }

        const range1 = positionToRange(pos1.position);
        const range2 = positionToRange(pos2.position);

        // Different positions but same day: clash if time ranges overlap on that day
        if (range1 && range2 && range1.start < range2.end && range2.start < range1.end) {
          return true;
        }
      }
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
