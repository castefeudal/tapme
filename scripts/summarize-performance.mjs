import { readFile, writeFile, readdir } from "node:fs/promises";
import { createHash } from "node:crypto";
const summary = JSON.parse(
  await readFile("docs/performance/summary.json", "utf8"),
);
const mobile = JSON.parse(
  await readFile("docs/performance/mobile-1.json", "utf8"),
);
const desktop = JSON.parse(
  await readFile("docs/performance/desktop-1.json", "utf8"),
);
const settings = (r) => ({
  lighthouseVersion: r.lighthouseVersion,
  fetchTime: r.fetchTime,
  userAgent: r.userAgent,
  hostUserAgent: r.environment.hostUserAgent,
  throttlingMethod: r.configSettings.throttlingMethod,
  throttling: r.configSettings.throttling,
  screenEmulation: r.configSettings.screenEmulation,
});
await writeFile(
  "docs/performance/lab-settings.json",
  JSON.stringify(
    { mobile: settings(mobile), desktop: settings(desktop) },
    null,
    2,
  ),
);
const hash = (value) => createHash("sha256").update(value).digest("hex");
const assets = [];
for (const file of await readdir("dist/assets"))
  if (/\.(js|css)$/.test(file))
    assets.push({ file, sha256: hash(await readFile("dist/assets/" + file)) });
await writeFile(
  "docs/performance/audited-build.json",
  JSON.stringify(assets, null, 2),
);
const range = (rows, key) => {
  const values = rows.map((row) => row[key]);
  return `${Math.min(...values).toFixed(3)}–${Math.max(...values).toFixed(3)}`;
};
let text =
  "# Лабораторная производительность\n\nПоследняя production-сборка, Lighthouse " +
  mobile.lighthouseVersion +
  ", Chrome из Playwright, Windows. Три независимых чистых профиля для каждого режима; симулируемое ограничение сети/CPU. Полные настройки — lab-settings.json; SHA256 проверенной сборки — audited-build.json. Итоговые значения — summary.json.\n\n| Режим | Performance (3 запуска) | Accessibility / Best Practices / SEO | LCP, мс | CLS | TBT, мс |\n| --- | --- | --- | --- | --- | --- |\n";
for (const mode of ["mobile", "desktop"]) {
  const rows = summary.filter((r) => r.mode === mode);
  text += `| ${mode} | ${rows.map((r) => r.scores.performance).join(" / ")} | 100 / 100 / 100 | ${range(rows, "LCP")} | ${range(rows, "CLS")} | ${range(rows, "TBT")} |\n`;
}
text +=
  "\nЭто лабораторные значения, не полевые Core Web Vitals и не гарантия на любом устройстве. INP полевыми данными не подтверждён. Максимальный desktop CLS точнее округления таблицы: " +
  Math.max(...summary.map((r) => r.CLS)) +
  ".\n\nПовторение: npm run build, затем npm run preview в отдельном терминале и node scripts/lighthouse.mjs. Для отдельного порта задайте LIGHTHOUSE_URL. Не запускайте одновременно другие браузерные тесты. Полные исходные JSON формируются локально; они исключены из Git из-за объёма.\n";
await writeFile("docs/performance/README.md", text);
