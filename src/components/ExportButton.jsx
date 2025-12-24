import React from "react";
import { toPng } from "html-to-image";

export default function ExportButton() {
  return (
    <button
      onClick={() =>
        toPng(document.querySelector(".timetable")).then(url => {
          const a = document.createElement("a");
          a.href = url;
          a.download = "ffcs-timetable.png";
          a.click();
        })
      }
    >
      Export Timetable
    </button>
  );
}
