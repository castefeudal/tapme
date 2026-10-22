import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import type { Lang, Pair } from "../config/profile";
export function readLocal(key: string) {
  try {
    return localStorage.getItem(key);
  } catch {
    return null;
  }
}
export function writeLocal(key: string, value: string) {
  try {
    localStorage.setItem(key, value);
  } catch {}
}
type Experience = {
  lang: Lang;
  theme: "dark" | "light";
  setLang: (v: Lang) => void;
  setTheme: (v: "dark" | "light") => void;
  t: (ru: string, en: string) => string;
  p: (value: Pair | readonly string[]) => string;
  notify: (message: string) => void;
  copy: (text: string) => Promise<void>;
};
const Context = createContext<Experience | null>(null);
export function ExperienceProvider({ children }: { children: ReactNode }) {
  const [lang, setLang] = useState<Lang>(
    readLocal("pm-lang") === "en" ? "en" : "ru",
  );
  const [theme, setTheme] = useState<"dark" | "light">(
    readLocal("pm-theme") === "light" ? "light" : "dark",
  );
  const [message, notify] = useState("");
  const t = (ru: string, en: string) => (lang === "ru" ? ru : en);
  const p = (v: Pair | readonly string[]) => v[lang === "ru" ? 0 : 1];
  useEffect(() => {
    document.documentElement.lang = lang;
    document.title = t(
      "Павел Марков — тренировки, питание, проекты",
      "Pavel Markov — training, nutrition, projects",
    );
    const desc = t(
      "Предприниматель. Фитнес и нутрициология. Коучинг. Управление проектами. Реальные продукты и твой следующий практический шаг.",
      "Entrepreneur. Fitness and nutrition. Coaching. Project management. Real products and your next practical step.",
    );
    document
      .querySelector('meta[name="description"]')
      ?.setAttribute("content", desc);
    document
      .querySelector('meta[property="og:description"]')
      ?.setAttribute("content", desc);
    writeLocal("pm-lang", lang);
  }, [lang]);
  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    document
      .querySelector('meta[name="theme-color"]')
      ?.setAttribute("content", theme === "dark" ? "#131313" : "#f2efe9");
    writeLocal("pm-theme", theme);
  }, [theme]);
  useEffect(() => {
    if (message) {
      const timer = setTimeout(() => notify(""), 5000);
      return () => clearTimeout(timer);
    }
  }, [message]);
  const copy = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      notify(t("Скопировано", "Copied"));
    } catch {
      notify(
        t(
          "Не удалось скопировать. Выдели текст вручную.",
          "Could not copy. Select the text manually.",
        ),
      );
    }
  };
  return (
    <Context.Provider
      value={{ lang, theme, setLang, setTheme, t, p, notify, copy }}
    >
      {children}
      <div role="status" className={"toast " + (message ? "visible" : "")}>
        {message}
      </div>
    </Context.Provider>
  );
}
export function useExperience() {
  const context = useContext(Context);
  if (!context) throw Error("ExperienceProvider is required");
  return context;
}
