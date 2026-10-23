import { type PlanInput, type ActionPlan } from "./plan";
import type { Lang } from "../config/profile";
import { profile } from "../config/profile";
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
  await document.fonts.load('500 42px "Markov Display"', "PAVEL MARKOV");
  await document.fonts.ready;
  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");
  if (!ctx) throw Error("Canvas is unavailable");
  const width = 1200,
    pad = 76;
  const t = (ru: string, en: string) => (lang === "ru" ? ru : en);
  const blocks = [
    { label: t("ЦЕЛЬ", "GOAL"), text: plan.title, size: 44 },
    { label: t("ПЕРВОЕ ДЕЙСТВИЕ", "FIRST ACTION"), text: plan.today, size: 32 },
    {
      label: t("РАСПИСАНИЕ НЕДЕЛИ", "THIS WEEK"),
      text: plan.sessions
        .map((s) => `${s.date} · ${a.time} · ${s.minutes} ${t("мин", "min")}`)
        .join("\n"),
      size: 27,
    },
    { label: t("ПОВТОРЯТЬ", "REPEAT"), text: plan.practice, size: 29 },
    {
      label: t("ПРОВЕРКА", "REVIEW"),
      text: `${plan.checkpoint}\n${plan.review}\n${plan.metric}`,
      size: 27,
    },
    {
      label: t("ЕСЛИ ПОМЕШАЕТ ПРЕПЯТСТВИЕ", "IF SOMETHING GETS IN THE WAY"),
      text: plan.obstacle,
      size: 27,
    },
    {
      label: t("ИНСТРУМЕНТ", "TOOL"),
      text:
        profile.projects[plan.product].name +
        "\n" +
        profile.projects[plan.product].url,
      size: 25,
    },
    ...(a.direction === "system"
      ? [{ label: t("ОТВЕТСТВЕННЫЙ", "OWNER"), text: plan.owner, size: 27 }]
      : []),
    ...(a.direction === "mind"
      ? [
          {
            label: t("ПРИВЫЧНОЕ СОБЫТИЕ", "ROUTINE CUE"),
            text: plan.cue,
            size: 27,
          },
        ]
      : []),
  ].map((block) => {
    ctx.font = `${block.size}px Manrope`;
    return {
      ...block,
      rows: wrapLines(
        block.text,
        width - pad * 2,
        (value) => ctx.measureText(value).width,
      ),
    };
  });
  canvas.width = width;
  canvas.height =
    240 +
    blocks.reduce(
      (height, b) => height + 75 + b.rows.length * b.size * 1.55,
      0,
    ) +
    130;
  ctx.fillStyle = "#f4f7f8";
  ctx.fillRect(0, 0, width, canvas.height);
  ctx.fillStyle = "#181818";
  ctx.font = '500 42px "Markov Display"';
  ctx.fillText(
    a.quick
      ? "PAVEL MARKOV / BASIC PLAN"
      : "PAVEL MARKOV / PERSONAL ACTION PLAN",
    pad,
    110,
  );
  ctx.fillStyle = "#245975";
  ctx.fillRect(pad, 155, width - pad * 2, 3);
  ctx.fillStyle = "#282725";
  let y = 220;
  for (const block of blocks) {
    ctx.fillStyle = "#245975";
    ctx.font = "600 19px Manrope";
    ctx.fillText(block.label, pad, y);
    y += 45;
    ctx.fillStyle = "#282725";
    ctx.font = `${block.size}px Manrope`;
    for (const row of block.rows) {
      ctx.fillText(row, pad, y);
      y += block.size * 1.55;
    }
    y += 30;
  }
  ctx.fillStyle = "#245975";
  ctx.fillRect(pad, y, width - pad * 2, 1);
  y += 45;
  ctx.font = "22px Manrope";
  ctx.fillText("castefeudal.github.io/tapme", pad, y);
  return new Promise<Blob>((resolve, reject) =>
    canvas.toBlob(
      (blob) => (blob ? resolve(blob) : reject(Error("PNG export failed"))),
      "image/png",
    ),
  );
}
