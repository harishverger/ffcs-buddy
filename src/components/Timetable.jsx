import React, { useRef, useState } from "react";
import { toPng } from "html-to-image";
import { TIMETABLE } from "../data/timetableData";
import { hasClash } from "../utils/clashchecker";
import ClashAlert from "./ClashAlert";

/* ===== OFFICIAL FFCS TIMINGS ===== */

const THEORY_START = [
  "08:00","09:00","09:01","10:00","10:01",
  "11:00","11:01","12:00","12:01","13:00",
  "Lunch",
  "14:00","14:01","15:00","15:01",
  "16:00","16:01","17:00","17:01",
  "18:00","19:00"
];

const THEORY_END = [
  "08:50","09:50","09:51","10:50","10:51",
  "11:50","11:51","12:50","12:51","13:50",
  "Lunch",
  "14:50","14:51","15:50","15:51",
  "16:50","16:51","17:50","17:51",
  "18:50","19:30"
];

const LAB_START = [
  "08:00","09:00","09:01","09:50","09:51",
  "11:00","11:01","11:50","11:51","12:40",
  "Lunch",
  "14:00","14:01","14:50","14:51",
  "16:00","16:01","16:50","16:51",
  "18:00","18:50"
];

const LAB_END = [
  "08:50","09:50","09:51","10:40","10:41",
  "11:50","11:51","12:40","12:41","13:30",
  "Lunch",
  "14:50","14:51","15:40","15:41",
  "16:50","16:51","17:40","17:41",
  "18:50","19:30"
];

export default function Timetable({
  selectedSlots = [],
  onToggleSlots = () => {},
  onReset = () => {},
  quickSelectEnabled = false,
  onToggleQuickSelect = () => {}
}) {
  const tableRef = useRef(null);
  const [clashMessage, setClashMessage] = useState("");

  const handleDownload = async () => {
    if (!tableRef.current) return;

    try {
      const url = await toPng(tableRef.current, {
        cacheBust: true,
        pixelRatio: 2
      });

      const anchor = document.createElement("a");
      anchor.href = url;
      anchor.download = "ffcs-timetable.png";
      anchor.click();
    } catch (err) {
      console.error("Failed to export timetable", err);
      alert("Could not download timetable. Please try again.");
    }
  };

  /**
   * ✅ FINAL FFCS SELECTION LOGIC
   * Works when selectedSlots contains:
   *  - "A1"
   *  - { slot: "A1" }
   *  - mixed arrays
   */
  const isSelected = (cell) => {
    if (!cell || cell === "-" || cell === "--" || cell === "Lunch") {
      return false;
    }

    // Convert cell to plain text
    let text = "";
    if (Array.isArray(cell)) {
      text = cell.map(c => String(c)).join(" ");
    } else {
      text = String(cell);
    }

    text = text.toUpperCase();

    // Extract slot tokens (A1, TA1, TAA1, B2, etc.)
    const tokens = text.match(/[A-Z]{1,3}\d{1,2}/g) || [];

    // Match against selectedSlots (string OR object)
    return tokens.some(token =>
      selectedSlots.some(s =>
        typeof s === "string"
          ? s === token
          : s?.slot === token
      )
    );
  };

  const extractTokens = (cell) => {
    if (!cell || cell === "Lunch" || cell === "-" || cell === "--") return [];

    let text = "";
    if (Array.isArray(cell)) {
      text = cell.map(c => String(c)).join(" ");
    } else {
      text = String(cell);
    }

    return (text.toUpperCase().match(/[A-Z]{1,3}\d{1,2}/g) || []);
  };

  const handleSlotClick = (tokens) => {
    if (!tokens || tokens.length === 0) return;

    // Check if any token in the clicked cell is already selected
    const hasSelectedToken = tokens.some(token =>
      selectedSlots.some(s => {
        const selected = typeof s === "string" ? s.toUpperCase() : s?.slot?.toUpperCase();
        return selected === token.toUpperCase();
      })
    );

    // If deselecting (any token is already selected), allow it
    if (hasSelectedToken) {
      onToggleSlots(tokens);
      return;
    }

    // If selecting new slots, check for clashes
    for (const token of tokens) {
      if (hasClash(selectedSlots, token)) {
        setClashMessage(`Slot "${token}" clashes with an already selected slot on the same day and time.\n\nPlease deselect the conflicting slot first.`);
        return;
      }
    }

    // No clashes, proceed with selection
    onToggleSlots(tokens);
  };

  const normalizeSlot = s => (typeof s === "string" ? s : s?.slot)?.toUpperCase();
  const normalizedSelected = selectedSlots
    .map(normalizeSlot)
    .filter(Boolean);

  const classifyTokens = tokens => {
    const unique = Array.from(new Set(tokens));
    const selected = [];
    const free = [];
    const blocked = [];

    unique.forEach(tok => {
      if (normalizedSelected.includes(tok)) {
        selected.push(tok);
      } else if (hasClash(normalizedSelected, tok)) {
        blocked.push(tok);
      } else {
        free.push(tok);
      }
    });

    return { free, blocked, selected };
  };

  const availability = Object.entries(TIMETABLE).map(([day, rows]) => {
    const theoryTokens = rows.THEORY.flatMap(extractTokens).filter(Boolean);
    const labTokens = rows.LAB.flatMap(extractTokens).filter(Boolean);

    return {
      day,
      theory: classifyTokens(theoryTokens),
      lab: classifyTokens(labTokens)
    };
  });

  return (
    <div className="timetable-wrapper">
      <div className="timetable-actions">
        <button
          className={quickSelectEnabled ? "quick-btn active" : "quick-btn"}
          onClick={onToggleQuickSelect}
          aria-pressed={quickSelectEnabled}
        >
          {quickSelectEnabled ? "Quick Select: On" : "Quick Select: Off"}
        </button>
        <button className="reset-btn" onClick={onReset}>
          <span className="btn-icon" aria-hidden="true">⟳</span>
          Reset Table
        </button>
        <button className="download-btn" onClick={handleDownload}>
          <span className="btn-icon" aria-hidden="true">⇩</span>
          Download Timetable
        </button>
      </div>

      <div className="timetable-container">
        <table ref={tableRef} className="timetable">
          <thead>
            {/* ===== THEORY HEADER ===== */}
            <tr>
              <th rowSpan={2}>THEORY</th>
              <th>Start</th>
              {THEORY_START.map((t, i) => <th key={i}>{t}</th>)}
            </tr>
            <tr>
              <th>End</th>
              {THEORY_END.map((t, i) => <th key={i}>{t}</th>)}
            </tr>

            {/* ===== LAB HEADER ===== */}
            <tr>
              <th rowSpan={2}>LAB</th>
              <th>Start</th>
              {LAB_START.map((t, i) => <th key={i}>{t}</th>)}
            </tr>
            <tr>
              <th>End</th>
              {LAB_END.map((t, i) => <th key={i}>{t}</th>)}
            </tr>
          </thead>

          <tbody>
          {Object.entries(TIMETABLE).map(([day, rows]) => (
            <React.Fragment key={day}>
              {/* ===== THEORY ROW ===== */}
              <tr>
                <td rowSpan={2} className="day-cell">{day}</td>
                <td className="type-cell">THEORY</td>

                {rows.THEORY.map((cell, i) => {
                  const tokens = extractTokens(cell);
                  const isLunch = cell === "Lunch";
                  const isHit = isSelected(cell);

                  const canSelect = quickSelectEnabled && tokens.length;

                  return (
                    <td
                      key={i}
                      className={
                        isLunch
                          ? "lunch-cell"
                          : isHit
                          ? canSelect
                            ? "selected selectable"
                            : "selected"
                          : tokens.length
                          ? canSelect
                            ? "slot selectable"
                            : "slot"
                          : "slot"
                      }
                      onClick={canSelect ? () => handleSlotClick(tokens) : undefined}
                    >
                      {cell}
                    </td>
                  );
                })}
              </tr>

              {/* ===== LAB ROW ===== */}
              <tr>
                <td className="type-cell">LAB</td>

                {rows.LAB.map((cell, i) => {
                  const tokens = extractTokens(cell);
                  const isLunch = cell === "Lunch";
                  const isHit = isSelected(cell);

                  const canSelect = quickSelectEnabled && tokens.length;

                  return (
                    <td
                      key={i}
                      className={
                        isLunch
                          ? "lunch-cell"
                          : isHit
                          ? canSelect
                            ? "selected lab selectable"
                            : "selected lab"
                          : tokens.length
                          ? canSelect
                            ? "slot lab-slot selectable"
                            : "slot lab-slot"
                          : "slot lab-slot"
                      }
                      onClick={canSelect ? () => handleSlotClick(tokens) : undefined}
                    >
                      {cell}
                    </td>
                  );
                })}
              </tr>
            </React.Fragment>
          ))}
        </tbody>
      </table>
      </div>

      <div className="availability-panel">
        <div className="availability-header">
          <h4>Slot Availability</h4>
          <div className="availability-legend">
            <span className="chip free">Free</span>
            <span className="chip clash">Clashes</span>
            <span className="chip selected">Selected</span>
          </div>
        </div>
        <div className="availability-grid availability-inline">
          {availability.map(({ day, theory, lab }) => (
            <div className="availability-card" key={day}>
              <div className="availability-day">{day}</div>

              <div className="availability-section">
                <div className="availability-section-title">Theory</div>
                <div className="availability-row">
                  <span className="availability-label">Free</span>
                  <div className="availability-chips">
                    {theory.free.length ? theory.free.map(tok => (
                      <span className="chip free" key={`t-free-${tok}`}>{tok}</span>
                    )) : <span className="muted">None</span>}
                  </div>
                </div>
                <div className="availability-row">
                  <span className="availability-label">Clashing</span>
                  <div className="availability-chips">
                    {theory.blocked.length ? theory.blocked.map(tok => (
                      <span className="chip clash" key={`t-clash-${tok}`}>{tok}</span>
                    )) : <span className="muted">None</span>}
                  </div>
                </div>
                <div className="availability-row">
                  <span className="availability-label">Selected</span>
                  <div className="availability-chips">
                    {theory.selected.length ? theory.selected.map(tok => (
                      <span className="chip selected" key={`t-sel-${tok}`}>{tok}</span>
                    )) : <span className="muted">None</span>}
                  </div>
                </div>
              </div>

              <div className="availability-section">
                <div className="availability-section-title">Lab</div>
                <div className="availability-row">
                  <span className="availability-label">Free</span>
                  <div className="availability-chips">
                    {lab.free.length ? lab.free.map(tok => (
                      <span className="chip free" key={`l-free-${tok}`}>{tok}</span>
                    )) : <span className="muted">None</span>}
                  </div>
                </div>
                <div className="availability-row">
                  <span className="availability-label">Clashing</span>
                  <div className="availability-chips">
                    {lab.blocked.length ? lab.blocked.map(tok => (
                      <span className="chip clash" key={`l-clash-${tok}`}>{tok}</span>
                    )) : <span className="muted">None</span>}
                  </div>
                </div>
                <div className="availability-row">
                  <span className="availability-label">Selected</span>
                  <div className="availability-chips">
                    {lab.selected.length ? lab.selected.map(tok => (
                      <span className="chip selected" key={`l-sel-${tok}`}>{tok}</span>
                    )) : <span className="muted">None</span>}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <ClashAlert 
        message={clashMessage} 
        onClose={() => setClashMessage("")} 
      />
    </div>
  );
}
