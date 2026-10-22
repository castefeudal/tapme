import { useState, type ImgHTMLAttributes } from "react";
import { useExperience } from "../hooks/useExperience";
export const base = import.meta.env.BASE_URL;
export function Media({
  src,
  alt,
  ...rest
}: ImgHTMLAttributes<HTMLImageElement>) {
  const [failed, setFailed] = useState(false);
  return failed ? (
    <div className="media-fallback" role="img" aria-label={alt}>
      <span>
        PAVEL
        <br />
        MARKOV
      </span>
    </div>
  ) : (
    <img
      {...rest}
      src={src?.startsWith("http") ? src : base + src}
      alt={alt}
      onError={() => setFailed(true)}
    />
  );
}
export function Chapter({ en, ru }: { en: string; ru: string }) {
  const { t } = useExperience();
  return <p className="chapter">{t(ru, en)}</p>;
}
export function External({
  href,
  children,
  className = "",
}: {
  href: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <a href={href} target="_blank" rel="noreferrer" className={className}>
      {children}
      <span className="external-mark" aria-hidden="true">
        ↗
      </span>
    </a>
  );
}
