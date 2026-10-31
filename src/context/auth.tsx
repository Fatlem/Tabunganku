"use client";
import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { isStrong } from "@/lib/password";

/** MOCK: akun disimpan di localStorage. Ganti dengan backend/NextAuth sebelum produksi. */
export interface User { id: string; name: string; username: string; email: string }
interface Stored extends User { hash: string }
interface ResetRecord { email: string; codeHash: string; expires: number }

const USERS = "tabunganku:users:v3";
const SESSION = "tabunganku:session:v3";
const RESET = "tabunganku:reset:v3";
const RESET_TTL = 10 * 60 * 1000;
export const dataKey = (id: string) => `tabunganku:data:${id}`;

const readUsers = (): Stored[] => { try { return JSON.parse(localStorage.getItem(USERS) ?? "[]"); } catch { return []; } };
const writeUsers = (u: Stored[]) => localStorage.setItem(USERS, JSON.stringify(u));
const pub = ({ id, name, username, email }: Stored): User => ({ id, name, username, email });

const norm = (s: string) => s.trim().toLowerCase();
const USERNAME_RE = /^[a-z0-9_.]{3,20}$/;
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const weakMsg = (p: string) => (isStrong(p) ? null : "Kata sandi belum memenuhi semua syarat.");

async function sha256(s: string) {
  const buf = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(s));
  return [...new Uint8Array(buf)].map((b) => b.toString(16).padStart(2, "0")).join("");
}

interface AuthCtx {
  user: User | null; ready: boolean;
  login: (username: string, password: string) => Promise<string | null>;
  register: (name: string, username: string, email: string, password: string) => Promise<string | null>;
  /** Mock: tanpa server email, kode dikembalikan agar bisa ditampilkan. Produksi: kirim lewat email. */
  requestReset: (email: string) => Promise<{ error: string } | { code: string }>;
  confirmReset: (email: string, code: string, next: string) => Promise<string | null>;
  changePassword: (current: string, next: string) => Promise<string | null>;
  logout: () => void; deleteAccount: () => void;
}
const Ctx = createContext<AuthCtx | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const found = readUsers().find((u) => u.id === localStorage.getItem(SESSION));
    setUser(found ? pub(found) : null);
    setReady(true);
  }, []);

  const open = useCallback((u: Stored) => { localStorage.setItem(SESSION, u.id); setUser(pub(u)); }, []);
  const logout = useCallback(() => { localStorage.removeItem(SESSION); setUser(null); }, []);

  const register = useCallback<AuthCtx["register"]>(async (name, username, email, password) => {
    const uname = norm(username), mail = norm(email);
    if (!USERNAME_RE.test(uname)) return "Username 3–20 karakter: huruf, angka, titik, atau garis bawah.";
    if (!EMAIL_RE.test(mail)) return "Format email tidak valid.";
    const weak = weakMsg(password);
    if (weak) return weak;
    const users = readUsers();
    if (users.some((u) => u.username === uname)) return "Username sudah dipakai.";
    if (users.some((u) => u.email === mail)) return "Email sudah terdaftar.";
    const u: Stored = { id: crypto.randomUUID(), name: name.trim(), username: uname, email: mail, hash: await sha256(password) };
    writeUsers([...users, u]); open(u);
    return null;
  }, [open]);

  const login = useCallback<AuthCtx["login"]>(async (username, password) => {
    const u = readUsers().find((x) => x.username === norm(username));
    if (!u || u.hash !== (await sha256(password))) return "Username atau kata sandi salah.";
    open(u);
    return null;
  }, [open]);

  const requestReset = useCallback<AuthCtx["requestReset"]>(async (email) => {
    const mail = norm(email);
    if (!readUsers().some((u) => u.email === mail)) return { error: "Email tidak terdaftar." };
    const code = String(crypto.getRandomValues(new Uint32Array(1))[0] % 1_000_000).padStart(6, "0");
    const rec: ResetRecord = { email: mail, codeHash: await sha256(code), expires: Date.now() + RESET_TTL };
    localStorage.setItem(RESET, JSON.stringify(rec));
    return { code };
  }, []);

  const confirmReset = useCallback<AuthCtx["confirmReset"]>(async (email, code, next) => {
    const rec: ResetRecord | null = JSON.parse(localStorage.getItem(RESET) ?? "null");
    if (!rec || rec.email !== norm(email) || rec.expires < Date.now() || rec.codeHash !== (await sha256(code.trim())))
      return "Kode salah atau sudah kedaluwarsa.";
    const weak = weakMsg(next);
    if (weak) return weak;
    const hash = await sha256(next);
    writeUsers(readUsers().map((u) => (u.email === rec.email ? { ...u, hash } : u)));
    localStorage.removeItem(RESET);
    return null;
  }, []);

  const changePassword = useCallback<AuthCtx["changePassword"]>(async (current, next) => {
    const users = readUsers();
    const u = users.find((x) => x.id === user?.id);
    if (!u || u.hash !== (await sha256(current))) return "Kata sandi saat ini salah.";
    const weak = weakMsg(next);
    if (weak) return weak;
    const hash = await sha256(next);
    writeUsers(users.map((x) => (x.id === u.id ? { ...x, hash } : x)));
    return null;
  }, [user]);

  const deleteAccount = useCallback(() => {
    if (!user) return;
    writeUsers(readUsers().filter((u) => u.id !== user.id));
    localStorage.removeItem(dataKey(user.id));
    logout();
  }, [user, logout]);

  const value = useMemo(() => ({ user, ready, login, register, requestReset, confirmReset, changePassword, logout, deleteAccount }),
    [user, ready, login, register, requestReset, confirmReset, changePassword, logout, deleteAccount]);
  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export const useAuth = () => {
  const c = useContext(Ctx);
  if (!c) throw new Error("useAuth harus di dalam AuthProvider");
  return c;
};
