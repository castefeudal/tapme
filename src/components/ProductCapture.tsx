import { useState } from "react";
import { useExperience } from "../hooks/useExperience";
import { Media, base } from "./Primitives";
export function ProductCapture({
  image,
  alt,
  capture,
  name,
}: {
  image: string;
  alt: string;
  capture: string;
  name: string;
}) {
  const { t } = useExperience();
  const [detail, setDetail] = useState(false);
  return (
    <figure
      className={"product-capture " + (detail ? "capture-detail" : "")}
      data-enter
    >
      <div
        className="capture-controls"
        role="group"
        aria-label={t("Вид снимка ", "Screenshot view: ") + name}
      >
        <button aria-pressed={!detail} onClick={() => setDetail(false)}>
          {t("Весь экран", "Full screen")}
        </button>
        <button aria-pressed={detail} onClick={() => setDetail(true)}>
          {t("Детали интерфейса", "Interface detail")}
        </button>
      </div>
      <a
        href={base + image}
        target="_blank"
        rel="noreferrer"
        aria-label={t("Увеличить снимок ", "Enlarge capture of ") + name}
      >
        <Media src={image} width="1200" height="833" loading="lazy" alt={alt} />
      </a>
      <figcaption>
        {capture} ·{" "}
        {t("Открыть оригинальный снимок", "Open original screenshot")}
      </figcaption>
    </figure>
  );
}
