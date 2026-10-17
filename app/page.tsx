import { Invitation } from "@/components/Invitation";

// Guest names are unique per request, so render this route on request.
export const instant = false;

export default async function Home({ searchParams }: PageProps<"/">) {
  const params = await searchParams;
  const rawName = Array.isArray(params.to) ? params.to[0] : params.to;
  const guestName = rawName?.trim().replace(/\s+/g, " ").slice(0, 80) || "Tamu Undangan";
  return <Invitation guestName={guestName} />;
}
