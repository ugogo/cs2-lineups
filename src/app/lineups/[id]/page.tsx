import { notFound } from "next/navigation";
import { LineupDetail } from "@/components/LineupDetail";
import { getLineupById } from "@/lib/queries";

interface LineupPageProps {
  params: Promise<{ id: string }>;
}

export default async function LineupPage({ params }: LineupPageProps) {
  const { id } = await params;
  const lineup = await getLineupById(id);

  if (!lineup) {
    notFound();
  }

  return <LineupDetail lineup={lineup} />;
}
