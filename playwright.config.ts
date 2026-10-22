import { defineConfig } from "@playwright/test";
process.env.NO_PROXY = "localhost,127.0.0.1";
export default defineConfig({
  testDir: "./tests",
  testMatch: "**/*.spec.ts",
  fullyParallel: true,
  workers: 3,
  use: { baseURL: "http://127.0.0.1:4173/tapme/", reducedMotion: "reduce" },
  webServer: {
    command: "npm run preview -- --port 4173",
    url: "http://127.0.0.1:4173/tapme/",
    reuseExistingServer: !process.env.CI,
  },
  projects: [
    { name: "chromium", use: { browserName: "chromium" } },
    { name: "firefox", use: { browserName: "firefox" } },
    { name: "webkit", use: { browserName: "webkit" } },
  ],
});
