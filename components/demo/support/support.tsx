"use client";

import { useState, type FormEvent } from "react";
import { Headphones, Plus, Send } from "lucide-react";
import { useDemoReady, useDemoStore } from "@/lib/demo/store";
import { dateTime, type SupportTicket } from "@/lib/demo/model";
import {
  Badge,
  Button,
  DemoNotice,
  Empty,
  Heading,
  inputClass,
  Loading,
  Message,
  Modal,
  UserShell,
} from "../ui";

export function SupportView({ admin = false }: { admin?: boolean }) {
  const ready = useDemoReady();
  const store = useDemoStore();
  const [selected, setSelected] = useState<string | null>(null);
  const [filter, setFilter] = useState("all");
  const [query, setQuery] = useState("");
  const [create, setCreate] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [reply, setReply] = useState("");
  if (!ready)
    return admin ? (
      <Loading />
    ) : (
      <UserShell>
        <Loading />
      </UserShell>
    );
  const items = store.support.filter(
    (item) =>
      (filter === "all" || item.status === filter) &&
      `${item.subject} ${item.id}`.toLowerCase().includes(query.toLowerCase()),
  );
  const ticket = store.support.find((item) => item.id === selected);
  function submit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fields = new FormData(e.currentTarget);
    try {
      const id = store.createSupport(
        String(fields.get("subject")),
        String(fields.get("category")),
        String(fields.get("orderId")),
        String(fields.get("message")),
      );
      setCreate(false);
      setSelected(id);
      setError("");
      setMessage(
        "Permintaan bantuan berhasil dibuat. Kamu dapat mencoba balasannya dari panel admin.",
      );
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Permintaan belum berhasil dibuat.",
      );
    }
  }
  function updateStatus(status: SupportTicket["status"]) {
    if (!ticket) return;
    try {
      store.setSupportStatus(ticket.id, status);
      setError("");
      setMessage("Status percakapan diperbarui.");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Perubahan gagal.");
    }
  }
  const content = (
    <div className="space-y-6">
      <Heading
        eyebrow={admin ? "Layanan pengguna" : "Kami siap membantu"}
        title={admin ? "Pusat bantuan pengguna" : "Ada yang bisa kami bantu?"}
        description={
          admin
            ? "Tanggapi laporan, telusuri pesanan terkait, dan selesaikan percakapan. Balasan langsung terlihat di halaman bantuan pengguna."
            : "Ajukan pertanyaan seputar pesanan, tiket, atau akun. Pantau semua percakapanmu dari sini."
        }
        action={
          !admin && (
            <Button
              onClick={() => {
                setCreate(true);
                setError("");
              }}
            >
              <Plus size={17} />
              Buat permintaan
            </Button>
          )
        }
      />
      {admin && <DemoNotice />}
      <Message message={message} />
      <Message message={!create ? error : ""} error />
      {!admin && (
        <div className="grid gap-4 sm:grid-cols-3">
          {[
            [
              "Bagaimana membuka tiket?",
              "Setelah pembayaran demo berhasil, buka menu E-ticket dan pilih Lihat QR e-ticket.",
            ],
            [
              "Berapa lama batas pembayaran?",
              "Pesanan demo ditahan selama 30 menit. Pesanan yang kedaluwarsa perlu dibuat kembali.",
            ],
            [
              "QR sudah digunakan?",
              "Satu QR hanya untuk satu orang. Hubungi petugas jika kamu merasa belum menggunakannya.",
            ],
          ].map(([title, answer]) => (
            <details key={title} className="demo-card p-4">
              <summary className="cursor-pointer text-sm font-bold">
                {title}
              </summary>
              <p className="mt-3 text-xs leading-6 text-theme-text-muted">
                {answer}
              </p>
            </details>
          ))}
        </div>
      )}
      <div className="grid items-start gap-5 xl:grid-cols-[.85fr_1.3fr]">
        <section className="demo-card overflow-hidden">
          <div className="space-y-3 border-b border-theme-border p-4">
            <input
              className={inputClass}
              aria-label="Cari percakapan"
              placeholder="Cari judul atau nomor laporan..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
            <select
              className={inputClass}
              aria-label="Filter status bantuan"
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
            >
              <option value="all">Semua status</option>
              <option value="open">Terbuka</option>
              <option value="in_progress">Diproses</option>
              <option value="resolved">Selesai</option>
            </select>
          </div>
          {items.length ? (
            <div className="max-h-[620px] divide-y divide-theme-border overflow-y-auto">
              {items.map((item) => (
                <button
                  key={item.id}
                  onClick={() => {
                    setSelected(item.id);
                    setReply("");
                    setError("");
                  }}
                  aria-pressed={selected === item.id}
                  className={`w-full p-5 text-left transition-colors hover:bg-theme-bg-soft ${selected === item.id ? "bg-theme-accent/5" : ""}`}
                >
                  <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
                    <p className="font-mono text-[10px] text-theme-text-light">
                      {item.id}
                    </p>
                    <Badge value={item.status} />
                  </div>
                  <h2 className="text-sm font-bold leading-6">
                    {item.subject}
                  </h2>
                  <p className="mt-2 text-xs text-theme-text-muted">
                    {item.category} · {item.messages.length} pesan
                  </p>
                  <p className="mt-2 text-[10px] text-theme-text-light">
                    {dateTime(item.createdAt)}
                  </p>
                </button>
              ))}
            </div>
          ) : (
            <Empty
              title="Belum ada percakapan"
              description="Buat permintaan bantuan baru atau ubah filter."
            />
          )}
        </section>
        <section className="demo-card overflow-hidden">
          {ticket ? (
            <>
              <div className="space-y-3 border-b border-theme-border p-5">
                <div className="flex flex-wrap justify-between gap-3">
                  <div>
                    <h2 className="font-bold">{ticket.subject}</h2>
                    <p className="mt-1 font-mono text-xs text-theme-text-light">
                      {ticket.id}
                    </p>
                  </div>
                  <Badge value={ticket.status} />
                </div>
                {ticket.orderId && (
                  <a
                    href={`${admin ? "/admin/dashboard/finance/transactions" : "/user/orders"}/${ticket.orderId}`}
                    className="inline-block text-xs font-semibold text-theme-accent"
                  >
                    Lihat pesanan {ticket.orderId} →
                  </a>
                )}
                <div className="flex flex-wrap gap-2">
                  {ticket.status === "resolved" ? (
                    <Button
                      tone="secondary"
                      onClick={() => updateStatus("open")}
                    >
                      Buka kembali percakapan
                    </Button>
                  ) : (
                    admin && (
                      <>
                        <Button
                          tone="secondary"
                          onClick={() => updateStatus("in_progress")}
                        >
                          Tandai diproses
                        </Button>
                        <Button onClick={() => updateStatus("resolved")}>
                          Selesaikan laporan
                        </Button>
                      </>
                    )
                  )}
                </div>
              </div>
              <div
                aria-label="Riwayat percakapan"
                className="max-h-[440px] space-y-4 overflow-y-auto bg-theme-bg-soft p-4 sm:p-5"
              >
                {ticket.messages.map((item) => (
                  <div
                    key={item.id}
                    className={`max-w-[90%] rounded-2xl border p-4 ${item.author === "admin" ? "mr-auto border-theme-border bg-theme-card" : "ml-auto border-theme-accent/20 bg-theme-accent/10"}`}
                  >
                    <p className="mb-2 text-[10px] font-bold uppercase tracking-wider text-theme-accent">
                      {item.author === "admin"
                        ? "Tim ConcertGo"
                        : "Pengguna demo"}
                    </p>
                    <p className="whitespace-pre-wrap break-words text-sm leading-6">
                      {item.text}
                    </p>
                    <time className="mt-2 block text-[10px] text-theme-text-light">
                      {dateTime(item.createdAt)}
                    </time>
                  </div>
                ))}
              </div>
              {ticket.status !== "resolved" ? (
                <form
                  className="space-y-3 border-t border-theme-border p-4 sm:p-5"
                  onSubmit={(e) => {
                    e.preventDefault();
                    try {
                      store.replySupport(
                        ticket.id,
                        reply,
                        admin ? "admin" : "user",
                      );
                      setReply("");
                      setError("");
                      setMessage("Pesan demo berhasil dikirim.");
                    } catch (err) {
                      setError(
                        err instanceof Error
                          ? err.message
                          : "Pesan belum terkirim.",
                      );
                    }
                  }}
                >
                  <label className="demo-label">
                    {admin ? "Balasan untuk pengguna" : "Pesan lanjutan"}
                    <textarea
                      required
                      minLength={2}
                      maxLength={2000}
                      className={inputClass}
                      value={reply}
                      onChange={(e) => setReply(e.target.value)}
                      rows={3}
                      placeholder="Tulis pesanmu di sini..."
                    />
                  </label>
                  <div className="flex justify-end">
                    <Button type="submit">
                      <Send size={15} />
                      Kirim pesan demo
                    </Button>
                  </div>
                </form>
              ) : (
                <p className="p-5 text-center text-xs text-theme-text-muted">
                  Percakapan selesai. Buka kembali untuk mengirim pesan baru.
                </p>
              )}
            </>
          ) : (
            <Empty
              title="Pilih percakapan"
              description="Buka salah satu permintaan bantuan untuk melihat riwayat dan mengirim balasan."
            />
          )}
        </section>
      </div>
      <Modal
        open={create}
        title="Buat permintaan bantuan"
        onClose={() => setCreate(false)}
      >
        <form onSubmit={submit} className="space-y-4">
          <label className="demo-label">
            Judul permintaan
            <input
              name="subject"
              required
              minLength={5}
              maxLength={120}
              className={inputClass}
              placeholder="Ceritakan singkat kendala yang kamu alami"
            />
          </label>
          <div className="grid gap-4 sm:grid-cols-2">
            <label className="demo-label">
              Kategori
              <select name="category" className={inputClass}>
                <option>Tiket</option>
                <option>Pembayaran</option>
                <option>Akun</option>
                <option>Acara</option>
                <option>Lainnya</option>
              </select>
            </label>
            <label className="demo-label">
              Pesanan terkait
              <select name="orderId" className={inputClass}>
                <option value="">Tidak ada</option>
                {store.orders.map((order) => (
                  <option key={order.id}>{order.id}</option>
                ))}
              </select>
            </label>
          </div>
          <label className="demo-label">
            Pesan
            <textarea
              name="message"
              required
              minLength={10}
              maxLength={2000}
              rows={4}
              className={inputClass}
              placeholder="Jelaskan masalah dengan detail. Jangan sertakan password atau OTP."
            />
          </label>
          <Message message={error} error />
          <Button type="submit" className="w-full">
            <Headphones size={16} />
            Kirim permintaan demo
          </Button>
        </form>
      </Modal>
    </div>
  );
  return admin ? content : <UserShell>{content}</UserShell>;
}
