import { notFound } from "next/navigation";
import { SettingsDetail } from "@/components/SettingsDetail";
import { isSettingsSlug, SETTINGS } from "@/lib/settings";

export function generateStaticParams() { return SETTINGS.map(({ slug }) => ({ section: slug })); }

export default async function Page({ params }: { params: Promise<{ section: string }> }) {
  const { section } = await params;
  if (!isSettingsSlug(section)) notFound();
  return <SettingsDetail slug={section} />;
}
