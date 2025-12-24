import React, { useEffect, useState } from "react";

export default function Home({ onNavigateToPlanner, onNavigateHome }) {
  const fullText = "Welcome to FFCS Buddy";
  const [typed, setTyped] = useState("");
  );
}
            <a href="https://github.com/harishverger/ffcs-buddy" target="_blank" rel="noopener noreferrer">
              GitHub
            </a>
            <span>•</span>
            <a href="#" onClick={(e) => { e.preventDefault(); onNavigateToPlanner(); }}>
              Timetable Planner
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}import React from "react";

export default function Home({ onNavigateToPlanner }) {
  return (
    <div className="home-container">
      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-content">
          <h1 className="hero-title">
            Welcome to <span className="brand-gradient">FFCS Buddy</span>
          </h1>
          <p className="hero-subtitle">
            Your one-stop solution for VIT-AP FFCS timetable planning
          </p>
          <button className="cta-button" onClick={onNavigateToPlanner}>
            <span className="btn-icon">📅</span>
            Start Planning Your Timetable
          </button>
        </div>
      </section>

      {/* Features Section */}
      <section className="features-section">
        <h2 className="section-title">What You Can Do</h2>
        <div className="features-grid">
          <div className="feature-card">
            <div className="feature-icon">🔍</div>
            <h3>Smart Search</h3>
            <p>Search courses by code or name with instant suggestions</p>
          </div>

          <div className="feature-card">
            <div className="feature-icon">⚡</div>
            <h3>Quick Select</h3>
            <p>Enable quick select mode to rapidly build your timetable</p>
          </div>

          <div className="feature-card">
            <div className="feature-icon">🚫</div>
            <h3>Clash Detection</h3>
            <p>Automatic detection of slot clashes to prevent scheduling conflicts</p>
          </div>

          <div className="feature-card">
            <div className="feature-icon">💾</div>
            <h3>Export Timetable</h3>
            <p>Download your timetable as an image for easy sharing</p>
          </div>

          <div className="feature-card">
            <div className="feature-icon">🎨</div>
            <h3>Dark Mode</h3>
            <p>Eye-friendly dark theme for comfortable viewing</p>
          </div>

          <div className="feature-card">
            <div className="feature-icon">📊</div>
            <h3>Credit Tracking</h3>
            <p>Keep track of your total credits automatically</p>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="how-it-works-section">
        <h2 className="section-title">How It Works</h2>
        <div className="steps-container">
          <div className="step">
            <div className="step-number">1</div>
            <h3>Search for Courses</h3>
            <p>Use the search bar to find courses by code or name. Filter by credits if needed.</p>
          </div>

          <div className="step">
            <div className="step-number">2</div>
            <h3>Select Slots</h3>
            <p>Choose theory and lab slots based on your course requirements. Clash detection keeps you safe.</p>
          </div>

          <div className="step">
            <div className="step-number">3</div>
            <h3>Build Your Timetable</h3>
            <p>Watch your timetable come to life as you add courses. Use quick select for faster planning.</p>
          </div>

          <div className="step">
            <div className="step-number">4</div>
            <h3>Export & Share</h3>
            <p>Download your finalized timetable as an image and share it with friends!</p>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section className="about-section">
        <h2 className="section-title">About FFCS Buddy</h2>
        <p className="about-text">
          FFCS Buddy is a comprehensive timetable planning tool designed specifically for VIT-AP students.
          It simplifies the Fully Flexible Credit System (FFCS) course selection process by providing
          an intuitive interface to search courses, select slots, detect clashes, and visualize your
          complete weekly schedule.
        </p>
        <p className="about-text">
          Built with modern web technologies, FFCS Buddy offers a seamless experience with features
          like dark mode, responsive design, and exportable timetables - making FFCS planning stress-free!
        </p>
      </section>

      {/* Footer */}
      <footer className="home-footer">
        <div className="footer-content">
          <p>© 2024 FFCS Buddy. Made with ❤️ for VIT-AP students</p>
          <div className="footer-links">
            <a href="https://github.com/harishverger/ffcs-buddy" target="_blank" rel="noopener noreferrer">
              GitHub
            </a>
            <span>•</span>
            <a href="#" onClick={(e) => { e.preventDefault(); onNavigateToPlanner(); }}>
              Timetable Planner
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
