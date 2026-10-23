import { useEffect, useRef, useState } from "react";
import { Socials, DigitalCard, BrandIcon } from "./Socials";
import { X } from "lucide-react";
import { profile } from "../config/profile";
import { useExperience } from "../hooks/useExperience";
import { Chapter, External } from "./Primitives";
export function Connection({
  onContact,
}: {
  onContact: (text: string) => void;
}) {
  const { t, setLang, setTheme, notify } = useExperience();
  const reset = () => {
    try {
      ["pm-lang", "pm-theme", "pm-route", "pm-next-v2"].forEach((k) =>
        localStorage.removeItem(k),
      );
    } catch {}
    setLang("ru");
    setTheme("dark");
    window.dispatchEvent(new Event("pm-clear"));
    notify(t("Локальные данные очищены", "Local data cleared"));
  };
  return (
    <footer id="connection" className="connection chapter-section">
      <Chapter ru="ПРОДОЛЖИМ ЗНАКОМСТВО" en="THE CONNECTION" />
      <h2>
        {t("Есть задача?", "Something in mind?")}
        <br />
        {t("Давай обсудим.", "Let’s talk.")}
      </h2>
      <div className="connection-invite">
        <p>
          {t(
            "Напиши, с какой задачей пришёл. Можно сразу в Telegram или WhatsApp — контакты ниже.",
            "Tell me what you are working on. You can reach me directly on Telegram or WhatsApp below.",
          )}
        </p>
        <button className="button solid" onClick={() => onContact("")}>
          {t("Связаться с Павлом", "Contact Pavel")}
        </button>
      </div>
      <Socials expanded />
      <DigitalCard />
      <div className="signature-line">
        <span>{t("Павел Марков", "Pavel Markov")}</span>
        <span>PAVEL MARKOV / PERSONAL EDITION</span>
      </div>
      <div className="colophon">
        <span>© {new Date().getFullYear()} · PAVEL MARKOV</span>
        <button onClick={reset}>
          {t("Очистить локальные данные", "Clear local data")}
        </button>
      </div>
    </footer>
  );
}
export function ContactDialog({
  request,
  onClose,
}: {
  request: string | null;
  onClose: () => void;
}) {
  const { t, copy } = useExperience();
  const ref = useRef<HTMLDialogElement>(null);
  const [topic, setTopic] = useState(0);
  const topics = [
    t("Знакомство", "Introduction"),
    t("Тренировки", "Training"),
    t("Питание", "Nutrition"),
    t("Коучинг", "Coaching"),
    t("Проекты", "Projects"),
  ];
  const message =
    request ||
    t(
      `Павел, хочу обсудить: ${topics[topic].toLowerCase()}.`,
      `Pavel, I would like to discuss ${topics[topic].toLowerCase()}.`,
    );
  useEffect(() => {
    if (request !== null) ref.current?.showModal();
    else ref.current?.close();
  }, [request]);
  return (
    <dialog
      className="contact-dialog"
      ref={ref}
      onCancel={onClose}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
      aria-labelledby="contact-title"
    >
      <div className="dialog-top">
        <span className="small-label">
          {t("ЛИЧНАЯ СВЯЗЬ", "LET’S CONNECT")}
        </span>
        <button
          className="icon"
          onClick={onClose}
          aria-label={t("Закрыть", "Close")}
        >
          <X />
        </button>
      </div>
      <h2 id="contact-title">
        {t("О чём поговорим?", "What’s on your mind?")}
      </h2>
      {!request && (
        <label>
          {t("Направление", "Topic")}
          <select value={topic} onChange={(e) => setTopic(+e.target.value)}>
            {topics.map((s, k) => (
              <option key={s} value={k}>
                {s}
              </option>
            ))}
          </select>
        </label>
      )}
      <label className="contact-message">
        {t("Текст обращения", "Your message")}
        <textarea readOnly value={message} rows={request ? 7 : 3} />
      </label>
      <button className="copy-message" onClick={() => copy(message)}>
        {t("Скопировать обращение", "Copy message")}
      </button>
      <div className="messenger-actions">
        <External
          href={profile.whatsapp + "?text=" + encodeURIComponent(message)}
          className="button solid"
        >
          <BrandIcon name="WhatsApp" /> WhatsApp
        </External>
        <External href={profile.telegram} className="button outline">
          <BrandIcon name="Telegram" /> Telegram
        </External>
      </div>
      <p className="small-note">
        {t(
          "WhatsApp подставит текст. Для Telegram скопируй его перед переходом. Сообщение отправишь сам.",
          "WhatsApp includes the text. Copy it before opening Telegram. You send the message yourself.",
        )}
      </p>
    </dialog>
  );
}
