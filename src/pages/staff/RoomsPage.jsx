import { useEffect, useMemo, useState } from "react";
import { Archive, Eye, Pencil, Plus, RotateCcw, Search, Trash2, X } from "lucide-react";
import { roomService } from "../../api/room.service";

function RoomDrawer({ open, onClose, mode = "create", initialData = null, onSuccess }) {
    const isEdit = mode === "edit";

    const [form, setForm] = useState({ name: "", capacity: "" });
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState("");

    useEffect(() => {
        if (!open) return;

        if (isEdit && initialData) {
            setForm({
                name: initialData.name || "",
                capacity: initialData.capacity || "",
            });
        } else {
            setForm({ name: "", capacity: "" });
        }

        setError("");
        setSubmitting(false);
    }, [open, isEdit, initialData]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            setSubmitting(true);
            setError("");

            const payload = {
                name: form.name,
                capacity: Number(form.capacity),
            };

            if (isEdit) {
                await roomService.updateRoom(initialData.id, payload);
            } else {
                await roomService.createRoom(payload);
            }

            onSuccess?.();
            onClose?.();
        } catch (err) {
            setError(
                err?.response?.data?.message ||
                err?.message ||
                "Saqlashda xatolik yuz berdi"
            );
        } finally {
            setSubmitting(false);
        }
    };

    if (!open) return null;

    return (
        <>
            <button className="fixed inset-0 z-40 bg-black/20" onClick={onClose} />
            <div className="fixed right-0 top-0 z-50 h-full w-full max-w-md overflow-y-auto border-l border-slate-200 bg-white shadow-2xl">
                <div className="flex items-center justify-between border-b border-slate-200 px-6 py-5">
                    <div>
                        <h2 className="text-2xl font-bold text-slate-900">
                            {isEdit ? "Xonani tahrirlash" : "Xona qo'shish"}
                        </h2>
                        <p className="mt-1 text-sm text-slate-500">
                            {isEdit ? "Xona ma'lumotlarini yangilang" : "Yangi xona ma'lumotlarini kiriting"}
                        </p>
                    </div>
                    <button onClick={onClose} className="rounded-xl p-2 text-slate-500 transition hover:bg-slate-100">
                        <X className="h-5 w-5" />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4 px-6 py-5">
                    <div>
                        <label className="mb-2 block text-sm font-medium text-slate-700">
                            Xona nomi
                        </label>
                        <input
                            name="name"
                            value={form.name}
                            onChange={handleChange}
                            placeholder="Room A"
                            required
                            className="h-11 w-full rounded-xl border border-slate-200 px-4 outline-none focus:border-violet-400"
                        />
                    </div>

                    <div>
                        <label className="mb-2 block text-sm font-medium text-slate-700">
                            Sig'imi (o'rin soni)
                        </label>
                        <input
                            name="capacity"
                            type="number"
                            value={form.capacity}
                            onChange={handleChange}
                            placeholder="20"
                            required
                            min={1}
                            className="h-11 w-full rounded-xl border border-slate-200 px-4 outline-none focus:border-violet-400"
                        />
                    </div>

                    {error && (
                        <div className="rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
                            {error}
                        </div>
                    )}

                    <div className="flex gap-3 pt-2">
                        <button
                            type="button"
                            onClick={onClose}
                            className="flex-1 rounded-xl border border-slate-200 py-3 font-medium text-slate-700"
                        >
                            Bekor qilish
                        </button>
                        <button
                            type="submit"
                            disabled={submitting}
                            className="flex-1 rounded-xl bg-violet-500 py-3 font-medium text-white transition hover:bg-violet-700 disabled:opacity-50"
                        >
                            {submitting
                                ? isEdit ? "Yangilanmoqda..." : "Saqlanmoqda..."
                                : isEdit ? "Yangilash" : "Saqlash"}
                        </button>
                    </div>
                </form>
            </div>
        </>
    );
}

export default function RoomsPage() {
    const [rooms, setRooms] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");
    const [error, setError] = useState("");
    const [activeTab, setActiveTab] = useState("ACTIVE");
    const [drawerOpen, setDrawerOpen] = useState(false);
    const [editDrawerOpen, setEditDrawerOpen] = useState(false);
    const [editingRoom, setEditingRoom] = useState(null);

    const fetchRooms = async () => {
        try {
            setLoading(true);
            setError("");
            const res = await roomService.getRooms({ limit: 100 });
            setRooms(res?.data || []);
        } catch (err) {
            setError(
                err?.response?.data?.message ||
                "Xonalarni yuklashda xatolik yuz berdi"
            );
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchRooms();
    }, []);

    const filteredRooms = useMemo(() => {
        return rooms.filter((room) => {
            if (activeTab === "INACTIVE" && room.status !== "INACTIVE") return false;
            if (activeTab === "ACTIVE" && room.status === "INACTIVE") return false;

            const name = room.name?.toLowerCase() || "";
            const query = search.toLowerCase();
            return name.includes(query);
        });
    }, [rooms, search, activeTab]);

    const handleEdit = (room) => {
        setEditingRoom(room);
        setEditDrawerOpen(true);
    };

    const handleArchive = async (id) => {
        const ok = confirm("Xonani arxivga o'tkazmoqchimisiz?");
        if (!ok) return;
        try {
            await roomService.archiveRoom(id);
            await fetchRooms();
        } catch (err) {
            alert(err?.response?.data?.message || "Arxivga o'tkazishda xatolik");
        }
    };

    const handleRestore = async (id) => {
        const ok = confirm("Xonani faollashtirishmoqchimisiz?");
        if (!ok) return;
        try {
            await roomService.restoreRoom(id);
            await fetchRooms();
        } catch (err) {
            alert(err?.response?.data?.message || "Faollashtirishda xatolik");
        }
    };

    const handleDelete = async (id) => {
        const ok = confirm("Xonani butunlay o'chirmoqchimisiz? Bu amalni qaytarib bo'lmaydi!");
        if (!ok) return;
        try {
            await roomService.deleteRoom(id);
            await fetchRooms();
        } catch (err) {
            alert(err?.response?.data?.message || "O'chirishda xatolik");
        }
    };

    return (
        <>
            <div className="mb-6 flex items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-slate-900">Xonalar</h1>
                    <p className="mt-1 text-sm text-slate-500">
                        Barcha xonalar ro'yxati
                    </p>
                </div>

                <button
                    onClick={() => setDrawerOpen(true)}
                    className="inline-flex items-center gap-2 rounded-2xl bg-violet-500 px-5 py-3 font-medium text-white transition hover:bg-violet-700"
                >
                    <Plus className="h-4 w-4" />
                    Xona qo'shish
                </button>
            </div>

            <div className="mb-6 flex items-center justify-between gap-4">
                <div className="flex items-center gap-6">
                    <button
                        onClick={() => setActiveTab("ACTIVE")}
                        className={`rounded-xl px-4 py-2 text-sm font-medium transition-colors ${
                            activeTab === "ACTIVE"
                                ? "bg-white text-slate-900 shadow-sm"
                                : "text-slate-500 hover:text-slate-700"
                        }`}
                    >
                        Faol xonalar
                    </button>
                    <button
                        onClick={() => setActiveTab("INACTIVE")}
                        className={`rounded-xl px-4 py-2 text-sm font-medium transition-colors ${
                            activeTab === "INACTIVE"
                                ? "bg-white text-slate-900 shadow-sm"
                                : "text-slate-500 hover:text-slate-700"
                        }`}
                    >
                        Arxiv
                    </button>
                </div>

                <div className="relative w-72">
                    <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                    <input
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        placeholder="Qidirish..."
                        className="h-11 w-full rounded-2xl border border-slate-200 bg-white pl-10 pr-4 text-sm outline-none focus:border-violet-400"
                    />
                </div>
            </div>

            {error && (
                <div className="mb-4 rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
                    {error}
                </div>
            )}

            <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
                <div className="grid grid-cols-[50px_1fr_1fr_1fr_120px] gap-4 border-b border-slate-200 bg-slate-50 px-5 py-4 text-xs font-semibold uppercase tracking-wide text-slate-500">
                    <span>№</span>
                    <span>Nomi</span>
                    <span>Sig'imi</span>
                    <span>Yaratilgan sana</span>
                    <span className="text-right">Amallar</span>
                </div>

                {loading ? (
                    <div className="px-5 py-10 text-center text-slate-500">
                        Yuklanmoqda...
                    </div>
                ) : filteredRooms.length === 0 ? (
                    <div className="px-5 py-10 text-center text-slate-500">
                        Xona topilmadi
                    </div>
                ) : (
                    filteredRooms.map((room, index) => (
                        <div
                            key={room.id}
                            className="grid grid-cols-[50px_1fr_1fr_1fr_120px] items-center gap-4 border-b border-slate-100 px-5 py-3 text-xs last:border-b-0"
                        >
                            <span className="text-slate-400">{index + 1}</span>

                            <span className="font-medium text-slate-800">
                                {room.name}
                            </span>

                            <span className="text-slate-600">
                                {room.capacity} o'rin
                            </span>

                            <span className="text-slate-600">
                                {room.created_at
                                    ? new Date(room.created_at).toLocaleDateString("en-GB")
                                    : "-"}
                            </span>

                            <div className="flex justify-end gap-2">
                                {activeTab === "ACTIVE" && (
                                    <>
                                        <button
                                            onClick={() => handleEdit(room)}
                                            className="rounded-xl p-2 text-slate-700 transition hover:bg-slate-100"
                                            title="Tahrirlash"
                                        >
                                            <Pencil className="h-3.5 w-3.5" />
                                        </button>
                                        <button
                                            onClick={() => handleArchive(room.id)}
                                            className="rounded-xl p-2 text-amber-500 transition hover:bg-amber-50"
                                            title="Arxivga o'tkazish"
                                        >
                                            <Archive className="h-3.5 w-3.5" />
                                        </button>
                                    </>
                                )}

                                {activeTab === "INACTIVE" && (
                                    <>
                                        <button
                                            onClick={() => handleRestore(room.id)}
                                            className="rounded-xl p-2 text-emerald-600 transition hover:bg-emerald-50"
                                            title="Faollashtirish"
                                        >
                                            <RotateCcw className="h-3.5 w-3.5" />
                                        </button>
                                        <button
                                            onClick={() => handleDelete(room.id)}
                                            className="rounded-xl p-2 text-rose-600 transition hover:bg-rose-50"
                                            title="O'chirish"
                                        >
                                            <Trash2 className="h-3.5 w-3.5" />
                                        </button>
                                    </>
                                )}
                            </div>
                        </div>
                    ))
                )}
            </div>

            <RoomDrawer
                open={drawerOpen}
                onClose={() => setDrawerOpen(false)}
                mode="create"
                onSuccess={fetchRooms}
            />

            <RoomDrawer
                open={editDrawerOpen}
                onClose={() => setEditDrawerOpen(false)}
                mode="edit"
                initialData={editingRoom}
                onSuccess={fetchRooms}
            />
        </>
    );
}