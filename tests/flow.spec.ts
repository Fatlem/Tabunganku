import { expect, test } from "@playwright/test";

// Lewati pengenalan agar tidak menutupi UI, kecuali pada tes pengenalan itu sendiri.
test.beforeEach(async ({ page }, info) => {
  if (!info.title.includes("pengenalan")) await page.addInitScript(() => localStorage.setItem("tabunganku:intro:v1", "1"));
});

test("pengenalan muncul sekali dan bisa diselesaikan", async ({ page }) => {
  await page.goto("/login");
  const dialog = page.getByRole("dialog");
  await expect(dialog).toBeVisible();
  for (let i = 0; i < 4; i++) await dialog.getByRole("button", { name: "Lanjut" }).click();
  await dialog.getByRole("button", { name: "Mulai" }).click();
  await expect(dialog).toBeHidden();
  await page.reload();
  await expect(page.getByRole("dialog")).toBeHidden();
});

test("guest diarahkan ke login", async ({ page }) => {
  await page.goto("/");
  await expect(page).toHaveURL(/\/login/);
});

test("registrasi, catat transaksi, alert limit, privasi saldo", async ({ page }) => {
  await page.goto("/register");
  await page.getByLabel("Nama").fill("Dina");
  await page.getByLabel("Username").fill(`dina${Date.now() % 1e8}`);
  await page.getByLabel("Email").fill(`dina${Date.now()}@mail.com`);
  await page.getByLabel("Kata sandi", { exact: true }).fill("lemah");
  await expect(page.getByText("Lemah")).toBeVisible();
  await page.getByLabel("Kata sandi", { exact: true }).fill("Rahasia123!");
  await expect(page.getByText("Kuat")).toBeVisible();
  await page.getByLabel("Konfirmasi kata sandi").fill("Rahasia123!");
  await page.getByRole("button", { name: "Daftar" }).click();
  await expect(page).toHaveURL("/");

  await page.goto("/catat"); // gaji default 5,7jt: limit jajan standar ≈ 20% dari sisa
  await page.getByLabel("Nominal").fill("3000000");
  await page.getByLabel("Kategori").selectOption("Uang Jajan");
  await page.getByRole("button", { name: "Simpan transaksi" }).click();
  await page.goto("/alokasi");
  await expect(page.getByText("Melebihi limit")).toBeVisible();

  await page.goto("/");
  await page.getByRole("button", { name: "Sembunyikan nominal" }).click();
  await expect(page.getByText("Rp ••••••••").first()).toBeVisible();
});

test("manifest PWA valid", async ({ request }) => {
  expect((await (await request.get("/manifest.json")).json()).display).toBe("standalone");
});

test("tombol tampil/sembunyi kata sandi", async ({ page }) => {
  await page.goto("/login");
  const pw = page.getByLabel("Kata sandi");
  await expect(pw).toHaveAttribute("type", "password");
  await page.getByRole("button", { name: "Tampilkan kata sandi" }).click();
  await expect(pw).toHaveAttribute("type", "text");
});
