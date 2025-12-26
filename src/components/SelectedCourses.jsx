import React, { useState } from "react";
import { TIMETABLE, TIME_COLUMNS } from "../data/timetableData";
import ShareModal from "./ShareModal";

export default function SelectedCourses({
  courses,
  manualSlots = [],
  onRemove,
  savedPlans = [],
  onSavePlan = () => {},
  onLoadPlan = () => {},
  onDeletePlan = () => {},
}) {
  const [planName, setPlanName] = useState("");
  const [selectedPlanId, setSelectedPlanId] = useState("");
  const [showShareModal, setShowShareModal] = useState(false);
  const totalCredits = courses.reduce(
    (sum, c) => sum + Number(c.credit || 0),
    0
  );

  const creditWarning = totalCredits >= 27;

  if (courses.length === 0) return null;

  const encodePlan = () => {
    const payload = {
      courses,
      manualSlots,
    };
    try {
      const json = JSON.stringify(payload);
      return window.btoa(unescape(encodeURIComponent(json)));
    } catch (e) {
      return "";
    }
  };

  const findSlotPositions = (slotToken) => {
    const positions = [];
    const upperSlot = slotToken.toUpperCase();
    for (const [day, rows] of Object.entries(TIMETABLE)) {
      rows.THEORY.forEach((cell, index) => {
        if (cell) {
          const tokens = String(cell).toUpperCase().match(/[A-Z]{1,3}\d{1,2}/g) || [];
          if (tokens.includes(upperSlot)) positions.push({ day, position: index });
        }
      });
      rows.LAB.forEach((cell, index) => {
        if (cell) {
          const tokens = String(cell).toUpperCase().match(/[A-Z]{1,3}\d{1,2}/g) || [];
          if (tokens.includes(upperSlot)) positions.push({ day, position: index });
        }
      });
    }
    return positions;
  };

  const nextDateForDay = (dayCode) => {
    const map = { SUN: 0, MON: 1, TUE: 2, WED: 3, THU: 4, FRI: 5, SAT: 6 };
    const target = map[dayCode] ?? 1;
    const now = new Date();
    const d = new Date(now);
    const diff = (target + 7 - d.getDay()) % 7 || 7;
    d.setDate(d.getDate() + diff);
    d.setHours(0, 0, 0, 0);
    return d;
  };

  const formatDateTime = (date) => {
    const pad = (n) => String(n).padStart(2, "0");
    return `${date.getFullYear()}${pad(date.getMonth() + 1)}${pad(date.getDate())}T${pad(date.getHours())}${pad(date.getMinutes())}00`;
  };

  const exportIcs = () => {
    if (!courses.length) return;

    const events = [];
    const stamp = formatDateTime(new Date());

    const addEvent = (slot, label) => {
      const positions = findSlotPositions(slot);
      positions.forEach(({ day, position }) => {
        const startLabel = TIME_COLUMNS[position];
        const endLabel = TIME_COLUMNS[position + 1] || startLabel;
        if (!startLabel || startLabel === "LUNCH") return;

        const [sh, sm] = startLabel.split(":").map(Number);
        const [eh, em] = endLabel === "LUNCH" ? [sh, sm + 50] : endLabel.split(":").map(Number);

        const startDate = nextDateForDay(day);
        startDate.setHours(sh, sm, 0, 0);
        const endDate = nextDateForDay(day);
        endDate.setHours(eh, em, 0, 0);

        events.push({ label, start: startDate, end: endDate });
      });
    };

    courses.forEach((c) => {
      const label = `${c.code} – ${c.name}`;
      (c.slots || []).forEach((slot) => addEvent(slot, label));
    });

    if (!events.length) return;

    const icsLines = [
      "BEGIN:VCALENDAR",
      "VERSION:2.0",
      "PRODID:-//FFCS Planner//EN",
    ];

    events.forEach((ev, idx) => {
      icsLines.push(
        "BEGIN:VEVENT",
        `UID:${idx}@ffcs-planner`,
        `DTSTAMP:${stamp}`,
        `DTSTART:${formatDateTime(ev.start)}`,
        `DTEND:${formatDateTime(ev.end)}`,
        `SUMMARY:${ev.label}`,
        "END:VEVENT"
      );
    });

    icsLines.push("END:VCALENDAR");

    const blob = new Blob([icsLines.join("\r\n")], { type: "text/calendar" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "ffcs-plan.ics";
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleSavePlan = () => {
    if (onSavePlan(planName)) {
      setPlanName("");
    } else {
      alert("Enter a name to save this plan.");
    }
  };

  return (
    <div className="selected-courses">
      <div className="plan-actions">
        <div className="plan-actions-left">
          <input
            className="plan-input"
            value={planName}
            placeholder="Plan name (e.g., Plan A)"
            onChange={(e) => setPlanName(e.target.value)}
          />
          <button className="plan-btn" onClick={handleSavePlan}>Save Plan</button>
          <select
            className="plan-select"
            value={selectedPlanId}
            onChange={(e) => setSelectedPlanId(e.target.value)}
          >
            <option value="">Load plan…</option>
            {savedPlans.map(p => (
              <option key={p.id} value={p.id}>{p.name}</option>
            ))}
          </select>
          <button
            className="plan-btn"
            disabled={!selectedPlanId}
            onClick={() => {
              if (selectedPlanId) onLoadPlan(selectedPlanId);
            }}
          >
            Load
          </button>
          <button
            className="plan-btn danger"
            disabled={!selectedPlanId}
            onClick={() => {
              if (selectedPlanId) {
                onDeletePlan(selectedPlanId);
                setSelectedPlanId("");
              }
            }}
          >
            Delete
          </button>
        </div>

        <div className="plan-actions-right">
          <button className="plan-btn" onClick={() => setShowShareModal(true)}>Share</button>
          <button className="plan-btn" onClick={exportIcs}>Export ICS</button>
        </div>
      </div>

      {showShareModal && (
        <ShareModal
          courses={courses}
          manualSlots={manualSlots}
          onClose={() => setShowShareModal(false)}
        />
      )}

      {creditWarning && (
        <div className="plan-warning">High credit load — consider reducing below 27.</div>
      )}

      <div className="selected-courses-table">
        <table>
          <thead>
            <tr>
              <th>Slot</th>
              <th>Course Code</th>
              <th>Course Title</th>
              <th>Credits</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {courses.map(c => (
              <tr key={c.code}>
                <td>{c.slots.join(", ")}</td>
                <td>{c.code}</td>
                <td>{c.name}</td>
                <td>{c.credit}</td>
                <td
                  className="remove-btn"
                  onClick={() => onRemove(c.code)}
                >
                  ✕
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="total-credits" aria-label="Total credits summary">
        <div className="total-credits__left">
          <span className="total-credits__label">Total Credits</span>
          <span className="total-credits__pill">{totalCredits}</span>
        </div>
        <div className="total-credits__right">
          <span className="total-credits__meta">{courses.length} course{courses.length === 1 ? "" : "s"} selected</span>
        </div>
      </div>
    </div>
  );
}
