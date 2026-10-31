import { Budget } from "@/components/Budget";
import { Planner } from "@/components/Planner";
import { PageHeader } from "@/components/ui";

export default function Page() {
  return (<><PageHeader title="Alokasi & Target" subtitle="Tentukan target, lalu rencana bulanan dihitung otomatis." /><div className="space-y-8"><Planner /><Budget /></div></>);
}
