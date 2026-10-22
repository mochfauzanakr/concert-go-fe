import { EventDetailView } from "@/components/demo/user/event-detail";
export default async function Page({ params }: { params: Promise<{ id: string }> }) { const { id } = await params; return <EventDetailView eventId={id} />; }
