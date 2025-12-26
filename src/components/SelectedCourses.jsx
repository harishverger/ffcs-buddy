import React from "react";

export default function SelectedCourses({ courses, onRemove }) {
  const totalCredits = courses.reduce(
    (sum, c) => sum + Number(c.credit || 0),
    0
  );

  if (courses.length === 0) return null;

  return (
    <div className="selected-courses">
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
