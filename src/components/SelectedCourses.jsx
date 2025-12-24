import React from "react";

export default function SelectedCourses({ courses, onRemove }) {
  const totalCredits = courses.reduce(
    (sum, c) => sum + Number(c.credit || 0),
    0
  );

  if (courses.length === 0) return null;

  return (
    <div className="selected-courses">
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

      <div className="total-credits">
        Total Credits: {totalCredits}
      </div>
    </div>
  );
}
