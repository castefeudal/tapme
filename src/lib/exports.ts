import { type PlanInput, type ActionPlan, planText } from "./plan";
import type { Lang } from "../config/profile";
export function download(blob: Blob, name: string) {
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = name;
  document.body.append(link);
  link.click();
  link.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}
export function escapeICS(value: string) {
  return value
    .replace(/\\/g, "\\\\")
    .replace(/\r?\n/g, "\\n")
    .replace(/;/g, "\\;")
    .replace(/,/g, "\\,");
}
export function foldICS(value: string) {
  const encoder = new TextEncoder();
  let line = "",
    size = 0;
  const lines: string[] = [];
  for (const char of value) {
    const bytes = encoder.encode(char).length;
    if (size + bytes > 73) {
      lines.push(line);
      line = " " + char;
      size = 1 + bytes;
    } else {
      line += char;
      size += bytes;
    }
  }
  lines.push(line);
  return lines.join("\r\n");
}
function stamp(date: Date) {
  return `${date.getFullYear()}${String(date.getMonth() + 1).padStart(2, "0")}${String(date.getDate()).padStart(2, "0")}T${String(date.getHours()).padStart(2, "0")}${String(date.getMinutes()).padStart(2, "0")}00`;
}
export function calendar(
  plan: ActionPlan,
  a: PlanInput,
  lang: Lang,
  now = new Date(),
) {
  let hash = 2166136261;
  for (const char of JSON.stringify(a))
    hash = Math.imul(hash ^ char.charCodeAt(0), 16777619);
  const id = (hash >>> 0).toString(16);
  const dtstamp = now
    .toISOString()
    .replace(/[-:]/g, "")
    .replace(/\.\d{3}/, "");
  const lines = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//Pavel Markov//Your Next Move//" + lang.toUpperCase(),
    "CALSCALE:GREGORIAN",
    "METHOD:PUBLISH",
    ...plan.sessions.flatMap((s, k) => {
      const begin = new Date(s.date + "T" + a.time + ":00");
      const end = new Date(begin.getTime() + s.minutes * 60000);
      return [
        "BEGIN:VEVENT",
        `UID:${id}-${k}@tapme.markov`,
        `DTSTAMP:${dtstamp}`,
        `DTSTART:${stamp(begin)}`,
        `DTEND:${stamp(end)}`,
        `RRULE:FREQ=WEEKLY;COUNT=${a.weeks}`,
        `SUMMARY:${escapeICS(plan.title)}`,
        `DESCRIPTION:${escapeICS(s.action + "\n" + plan.obstacle + "\n" + plan.metric)}`,
        "END:VEVENT",
      ];
    }),
    "BEGIN:VEVENT",
    `UID:${id}-review@tapme.markov`,
    `DTSTAMP:${dtstamp}`,
    `DTSTART;VALUE=DATE:${plan.checkpoint.replace(/-/g, "")}`,
    `SUMMARY:${escapeICS((lang === "ru" ? "Проверка недели: " : "Weekly review: ") + plan.title)}`,
    `DESCRIPTION:${escapeICS(plan.review + "\n" + plan.metric)}`,
    "END:VEVENT",
    "END:VCALENDAR",
  ];
  return lines.map(foldICS).join("\r\n") + "\r\n";
}
export function wrapLines(
  text: string,
  width: number,
  measure: (value: string) => number,
) {
  const rows: string[] = [];
  for (const paragraph of text.split("\n")) {
    let row = "";
    for (const word of paragraph.split(" ")) {
      if (measure(row + (row ? " " : "") + word) <= width) {
        row += (row ? " " : "") + word;
        continue;
      }
      if (row) {
        rows.push(row);
        row = "";
      }
      for (const char of word) {
        if (measure(row + char) > width && row) {
          rows.push(row);
          row = "";
        }
        row += char;
      }
    }
    rows.push(row);
  }
  return rows;
}
export async function exportPNG(plan: ActionPlan, a: PlanInput, lang: Lang) {
  await document.fonts.ready;
  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");
  if (!ctx) throw Error("Canvas is unavailable");
  const width = 1200,
    pad = 76,
    lineHeight = 43;
  ctx.font = "27px Manrope";
  const rows = wrapLines(
    planText(plan, a, lang),
    width - pad * 2,
    (value) => ctx.measureText(value).width,
  );
  canvas.width = width;
  canvas.height = 240 + rows.length * lineHeight + 80;
  ctx.fillStyle = "#f2efe9";
  ctx.fillRect(0, 0, width, canvas.height);
  ctx.fillStyle = "#181818";
  ctx.font = "600 33px Manrope";
  ctx.fillText("PAVEL MARKOV / YOUR NEXT MOVE", pad, 110);
  ctx.fillStyle = "#a47e4d";
  ctx.fillRect(pad, 155, width - pad * 2, 3);
  ctx.fillStyle = "#282725";
  ctx.font = "27px Manrope";
  rows.forEach((row, j) => ctx.fillText(row, pad, 235 + j * lineHeight));
  return new Promise<Blob>((resolve, reject) =>
    canvas.toBlob(
      (blob) => (blob ? resolve(blob) : reject(Error("PNG export failed"))),
      "image/png",
    ),
  );
}
