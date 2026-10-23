import { useState } from "react";
import { Sun, Moon, Menu, X, Send } from "lucide-react";
import { useExperience } from "../hooks/useExperience";
import { profile } from "../config/profile";
export function Navigation() {
  const { t, lang, setLang, theme, setTheme } = useExperience();
  const [open, setOpen] = useState(false);
  return (
    <header className="site-header">
      <a href="#person" className="wordmark">
        PM<span>{t("ПАВЕЛ МАРКОВ", "PAVEL MARKOV")}</span>
      </a>
      <nav
        className={open ? "navigation open" : "navigation"}
        aria-label={t("Главная навигация", "Main navigation")}
      >
        {[
          ["proof", t("Человек", "The person")],
          ["work", t("Проекты", "The work")],
          ["next", t("Твой следующий шаг", "Your next move")],
          ["connection", t("Контакт", "Contact")],
        ].map(([id, name]) => (
          <a key={id} href={"#" + id} onClick={() => setOpen(false)}>
            {name}
          </a>
        ))}
      </nav>
      <div className="nav-controls">
        <button
          className="language"
          onClick={() => setLang(lang === "ru" ? "en" : "ru")}
          aria-label={t(
            "RU — Switch to English",
            "EN — Переключить на русский",
          )}
        >
          {lang.toUpperCase()}
        </button>
        <button
          className="icon"
          aria-label={t("Сменить тему", "Change theme")}
          onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
        >
          {theme === "dark" ? <Sun size={18} /> : <Moon size={18} />}
        </button>
        <a
          href={profile.telegram}
          target="_blank"
          rel="noreferrer"
          className="telegram-short"
          aria-label="Telegram"
        >
          <span>Telegram</span>
          <Send size={18} aria-hidden="true" />
        </a>
        <button
          className="icon menu-toggle"
          onClick={() => setOpen(!open)}
          aria-expanded={open}
          aria-label={t("Меню", "Menu")}
        >
          {open ? <X /> : <Menu />}
        </button>
      </div>
    </header>
  );
}
