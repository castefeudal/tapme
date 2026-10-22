import "./styles/fonts.css";
import React, { useState, useEffect, useRef, lazy, Suspense } from "react";
import { createRoot } from "react-dom/client";

import "./styles/tokens.css";
import "./styles/global.css";
import "./styles/hero.css";
import "./styles/motion.css";
import "./styles/signature.css";
import { ExperienceProvider, useExperience } from "./hooks/useExperience";
import { Navigation } from "./components/Navigation";
import { Hero } from "./components/Hero";
const NextMove = lazy(() =>
  import("./components/NextMove").then((module) => ({
    default: module.NextMove,
  })),
);
import { Proof } from "./components/Proof";
import { Showcases } from "./components/Showcases";
import { WorkWithMe } from "./components/WorkWithMe";
import { Connection, ContactDialog } from "./components/Connection";
import { ReadingProgress } from "./ReadingProgress";
function Planner({ onContact }: { onContact: (text: string) => void }) {
  const { t } = useExperience();
  const host = useRef<HTMLDivElement>(null);
  const [ready, setReady] = useState(false);
  useEffect(() => {
    if (!("IntersectionObserver" in window)) {
      setReady(true);
      return;
    }
    const observer = new IntersectionObserver((entries) => {
      if (entries.some((entry) => entry.isIntersecting)) {
        setReady(true);
        observer.disconnect();
      }
    });
    if (host.current) observer.observe(host.current);
    return () => observer.disconnect();
  }, []);
  const fallback = (
    <section className="plan-loading" aria-busy="true">
      <p>{t("Загрузка планировщика…", "Loading the planner…")}</p>
    </section>
  );
  return (
    <div ref={host} id="next" className="planner-host">
      {ready ? (
        <Suspense fallback={fallback}>
          <NextMove onContact={onContact} />
        </Suspense>
      ) : (
        fallback
      )}
    </div>
  );
}
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
        <Planner onContact={setContact} />
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
