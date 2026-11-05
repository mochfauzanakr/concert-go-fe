"use client";

import { useEffect, useRef, useState } from "react";
import { userService } from "@/services/user.service";
import { ApiError } from "@/services/api-client";
import { useSessionState } from "@/lib/session-state";
import { applySessionUser } from "@/lib/session";
import { assignableRoles, canChangeUserStatus, canEditUser } from "@/lib/user-permissions";
import type { Role, UserDetail, UserListItem } from "@/types/user.types";
import type { GlobalResponse } from "@/types/common.types";
import { Badge, Button, Empty, Heading, Loading, Message, Modal, inputClass } from "@/components/demo/ui";

function errorText(error: unknown) {
  return error instanceof ApiError && error.reqId ? `${error.message} (ID: ${error.reqId})` : error instanceof Error ? error.message : "Permintaan belum berhasil.";
}

export default function UsersManagement({ organizerOnly = false }: { organizerOnly?: boolean }) {
  const actor = useSessionState((state) => state.user);
  const [roles, setRoles] = useState<Role[]>([]);
  const [roleError, setRoleError] = useState("");
  const [rolesRevision, setRolesRevision] = useState(0);
  const [search, setSearch] = useState("");
  const [query, setQuery] = useState("");
  const [role, setRole] = useState(organizerOnly ? "3" : "");
  const [status, setStatus] = useState("");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [rows, setRows] = useState<UserListItem[]>([]);
  const [pagination, setPagination] = useState<GlobalResponse<UserListItem[]>["pagination"]>();
  const [loading, setLoading] = useState(true);
  const [listError, setListError] = useState("");
  const [revision, setRevision] = useState(0);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [detail, setDetail] = useState<UserDetail | null>(null);
  const [detailLoading, setDetailLoading] = useState(false);
  const [detailError, setDetailError] = useState("");
  const [detailRevision, setDetailRevision] = useState(0);
  const [name, setName] = useState("");
  const [newRole, setNewRole] = useState("");
  const [confirm, setConfirm] = useState<"edit" | "status" | null>(null);
  const [saving, setSaving] = useState(false);
  const [notice, setNotice] = useState("");
  const busy = useRef(false);

  useEffect(() => {
    const abort = new AbortController();
    setRoleError("");
    userService.roles(abort.signal).then(setRoles).catch((error) => { if (!abort.signal.aborted) setRoleError(errorText(error)); });
    return () => abort.abort();
  }, [rolesRevision]);
  useEffect(() => {
    const timer = setTimeout(() => { setQuery(search.trim()); setPage(1); }, 300);
    return () => clearTimeout(timer);
  }, [search]);
  useEffect(() => {
    const abort = new AbortController();
    setLoading(true); setListError("");
    userService.list({ page, pageSize, search: query, roleId: role ? Number(role) : undefined, status }, abort.signal)
      .then((response) => {
        if (abort.signal.aborted) return;
        if (page > 1 && response.data.length === 0) { setPage((value) => value - 1); return; }
        setRows(response.data); setPagination(response.pagination);
      })
      .catch((error) => { if (!abort.signal.aborted) { setRows([]); setPagination(null); setListError(errorText(error)); } })
      .finally(() => { if (!abort.signal.aborted) setLoading(false); });
    return () => abort.abort();
  }, [query, role, status, page, pageSize, revision]);
  useEffect(() => {
    if (!selectedId) { setDetail(null); return; }
    const abort = new AbortController();
    setDetail(null); setDetailLoading(true); setDetailError(""); setConfirm(null);
    userService.detail(selectedId, abort.signal).then((result) => {
      if (abort.signal.aborted) return;
      setDetail(result); setName(result.name); setNewRole(result.roleId ? String(result.roleId) : "");
    }).catch((error) => { if (!abort.signal.aborted) setDetailError(errorText(error)); })
      .finally(() => { if (!abort.signal.aborted) setDetailLoading(false); });
    return () => abort.abort();
  }, [selectedId, detailRevision]);

  const roleName = (id?: number | null) => roles.find((item) => item.id === id)?.name || (id ? `Role ${id}` : "Belum ditetapkan");
  function close() { if (!busy.current) { setSelectedId(null); setConfirm(null); setDetailError(""); } }
  async function mutate() {
    if (busy.current || !detail || !actor || !confirm) return;
    const action = confirm;
    busy.current = true; setSaving(true); setDetailError(""); setNotice("");
    try {
      const result = action === "edit"
        ? await userService.update(detail.id, { name: name.trim(), roleId: Number(newRole) })
        : await userService.setStatus(detail.id, detail.status === "ACTIVE" ? "SUSPENDED" : "ACTIVE");
      setDetail(result); setName(result.name); setNewRole(String(result.roleId || "")); setConfirm(null);
      if (result.id === actor.id) applySessionUser(await userService.getProfile());
      setNotice(action === "edit" ? "Perubahan akun berhasil disimpan ke server." : "Status akun berhasil diperbarui di server.");
      setRevision((value) => value + 1);
      setDetailRevision((value) => value + 1);
    } catch (error) { setDetailError(errorText(error)); setConfirm(null); }
    finally { busy.current = false; setSaving(false); }
  }

  if (!actor) return null;
  const editable = detail && canEditUser(actor, detail);
  const statusAllowed = detail && canChangeUserStatus(actor, detail);
  const availableRoles = detail ? assignableRoles(actor, detail, roles) : [];
  return <div className="space-y-6">
    <Heading title={organizerOnly ? "Akun organizer" : "Pengguna"} description="Kelola akun yang terdaftar di server. Pencarian, filter, dan pagination menggunakan data backend." />
    <Message message={notice} />
    {roleError && <div><Message message={roleError} error /><Button tone="secondary" onClick={() => setRolesRevision((value) => value + 1)}>Muat ulang role</Button></div>}
    <section className="demo-card p-4">
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <label className="demo-label">Cari pengguna<input className={inputClass} value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Cari nama atau email..." /></label>
        <label className="demo-label">Filter role<select aria-label="Filter role" className={inputClass} value={role} disabled={organizerOnly} onChange={(event) => { setRole(event.target.value); setPage(1); }}><option value="">Semua role</option>{roles.map((item) => <option key={item.id} value={item.id}>{item.name}</option>)}</select></label>
        <label className="demo-label">Filter status<select aria-label="Filter status" className={inputClass} value={status} onChange={(event) => { setStatus(event.target.value); setPage(1); }}><option value="">Semua status</option><option value="ACTIVE">Aktif</option><option value="SUSPENDED">Disuspend</option></select></label>
        <label className="demo-label">Jumlah per halaman<select aria-label="Jumlah per halaman" className={inputClass} value={pageSize} onChange={(event) => { setPageSize(Number(event.target.value)); setPage(1); }}><option value="10">10</option><option value="20">20</option></select></label>
      </div>
      <Button className="mt-4" tone="secondary" onClick={() => { setSearch(""); setQuery(""); setRole(organizerOnly ? "3" : ""); setStatus(""); setPage(1); }}>Reset filter</Button>
    </section>
    <section className="demo-card overflow-hidden" aria-busy={loading}>
      {loading ? <Loading /> : listError ? <div className="space-y-3 p-5"><Message message={listError} error /><Button onClick={() => setRevision((value) => value + 1)}>Coba lagi</Button></div> : rows.length === 0 ? <Empty title="Tidak ada pengguna ditemukan" /> : <div className="overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead className="bg-theme-card-hover"><tr>{["Nama", "Email", "Role", "Status", "Tindakan"].map((label) => <th className="p-4" key={label}>{label}</th>)}</tr></thead>
          <tbody>{rows.map((item) => <tr key={item.id} className="border-t border-theme-border"><td className="p-4 font-semibold">{item.name}</td><td className="break-all p-4">{item.email}</td><td className="p-4">{roleName(item.roleId)}</td><td className="p-4"><Badge value={item.status.toLowerCase()} /></td><td className="p-4"><Button tone="secondary" onClick={() => { setNotice(""); setSelectedId(item.id); }}>Lihat detail</Button></td></tr>)}</tbody>
        </table>
      </div>}
      {!loading && !listError && <div className="flex flex-wrap items-center justify-between gap-3 border-t border-theme-border p-4">
        <p role="status" className="text-sm">Halaman {pagination?.currentPage || page} dari {pagination?.totalPage || 1} · {pagination?.totalRecords ?? rows.length} pengguna</p>
        <div className="flex gap-2"><Button tone="secondary" disabled={!pagination?.prevPage} onClick={() => setPage(pagination?.prevPage || 1)}>Sebelumnya</Button><Button tone="secondary" disabled={!pagination?.nextPage} onClick={() => setPage(pagination?.nextPage || page)}>Berikutnya</Button></div>
      </div>}
    </section>
    <Modal open={selectedId !== null} title="Detail pengguna" onClose={close}>
      {detailLoading && <Loading />}
      <Message message={detailError} error /><Message message={notice} />
      {!detailLoading && !detail && <Button onClick={() => setDetailRevision((value) => value + 1)}>Coba muat detail lagi</Button>}
      {detail && <div className="space-y-5">
        <dl className="space-y-2 break-words text-sm"><div><dt className="font-semibold">ID akun</dt><dd>{detail.id}</dd></div><div><dt className="font-semibold">Email</dt><dd>{detail.email}</dd></div><div><dt className="font-semibold">Provider</dt><dd>{detail.provider}</dd></div><div><dt className="font-semibold">Status</dt><dd><Badge value={detail.status.toLowerCase()} /></dd></div><div><dt className="font-semibold">Terdaftar</dt><dd>{new Date(detail.createdAt).toLocaleString("id-ID")}</dd></div></dl>
        {!editable && <p className="text-sm text-theme-text-muted">Anda tidak dapat mengedit akun dengan peran ini.</p>}
        <form onSubmit={(event) => { event.preventDefault(); if (name.trim().length < 2 || name.trim().length > 100 || !newRole) { setDetailError("Isi nama 2–100 karakter dan pilih role."); return; } setDetailError(""); setConfirm("edit"); }}>
          <fieldset disabled={!editable || saving || confirm !== null} className="space-y-4">
            <label className="demo-label">Nama lengkap<input className={inputClass} value={name} onChange={(event) => setName(event.target.value)} required minLength={2} maxLength={100} /></label>
            <label className="demo-label">Role akun<select aria-label="Role akun" className={inputClass} value={newRole} onChange={(event) => setNewRole(event.target.value)} required><option value="">Pilih role</option>{availableRoles.map((item) => <option key={item.id} value={item.id}>{item.name}</option>)}{!availableRoles.some((item) => String(item.id) === newRole) && newRole && <option value={newRole} disabled>{roleName(Number(newRole))}</option>}</select></label>
            {editable && <Button type="submit" disabled={saving || roles.length === 0 || !availableRoles.some((item) => item.id === Number(newRole))}>Simpan perubahan</Button>}
          </fieldset>
        </form>
        {statusAllowed && <Button tone={detail.status === "ACTIVE" ? "danger" : "secondary"} disabled={saving || confirm !== null} onClick={() => { setDetailError(""); setConfirm("status"); }}>{detail.status === "ACTIVE" ? "Suspend akun" : "Aktifkan akun"}</Button>}
        {!statusAllowed && <p className="text-xs text-theme-text-muted">Perubahan status dibatasi untuk akun sendiri dan hierarki administrator.</p>}
        {confirm && <section className="space-y-3 rounded-xl border border-theme-border p-4" aria-label="Konfirmasi perubahan">
          <h3 className="font-bold">Konfirmasi perubahan akun</h3>
          <p className="text-sm">{confirm === "edit" ? `Simpan nama “${name.trim()}” dan role ${roleName(Number(newRole))} untuk ${detail.email}?` : `${detail.status === "ACTIVE" ? "Suspend" : "Aktifkan"} akun ${detail.email}?`}</p>
          <div className="flex gap-3"><Button disabled={saving} onClick={() => void mutate()}>{saving ? "Menyimpan..." : "Ya, simpan perubahan"}</Button><Button tone="secondary" disabled={saving} onClick={() => setConfirm(null)}>Batal</Button></div>
        </section>}
      </div>}
    </Modal>
  </div>;
}
