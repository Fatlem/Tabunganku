"use client";
import { Bar, BarChart, CartesianGrid, Cell, Pie, PieChart, ResponsiveContainer, Tooltip, XAxis } from "recharts";
import { usePrefs } from "@/context/prefs";

const LIGHT = { brand: "#0e7c5a", neutral: "#b9c0b8", mute: "#5c6a62", line: "#e1e4dc", pie: ["#0e7c5a", "#3f9b7d", "#7bbaa4", "#b5d6c9", "#c9cec8"] };
const DARK = { brand: "#34be8c", neutral: "#5b625d", mute: "#949e98", line: "#2d302d", pie: ["#34be8c", "#2b9c73", "#237a5a", "#1b5a43", "#3a3f3b"] };
const useColors = () => (usePrefs().dark ? DARK : LIGHT);

export function TrendChart({ data }: { data: { label: string; income: number; spending: number }[] }) {
  const c = useColors();
  const { money } = usePrefs();
  return (
    <div className="h-56" role="img" aria-label="Grafik tren pemasukan dan pengeluaran 6 bulan terakhir">
      <ResponsiveContainer>
        <BarChart data={data} barGap={4}>
          <CartesianGrid vertical={false} stroke={c.line} strokeDasharray="3 3" />
          <XAxis dataKey="label" axisLine={false} tickLine={false} tick={{ fill: c.mute, fontSize: 12 }} />
          <Tooltip cursor={{ fill: c.line, opacity: 0.4 }} formatter={(v: number, n: string) => [money(v), n]}
            contentStyle={{ borderRadius: 8, border: `1px solid ${c.line}`, background: "transparent", backdropFilter: "none" }} />
          <Bar dataKey="income" name="Pemasukan" fill={c.brand} radius={[3, 3, 0, 0]} />
          <Bar dataKey="spending" name="Pengeluaran" fill={c.neutral} radius={[3, 3, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

export function CategoryDonut({ data }: { data: { name: string; value: number }[] }) {
  const c = useColors();
  const { money } = usePrefs();
  const total = data.reduce((s, d) => s + d.value, 0);
  return (
    <div className="grid items-center gap-4 sm:grid-cols-2">
      <div className="h-48" role="img" aria-label="Diagram distribusi pengeluaran per kategori">
        <ResponsiveContainer>
          <PieChart>
            <Pie data={data} dataKey="value" nameKey="name" innerRadius={58} outerRadius={82} paddingAngle={2} stroke="none">
              {data.map((d, i) => <Cell key={d.name} fill={c.pie[i % c.pie.length]} />)}
            </Pie>
            <Tooltip formatter={(v: number) => money(v)} contentStyle={{ borderRadius: 8, border: `1px solid ${c.line}`, background: "transparent" }} />
          </PieChart>
        </ResponsiveContainer>
      </div>
      <ul className="space-y-2 text-sm">
        {data.map((d, i) => (
          <li key={d.name} className="flex items-center justify-between gap-2">
            <span className="flex items-center gap-2"><i className="size-2.5 rounded-sm" style={{ background: c.pie[i % c.pie.length] }} />{d.name}</span>
            <span className="text-mute">{money(d.value)} · {Math.round((d.value / total) * 100)}%</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
