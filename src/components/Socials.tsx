import { useState } from "react";
import { socials, activeSocial } from "../config/socials";
import { profile } from "../config/profile";
import { useExperience } from "../hooks/useExperience";
import { cardURL, vcard } from "../lib/card";
export function BrandIcon({ name }: { name: string }) {
  const icon = socials.find((s) => s.name === name)?.icon;
  if (!icon) return null;
  const [width, height, , , path] = icon.icon;
  return (
    <svg
      className="brand-icon"
      width="21"
      height="21"
      viewBox={`0 0 ${width} ${height}`}
      aria-hidden="true"
    >
      <path
        fill="currentColor"
        d={Array.isArray(path) ? path.join(" ") : path}
      />
    </svg>
  );
}
export function Socials({ expanded = false }: { expanded?: boolean }) {
  const { t } = useExperience();
  return (
    <div
      className={"social-panel " + (expanded ? "expanded" : "compact")}
      aria-label={t("Социальные сети", "Social profiles")}
    >
      {socials
        .filter((s) => activeSocial(s.url))
        .map((s) => {
          const [width, height, , , path] = s.icon.icon;
          const content = (
            <>
              <svg viewBox={`0 0 ${width} ${height}`} aria-hidden="true">
                <path
                  fill="currentColor"
                  d={Array.isArray(path) ? path.join(" ") : path}
                />
              </svg>
              <span>{s.name}</span>
              {!activeSocial(s.url) && (
                <small>{t("Ссылка будет добавлена", "Link coming soon")}</small>
              )}
            </>
          );
          return activeSocial(s.url) ? (
            <a
              key={s.name}
              href={s.url}
              target="_blank"
              rel="noopener noreferrer"
              title={s.name}
              aria-label={s.name}
            >
              {content}
            </a>
          ) : (
            <div className="social-pending" key={s.name}>
              {content}
            </div>
          );
        })}
    </div>
  );
}
export function DigitalCard() {
  const { t, copy, notify } = useExperience();
  const [qr, setQR] = useState("");
  const [show, setShow] = useState(false);
  async function share() {
    if (navigator.share) {
      try {
        await navigator.share({ title: "Pavel Markov", url: cardURL });
        return;
      } catch (e) {
        if (e instanceof DOMException && e.name === "AbortError") return;
      }
    }
    await copy(cardURL);
  }
  async function toggleQR() {
    if (show) {
      setShow(false);
      return;
    }
    try {
      if (!qr) {
        const { toDataURL } = await import("qrcode");
        setQR(
          await toDataURL(cardURL, {
            width: 240,
            margin: 2,
            errorCorrectionLevel: "M",
          }),
        );
      }
      setShow(true);
    } catch {
      notify(
        t(
          "Не удалось создать QR. Скопируй ссылку.",
          "QR unavailable. Copy the link instead.",
        ),
      );
    }
  }
  async function save() {
    const { download } = await import("../lib/exports");
    download(
      new Blob([vcard(profile.phone)], { type: "text/vcard;charset=utf-8" }),
      "pavel-markov.vcf",
    );
  }
  return (
    <div className="digital-card">
      <p>
        {t(
          "Сохрани контакт или отправь эту страницу знакомому.",
          "Save my contact or share this page with someone.",
        )}
      </p>
      <div className="card-controls">
        <button onClick={save}>
          {t("Сохранить контакт", "Save contact")} · vCard
        </button>
        <button onClick={share}>{t("Поделиться", "Share page")}</button>
        <button onClick={() => copy(cardURL)}>
          {t("Скопировать ссылку", "Copy page link")}
        </button>
        <button onClick={() => copy(profile.telegram)}>
          {t("Скопировать Telegram", "Copy Telegram")}
        </button>
        <button onClick={toggleQR} aria-expanded={show}>
          {show ? t("Скрыть QR", "Hide QR") : t("Показать QR", "Show QR")}
        </button>
      </div>
      {show && (
        <img
          className="contact-qr"
          src={qr}
          width="240"
          height="240"
          alt={t("QR-код этой страницы", "QR code for this page")}
        />
      )}
    </div>
  );
}
