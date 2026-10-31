import { ChevronDown } from "lucide-react";
import { PageHeader } from "@/components/ui";
import { GUIDE } from "@/lib/guide";

export default function Page() {
  return (
    <>
      <PageHeader title="Panduan pemakaian" subtitle="Cara memakai Tabunganku dari awal." />
      <div className="max-w-2xl divide-y divide-line rounded-lg border border-line bg-surface">
        {GUIDE.map((s, i) => {
          const List = s.ordered ? "ol" : "ul";
          return (
            <details key={s.id} open={i === 0} className="group px-4">
              <summary className="flex cursor-pointer list-none items-center justify-between gap-3 py-4 font-medium [&::-webkit-details-marker]:hidden">
                {s.title}
                <ChevronDown size={20} aria-hidden className="shrink-0 text-mute transition-transform group-open:rotate-180" />
              </summary>
              <div className="space-y-3 pb-4 text-sm">
                {s.intro && <p className="text-mute">{s.intro}</p>}
                <List className={`space-y-2 pl-5 ${s.ordered ? "list-decimal" : "list-disc"}`}>
                  {s.items.map((t) => <li key={t}>{t}</li>)}
                </List>
              </div>
            </details>
          );
        })}
      </div>
    </>
  );
}
