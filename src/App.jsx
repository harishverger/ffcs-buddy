import React, { useEffect, useState } from "react";
import Header from "./components/Header";
import Footer from "./components/Footer";
import Timetable from "./components/Timetable";
import ActionBar from "./components/ActionBar";
import SelectedCourses from "./components/SelectedCourses";
import Home from "./components/Home";
import { subjects } from "./data/subjects";

export default function App() {
  const [showHome, setShowHome] = useState(true);
  const [courseSlots, setCourseSlots] = useState([]);
  const [manualSlots, setManualSlots] = useState([]);
  const [selectedCourses, setSelectedCourses] = useState([]);
  const [savedPlans, setSavedPlans] = useState(() => {
    try {
      const raw = localStorage.getItem("ffcs-plans");
      return raw ? JSON.parse(raw) : [];
    } catch (e) {
      return [];
    }
  });
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

  // Persist saved plans
  useEffect(() => {
    try {
      localStorage.setItem("ffcs-plans", JSON.stringify(savedPlans));
    } catch (e) {
      console.warn("Could not persist plans", e);
    }
  }, [savedPlans]);

  // Auto-load plan from share link (?plan=...)
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const encoded = params.get("plan");
    if (!encoded) return;

    try {
      const decoded = decodeURIComponent(escape(window.atob(encoded)));
      const plan = JSON.parse(decoded);
      applyPlan(plan);
      // clean URL
      params.delete("plan");
      const next = `${window.location.pathname}${params.toString() ? `?${params.toString()}` : ""}`;
      window.history.replaceState({}, "", next);
    } catch (e) {
      console.warn("Failed to load shared plan", e);
    }
  }, []);

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

  const applyPlan = (plan) => {
    if (!plan) return;
    const safeCourses = Array.isArray(plan.courses) ? plan.courses : [];
    const safeManual = Array.isArray(plan.manualSlots) ? plan.manualSlots : [];

    setSelectedCourses(safeCourses);
    setCourseSlots(safeCourses.flatMap(c => c.slots || []));
    setManualSlots(safeManual);
  };

  const savePlan = (name) => {
    if (!name) return false;
    const id = `${Date.now()}`;
    const plan = {
      id,
      name,
      courses: selectedCourses,
      manualSlots,
    };
    setSavedPlans(prev => [{ ...plan }, ...prev].slice(0, 10));
    return true;
  };

  const loadPlan = (id) => {
    const plan = savedPlans.find(p => p.id === id);
    if (plan) applyPlan(plan);
  };

  const deletePlan = (id) => {
    setSavedPlans(prev => prev.filter(p => p.id !== id));
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
      {showHome ? (
        <Home onNavigateToPlanner={() => setShowHome(false)} />
      ) : (
        <>
          <Header
            themeSetting={themeSetting}
            resolvedTheme={resolvedTheme}
            onCycleTheme={cycleTheme}
            onNavigateHome={() => setShowHome(true)}
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
            manualSlots={manualSlots}
            savedPlans={savedPlans}
            onSavePlan={savePlan}
            onLoadPlan={loadPlan}
            onDeletePlan={deletePlan}
          />

          <Footer />
        </>
      )}
    </>
  );
}
