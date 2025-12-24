import React, { useEffect, useState } from "react";

export default function Header({ themeSetting, resolvedTheme, onCycleTheme }) {
  const [showMenu, setShowMenu] = useState(false);
  const [showShareDesktop, setShowShareDesktop] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  const label =
    themeSetting === "system"
      ? `System (${resolvedTheme === "dark" ? "Dark" : "Light"})`
      : resolvedTheme === "dark"
      ? "Dark"
      : "Light";

  const overflowIcon = showMenu ? "✕" : "≡";
  const nextTheme = themeSetting === "light" ? "Dark" : themeSetting === "dark" ? "System" : "Light";

  useEffect(() => {
    const media = window.matchMedia("(max-width: 720px)");
    const update = () => setIsMobile(media.matches);
    update();
    media.addEventListener("change", update);
    return () => media.removeEventListener("change", update);
  }, []);

  const handleShare = (network) => {
    const url = encodeURIComponent(window.location.href);
    const text = encodeURIComponent("Plan your FFCS timetable");

    const links = {
      twitter: `https://twitter.com/intent/tweet?url=${url}&text=${text}`,
      whatsapp: `https://wa.me/?text=${text}%20${url}`,
      facebook: `https://www.facebook.com/sharer/sharer.php?u=${url}`
    };

    const target = links[network];
    if (target) window.open(target, "_blank", "noopener,noreferrer");
    setShowMenu(false);
    setShowShareDesktop(false);
  };

  const handleThemeClick = () => {
    onCycleTheme();
    setShowMenu(false);
  };

  return (
    <header className="app-header">
      <div className="header-brand">
        <h1>FFCS Buddy</h1>
        <p>No clashes. No confusion.</p>
      </div>

      <div className="header-actions">
        <div className="desktop-actions">
          <div className="share-wrap-desktop">
            <button
              className="share-btn-desktop"
              onClick={() => setShowShareDesktop(v => !v)}
              aria-expanded={showShareDesktop}
              aria-haspopup="true"
            >
              <span aria-hidden="true">⤵</span>
              <span>Share</span>
            </button>

            {showShareDesktop && (
              <div className="share-menu" role="menu">
                <button onClick={() => handleShare("twitter")} role="menuitem">Twitter / X</button>
                <button onClick={() => handleShare("whatsapp")} role="menuitem">WhatsApp</button>
                <button onClick={() => handleShare("facebook")} role="menuitem">Facebook</button>
              </div>
            )}
          </div>

          <button
            className="theme-toggle"
            onClick={onCycleTheme}
            aria-label={`Theme: ${label}`}
          >
            <span className="theme-icon" aria-hidden="true">{resolvedTheme === "dark" ? "☾" : "☼"}</span>
            <span className="theme-text">{label}</span>
          </button>
        </div>

        {isMobile && (
          <div className="overflow-wrap">
            <button
              className="overflow-btn"
              onClick={() => setShowMenu(v => !v)}
              aria-expanded={showMenu}
              aria-haspopup="true"
              aria-label="Open menu"
            >
              <span className="overflow-icon" aria-hidden="true">{overflowIcon}</span>
            </button>

            {showMenu && (
              <div className="overflow-menu" role="menu">
                <div className="menu-heading">Share</div>
                <button onClick={() => handleShare("twitter")} role="menuitem">Twitter / X</button>
                <button onClick={() => handleShare("whatsapp")} role="menuitem">WhatsApp</button>
                <button onClick={() => handleShare("facebook")} role="menuitem">Facebook</button>
                <div className="menu-divider" aria-hidden="true"></div>
                <div className="menu-heading">Theme</div>
                <button onClick={handleThemeClick} role="menuitem">
                  Theme: {label} (next: {nextTheme})
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </header>
  );
}
