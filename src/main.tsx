import "./styles/fonts.css";
import React, { useState, useEffect } from "react";
import { createRoot } from "react-dom/client";

import "./styles/tokens.css";
import "./styles/global.css";
import "./styles/hero.css";
import "./styles/motion.css";
import { ExperienceProvider, useExperience } from "./hooks/useExperience";
import { Navigation } from "./components/Navigation";
import { Hero } from "./components/Hero";
import { NextMove } from "./components/NextMove";
import { Proof } from "./components/Proof";
import { Showcases } from "./components/Showcases";
import { WorkWithMe } from "./components/WorkWithMe";
import { Connection, ContactDialog } from "./components/Connection";
import { ReadingProgress } from "./ReadingProgress";
function App() {
  const { t } = useExperience();
  const [contact, setContact] = useState<string | null>(null);
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) =>
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("entered");
            observer.unobserve(entry.target);
          }
        }),
      { threshold: 0.08 },
    );
    document
      .querySelectorAll("[data-enter]")
      .forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);
  return (
    <>
      <ReadingProgress />
      <a className="skip-link" href="#main">
        {t("К содержимому", "Skip to content")}
      </a>
      <Navigation />
      <main id="main">
        <Hero />
        <NextMove onContact={setContact} />
        <Proof />
        <Showcases />
        <WorkWithMe onContact={setContact} />
      </main>
      <Connection onContact={setContact} />
      <ContactDialog request={contact} onClose={() => setContact(null)} />
    </>
  );
}
createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <ExperienceProvider>
      <App />
    </ExperienceProvider>
  </React.StrictMode>,
);
