import { defineConfig, devices } from "@playwright/test";
export default defineConfig({
  testDir: "./tests",
  webServer: { command: "npm run build && npm start", url: "http://localhost:3000", reuseExistingServer: true },
  projects: [{ name: "mobile", use: { ...devices["Pixel 7"] } }, { name: "desktop", use: { ...devices["Desktop Chrome"] } }],
  use: { baseURL: "http://localhost:3000" },
});
