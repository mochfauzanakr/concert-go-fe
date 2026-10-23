"use client";
import Link from "next/link";
import type { EventItem } from "@/lib/eventsData";
import type { UserProfile } from "@/lib/userProfile";
import { Modal, DemoNotice } from "@/components/demo/ui";
import { money } from "@/lib/demo/model";

type MyTicket = { id: string; eventId: string; eventTitle: string; venue: string; date: string; time: string; tierName: string; qty: number; totalPrice: number; status: "Aktif" | "Menunggu Pembayaran"; bookingCode: string };
export default function CheckoutModal(props: { event: EventItem; userProfile: UserProfile; onClose: () => void; onSuccess?: (ticket: MyTicket) => void }) {
  const { event, onClose } = props;
  return <Modal open title="Lanjutkan pemesanan tiket" onClose={onClose}><div className="space-y-5"><DemoNotice /><img src={event.image} alt={event.title} className="h-40 w-full rounded-2xl object-cover" /><div><h2 className="text-xl font-bold">{event.title}</h2><p className="mt-2 text-sm text-theme-text-muted">{event.venue}, {event.city}</p><p className="mt-2 text-sm font-semibold text-theme-accent">Mulai dari {money(event.priceFrom)}</p></div><p className="text-sm leading-6 text-theme-text-muted">Pilih kategori dan jumlah tiket, lengkapi data pemesan, lalu coba pembayaran demo. Pesananmu akan tersimpan dan terlihat di panel admin.</p><Link className="demo-button demo-button-primary w-full" href={`/user/checkout?event=${encodeURIComponent(event.id)}`}>Pilih tiket & lanjutkan</Link><Link className="block text-center text-sm font-semibold text-theme-accent" href={`/user/events/${event.id}`}>Lihat detail acara terlebih dahulu</Link></div></Modal>;
}
