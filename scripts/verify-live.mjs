import { execFileSync } from "node:child_process";
import { createHash } from "node:crypto";
import { readFile } from "node:fs/promises";
const expected = execFileSync("git", ["rev-parse", "HEAD"], {
  encoding: "utf8",
}).trim();
const root = "https://castefeudal.github.io/tapme/";
const release = await fetch(root + "release.json?sha=" + expected);
if (!release.ok) throw Error("Release manifest unavailable");
const revision = await release.json();
if (revision.sha !== expected)
  throw Error(`Published SHA ${revision.sha} does not match ${expected}`);
const response = await fetch(root + "?sha=" + expected);
if (!response.ok) throw Error("Page unavailable");
const html = await response.text();
const assets = [
  ...html.matchAll(
    /(?:src|href)="(\/tapme\/assets\/([A-Za-z0-9_-]+\.(?:js|css)))"/g,
  ),
];
if (assets.length < 2) throw Error("Production assets not found");
for (const [, path, file] of assets) {
  const remote = await fetch(new URL(path, root));
  if (!remote.ok) throw Error(`Asset unavailable: ${file}`);
  const digest = (value) => createHash("sha256").update(value).digest("hex");
  if (
    digest(Buffer.from(await remote.arrayBuffer())) !==
    digest(await readFile("dist/assets/" + file))
  )
    throw Error(`Asset mismatch: ${file}`);
}
for (const file of [
  "media/hero-portrait.webp",
  "media/fitness.webp",
  "media/portrait-editorial.webp",
  "media/markovmade-preview.webp",
  "media/markovgym-preview.webp",
  "media/pmwork-preview.webp",
  "sitemap.xml",
  "robots.txt",
  "favicon.svg",
]) {
  const check = await fetch(root + file, { method: "HEAD" });
  if (!check.ok) throw Error(`Public file unavailable: ${file}`);
}
console.log(
  JSON.stringify(
    { url: root, sha: expected, assets: assets.length, status: "verified" },
    null,
    2,
  ),
);
