import { productScenes } from "../config/product-scenes";
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
  const [scene, setScene] = useState(0);
  const scenes = productScenes[name] || [];
  const selected = scenes[scene];
  const file = selected ? "media/" + selected.file + ".webp" : image;
  return (
    <figure className="product-capture product-scenes">
      <div
        className="capture-controls"
        role="group"
        aria-label={t("Вид снимка ", "Screenshot view: ") + name}
      >
        {scenes.map((item, k) => (
          <button
            key={item.file}
            aria-pressed={scene === k}
            onClick={() => setScene(k)}
          >
            {t(item.label[0], item.label[1])}
          </button>
        ))}
        <button
          aria-pressed={scene === scenes.length}
          onClick={() => setScene(scenes.length)}
        >
          {t("Общий вид", "Overview")}
        </button>
      </div>
      {selected && (
        <p className="capture-hint">
          {t(
            "Снимок можно прокрутить или открыть целиком",
            "Scroll the capture or open it in full",
          )}
        </p>
      )}
      <div
        key={file}
        className="capture-viewport"
        role="region"
        tabIndex={0}
        aria-label={t("Снимок интерфейса ", "Interface capture: ") + name}
      >
        <a
          href={base + file}
          target="_blank"
          rel="noreferrer"
          aria-label={t("Увеличить снимок ", "Enlarge capture of ") + name}
        >
          <Media
            key={file}
            src={file}
            width={selected ? 430 : 1200}
            height={selected ? 900 : 833}
            loading="lazy"
            alt={
              selected
                ? name + " — " + t(selected.label[0], selected.label[1])
                : alt
            }
          />
        </a>
      </div>
      <figcaption>
        {selected ? t(selected.note[0], selected.note[1]) : capture} ·{" "}
        {t("Открыть оригинальный снимок", "Open original screenshot")}
      </figcaption>
    </figure>
  );
}
