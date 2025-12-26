import React, { useState } from "react";
import { subjects } from "../data/subjects";
import { CREDIT_RULES } from "../data/creditRules";
import { hasClash } from "../utils/clashchecker";
import ClashAlert from "./ClashAlert";

export default function ActionBar({ selectedSlots, onAdd }) {
  const [creditFilter, setCreditFilter] = useState("");
  const [subjectCode, setSubjectCode] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [theorySlot, setTheorySlot] = useState("");
  const [labSlot, setLabSlot] = useState("");
  const [clashMessage, setClashMessage] = useState("");

  const subject = subjects.find(s => s.code === subjectCode);
  
  // Automatically determine credit rule from selected subject
  const creditRule = subject
    ? CREDIT_RULES?.[subject.credits]?.[subject.component] || null
    : null;

  // Determine if subject has theory and/or lab
  const hasTheory = subject && (subject.component === "TH" || subject.component === "TH+LAB");
  const hasLab = subject && (subject.component === "LAB" || subject.component === "TH+LAB");

  // Filter subjects based on search query and credit filter
  const filteredSubjects = searchQuery.trim()
    ? subjects.filter(s => {
        const matchesSearch = s.code.toUpperCase().includes(searchQuery.toUpperCase()) ||
                             s.title.toUpperCase().includes(searchQuery.toUpperCase());
        const matchesCredit = !creditFilter || s.credits.toString() === creditFilter;
        return matchesSearch && matchesCredit;
      })
    : [];

  // Normalize slot options: ["A1","TA1"] → "A1+TA1"
  const normalizeSlots = (slots = []) =>
    slots.map(opt => (Array.isArray(opt) ? opt.join("+") : opt));

  const theorySlots = normalizeSlots(creditRule?.theory);
  const labSlots = normalizeSlots(creditRule?.lab);

  const normalizeToken = slot => String(slot || "").trim().toUpperCase();

  const findSuggestions = (currentValue, label, pendingTokens = []) => {
    const sourceOptions = label === "Theory" ? creditRule?.theory : creditRule?.lab;
    if (!sourceOptions || sourceOptions.length === 0) return [];

    const normalizedSelected = selectedSlots.map(normalizeToken);
    const normalizedPending = pendingTokens.map(normalizeToken);

    return sourceOptions
      .map(opt => normalizeToken(opt))
      .filter(opt => opt !== normalizeToken(currentValue))
      .filter(opt => {
        const tokens = opt.split("+").map(normalizeToken).filter(Boolean);
        // Do not suggest anything that clashes any selected or already pending token
        return tokens.every(tok => !hasClash([...normalizedSelected, ...normalizedPending], tok));
      })
      .slice(0, 5);
  };

  const handleAdd = () => {
    if (!subject) {
      setClashMessage("Please select a subject.");
      return;
    }

    if (hasTheory && !theorySlot) {
      setClashMessage("Theory slot is required for this course.");
      return;
    }

    if (hasLab && !labSlot) {
      setClashMessage("Lab slot is required for this course.");
      return;
    }

    const slotsToAdd = [];
    let hasClashError = false;

    const addSlotTokens = (slotValue, label) => {
      slotValue.split("+").forEach(raw => {
        const token = normalizeToken(raw);
        if (!token) return;

        if (hasClash(selectedSlots, token)) {
          const suggestions = findSuggestions(slotValue, label, slotsToAdd);
          const suggestionText = suggestions.length
            ? `\n\nTry: ${suggestions.join(", ")}`
            : "";
          setClashMessage(`The ${label} slot "${token}" clashes with an already selected slot on the same day and time.${suggestionText}`);
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
        name: subject.title,
        credit: subject.credits
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
                    setTheorySlot("");
                    setLabSlot("");
                  }}
                >
                  <strong>{s.code}</strong> – {s.title} ({s.credits} credits)
                </div>
              ))}
            </div>
          )}

          {subjectCode && (
            <div className="selected-course-tag">
              <span>
                <strong>{subjectCode}</strong> – {subject?.title} ({subject?.credits} credits)
              </span>
              <button
                onClick={() => {
                  setSubjectCode("");
                  setSearchQuery("");
                  setTheorySlot("");
                  setLabSlot("");
                }}
              >
                ✕
              </button>
            </div>
          )}
        </div>

        <div className="ffcs-field">
          <label>Filter by Credits</label>
          <select value={creditFilter} onChange={e => setCreditFilter(e.target.value)}>
            <option value="">All Credits</option>
            {Object.keys(CREDIT_RULES).map(c => (
              <option key={c} value={c}>{c} Credit{c !== "1" ? "s" : ""}</option>
            ))}
          </select>
        </div>
      </div>

      {/* ===== ROW 2 ===== */}
      <div className="ffcs-row">
        {hasTheory && (
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

        {hasLab && (
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
