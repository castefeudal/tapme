import "./styles/fonts.css";
import React, { useState, useEffect, useRef, lazy, Suspense } from "react";
import { createRoot } from "react-dom/client";

import "./styles/tokens.css";
import "./styles/global.css";
import "./styles/hero.css";
import "./styles/motion.css";
import "./styles/planner-loader.css";
import { ExperienceProvider, useExperience } from "./hooks/useExperience";
import { Navigation } from "./components/Navigation";
import { Hero } from "./components/Hero";
import { PlannerGuard } from "./components/PlannerGuard";
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
    const observer = new IntersectionObserver(
      (entries) => {
        if (
          entries.some(
            (entry) => entry.isIntersecting && entry.intersectionRatio >= 0.1,
          )
        ) {
          setReady(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1 },
    );
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
        <PlannerGuard
          fallback={
            <section className="plan-loading" role="alert">
              <p>
                {t(
                  "Планировщик не загрузился. Проверь соединение и попробуй ещё раз.",
                  "The planner could not load. Check your connection and try again.",
                )}
              </p>
              <button className="button ink" onClick={() => location.reload()}>
                {t("Перезагрузить страницу", "Reload the page")}
              </button>
            </section>
          }
        >
          <Suspense fallback={fallback}>
            <NextMove onContact={onContact} />
          </Suspense>
        </PlannerGuard>
      ) : (
        fallback
      )}
    </div>
  );
}
function App() {
  const { t } = useExperience();
  const [contact, setContact] = useState<string | null>(null);
  return (
    <>
      <ReadingProgress />
      <a className="skip-link" href="#main">
        {t("К содержимому", "Skip to content")}
      </a>
      <Navigation />
      <main id="main">
        <Hero />
        <Proof />
        <Showcases />
        <Planner onContact={setContact} />
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
