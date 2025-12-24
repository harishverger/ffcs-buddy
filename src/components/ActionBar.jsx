import React, { useState } from "react";
import { subjects } from "../data/subjects";
import { CREDIT_RULES } from "../data/creditRules";
import { hasClash } from "../utils/clashChecker";
import ClashAlert from "./ClashAlert";

export default function ActionBar({ selectedSlots, onAdd }) {
  const [credit, setCredit] = useState("");
  const [subjectCode, setSubjectCode] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [theorySlot, setTheorySlot] = useState("");
  const [labSlot, setLabSlot] = useState("");
  const [clashMessage, setClashMessage] = useState("");

  const subject = subjects.find(s => s.code === subjectCode);
  const creditRule = credit ? CREDIT_RULES[credit] : null;

  // Filter subjects based on search query
  const filteredSubjects = searchQuery.trim()
    ? subjects.filter(s =>
        s.code.toUpperCase().includes(searchQuery.toUpperCase()) ||
        s.name.toUpperCase().includes(searchQuery.toUpperCase())
      )
    : [];

  // Normalize slot options: ["A1","TA1"] → "A1+TA1"
  const normalizeSlots = (slots = []) =>
    slots.map(opt => (Array.isArray(opt) ? opt.join("+") : opt));

  const theorySlots = normalizeSlots(creditRule?.theory);
  const labSlots = normalizeSlots(creditRule?.lab);

  const handleAdd = () => {
    if (!subject) {
      setClashMessage("Please select a subject.");
      return;
    }

    if (subject.hasTheory && !theorySlot) {
      setClashMessage("Theory slot is required for this course.");
      return;
    }

    if (subject.hasLab && !labSlot) {
      setClashMessage("Lab slot is required for this course.");
      return;
    }

    const slotsToAdd = [];
    let hasClashError = false;

    const addSlotTokens = (slotValue, label) => {
      slotValue.split("+").forEach(raw => {
        const token = raw.trim().toUpperCase();
        if (!token) return;

        if (hasClash(selectedSlots, token)) {
          setClashMessage(`The ${label} slot "${token}" clashes with an already selected slot on the same day and time.\n\nPlease choose a different slot.`);
          hasClashError = true;
          return;
        }

        slotsToAdd.push(token);
      });
    };

    if (theorySlot) addSlotTokens(theorySlot, "Theory");
    if (hasClashError) return;
    
    if (labSlot) addSlotTokens(labSlot, "Lab");
    if (hasClashError) return;

    if (slotsToAdd.length === 0) return;

    onAdd(
      {
        code: subject.code,
        name: subject.name,
        credit
      },
      slotsToAdd
    );

    setSubjectCode("");
    setTheorySlot("");
    setLabSlot("");
  };

  return (
    <div className="ffcs-card">
      <h3 className="ffcs-title">Search Courses</h3>

      {/* ===== ROW 1 ===== */}
      <div className="ffcs-row">
        <div className="ffcs-field wide" style={{ position: "relative" }}>
          <label>Course</label>
          <input
            type="text"
            placeholder="Search by code or name..."
            value={searchQuery}
            onChange={e => {
              setSearchQuery(e.target.value);
              setShowSuggestions(true);
            }}
            onFocus={() => setShowSuggestions(true)}
            onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
          />
          
          {showSuggestions && filteredSubjects.length > 0 && (
            <div className="search-dropdown">
              {filteredSubjects.map(s => (
                <div
                  key={s.code}
                  className="search-dropdown-item"
                  onClick={() => {
                    setSubjectCode(s.code);
                    setSearchQuery("");
                    setShowSuggestions(false);
                  }}
                >
                  <strong>{s.code}</strong> – {s.name}
                </div>
              ))}
            </div>
          )}

          {subjectCode && (
            <div className="selected-course-tag">
              <span>
                <strong>{subjectCode}</strong> – {subject?.name}
              </span>
              <button
                onClick={() => {
                  setSubjectCode("");
                  setSearchQuery("");
                }}
              >
                ✕
              </button>
            </div>
          )}
        </div>

        <div className="ffcs-field">
          <label>Credit</label>
          <select value={credit} onChange={e => setCredit(e.target.value)}>
            <option value="">Select</option>
            {Object.keys(CREDIT_RULES).map(c => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
        </div>
      </div>

      {/* ===== ROW 2 ===== */}
      <div className="ffcs-row">
        {subject?.hasTheory && (
          <div className="ffcs-field">
            <label>Theory Slot</label>
            <select
              value={theorySlot}
              onChange={e => setTheorySlot(e.target.value)}
            >
              <option value="">Select</option>
              {theorySlots.map(s => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
          </div>
        )}

        {subject?.hasLab && (
          <div className="ffcs-field">
            <label>Lab Slot</label>
            <select
              value={labSlot}
              onChange={e => setLabSlot(e.target.value)}
            >
              <option value="">Select</option>
              {labSlots.map(s => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
          </div>
        )}

        <div className="ffcs-field action">
          <button onClick={handleAdd}>Add Course</button>
        </div>
      </div>

      <ClashAlert 
        message={clashMessage} 
        onClose={() => setClashMessage("")} 
      />
    </div>
  );
}
