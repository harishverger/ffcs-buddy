import React, { useEffect, useState } from "react";
import Header from "./components/Header";
import Footer from "./components/Footer";
import Timetable from "./components/Timetable";
import ActionBar from "./components/ActionBar";
import SelectedCourses from "./components/SelectedCourses";

export default function App() {
  const [courseSlots, setCourseSlots] = useState([]);
  const [manualSlots, setManualSlots] = useState([]);
  const [selectedCourses, setSelectedCourses] = useState([]);
  const [quickSelectEnabled, setQuickSelectEnabled] = useState(false);
  const [themeSetting, setThemeSetting] = useState(() =>
    localStorage.getItem("ffcs-theme") || "system"
  );
  const [resolvedTheme, setResolvedTheme] = useState("light");

  const allSelectedSlots = [...new Set([...courseSlots, ...manualSlots])];

  useEffect(() => {
    const systemMedia = window.matchMedia("(prefers-color-scheme: dark)");

    const applyTheme = () => {
      const next = themeSetting === "system"
        ? (systemMedia.matches ? "dark" : "light")
        : themeSetting;

      setResolvedTheme(next);
      document.documentElement.setAttribute("data-theme", next);
    };

    applyTheme();
    localStorage.setItem("ffcs-theme", themeSetting);

    if (themeSetting === "system") {
      systemMedia.addEventListener("change", applyTheme);
      return () => systemMedia.removeEventListener("change", applyTheme);
    }
  }, [themeSetting]);

  const addCourse = (course, slots) => {
    setCourseSlots(prev => [...new Set([...prev, ...slots])]);
    setSelectedCourses(prev => [...prev, { ...course, slots }]);
  };

  const removeCourse = (code) => {
    const course = selectedCourses.find(c => c.code === code);
    if (!course) return;

    setSelectedCourses(prev => prev.filter(c => c.code !== code));
    setCourseSlots(prev => prev.filter(slot => !course.slots.includes(slot)));
  };

  const toggleManualSlots = (tokens = []) => {
    const slots = Array.isArray(tokens) ? tokens : [tokens];

    setManualSlots(prev => {
      const next = new Set(prev);

      slots.forEach(slot => {
        if (!slot) return;
        if (next.has(slot)) next.delete(slot);
        else next.add(slot);
      });

      return [...next];
    });
  };

  const resetAll = () => {
    setCourseSlots([]);
    setManualSlots([]);
    setSelectedCourses([]);
    setQuickSelectEnabled(false);
  };

  const toggleQuickSelect = () => {
    setQuickSelectEnabled(prev => !prev);
  };

  const cycleTheme = () => {
    setThemeSetting(prev => {
      if (prev === "light") return "dark";
      if (prev === "dark") return "system";
      return "light";
    });
  };

  return (
    <>
      <Header
        themeSetting={themeSetting}
        resolvedTheme={resolvedTheme}
        onCycleTheme={cycleTheme}
      />

      <ActionBar
        selectedSlots={allSelectedSlots}
        onAdd={addCourse}
      />

      <Timetable
        selectedSlots={allSelectedSlots}
        onToggleSlots={toggleManualSlots}
        onReset={resetAll}
        quickSelectEnabled={quickSelectEnabled}
        onToggleQuickSelect={toggleQuickSelect}
      />

      <SelectedCourses
        courses={selectedCourses}
        onRemove={removeCourse}
      />

      <Footer />
    </>
  );
}
