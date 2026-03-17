import { useEffect, useMemo, useState } from "react";
import { Archive, Eye, Plus, Pencil, RotateCcw, Search, Trash2 } from "lucide-react";
import { groupService } from "../../api/group.service";
import { useNavigate } from "react-router-dom";
import GroupDrawer from "./components/GroupDrawer";

function formatDate(date) {
    if (!date) return "-";
    return new Date(date).toLocaleDateString("en-GB");
}

export default function GroupsPage() {
    const [groups, setGroups] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");
    const [error, setError] = useState("");
    const [activeTab, setActiveTab] = useState("ACTIVE");
    const [editDrawerOpen, setEditDrawerOpen] = useState(false);
    const [editingGroup, setEditingGroup] = useState(null);
    const [drawerOpen, setDrawerOpen] = useState(false);

    const navigate = useNavigate();

    const fetchGroups = async () => {
        try {
            setLoading(true);
            setError("");
            const res = await groupService.getAllGroups();
            setGroups(res?.data || []);
        } catch (err) {
            setError(err?.response?.data?.message || "Guruhlarni yuklashda xatolik yuz berdi");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchGroups();
    }, []);

    const filteredGroups = useMemo(() => {
        if (!groups) return [];
        return groups.filter((group) => {
            if (activeTab === "INACTIVE" && group.status !== "INACTIVE") return false;
            if (activeTab === "ACTIVE" && group.status === "INACTIVE") return false;

            const name = group.name?.toLowerCase() || "";
            const query = search.toLowerCase();
            return name.includes(query);
        });
    }, [groups, search, activeTab]);

    const handleView = (group) => {
        navigate(`/staff/groups/${group.id}`);
    };

    const handleEdit = (group) => {
        setEditingGroup(group);
        setEditDrawerOpen(true);
    };

    const handleArchive = async (id) => {
        const ok = confirm("Guruhni arxivga o'tkazmoqchimisiz?");
        if (!ok) return;

        try {
            await groupService.archiveGroup(id);
            await fetchGroups();
        } catch (err) {
            alert(err?.response?.data?.message || "Arxivga o'tkazishda xatolik");
        }
    };

    const handleRestore = async (id) => {
        const ok = confirm("Guruhni faollashtirishmoqchimisiz?");
        if (!ok) return;

        try {
            await groupService.restoreGroup(id);
            await fetchGroups();
        } catch (err) {
            alert(err?.response?.data?.message || "Faollashtirishda xatolik");
        }
    };

    const handleDelete = async (id) => {
        const ok = confirm("Guruhni butunlay o'chirmoqchimisiz? Bu amalni qaytarib bo'lmaydi!");
        if (!ok) return;

        try {
            await groupService.deleteGroup(id);
            await fetchGroups();
        } catch (err) {
            alert(err?.response?.data?.message || "O'chirishda xatolik");
        }
    };

    return (
        <>
            <div className="mb-6 flex items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-slate-900">Guruhlar</h1>
                    <p className="mt-1 text-sm text-slate-500">Barcha guruhlar ro'yxati</p>
                </div>
                <button
                    onClick={() => setDrawerOpen(true)}
                    className="inline-flex items-center gap-2 rounded-2xl bg-violet-500 px-5 py-3 font-medium text-white transition hover:bg-violet-700"
                >
                    <Plus className="h-4 w-4" />
                    Guruh qo'shish
                </button>
                <GroupDrawer
                    open={drawerOpen}
                    onClose={() => setDrawerOpen(false)}
                    mode="create"
                    onSuccess={fetchGroups}
                />
                <GroupDrawer
                    open={editDrawerOpen}
                    onClose={() => setEditDrawerOpen(false)}
                    mode="edit"
                    initialData={editingGroup}
                    onSuccess={fetchGroups}
                />
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
                        Faol guruhlar
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
                <div className="grid grid-cols-[50px_1fr_1fr_1fr_1fr_120px] gap-4 border-b border-slate-200 bg-slate-50 px-5 py-4 text-xs font-semibold uppercase tracking-wide text-slate-500">
                    <span>№</span>
                    <span>Nomi</span>
                    <span>Kurs</span>
                    <span>O'qituvchi</span>
                    <span>Vaqti</span>
                    <span className="text-right">Amallar</span>
                </div>

                {loading ? (
                    <div className="px-5 py-10 text-center text-slate-500">Yuklanmoqda...</div>
                ) : filteredGroups.length === 0 ? (
                    <div className="px-5 py-10 text-center text-slate-500">Guruh topilmadi</div>
                ) : (
                    filteredGroups.map((group, index) => (
                        <div
                            key={group.id}
                            className="grid grid-cols-[50px_1fr_1fr_1fr_1fr_120px] items-center gap-4 border-b border-slate-100 px-5 py-3 text-xs last:border-b-0"
                        >
                            <span className="text-slate-400">{index + 1}</span>

                            <span className="font-medium text-slate-800">{group.name}</span>

                            <span className="text-slate-600">{group.course?.name || "-"}</span>

                            <span className="text-slate-600">{group.teacher?.fullName || "-"}</span>

                            <span className="text-slate-600">
                                {formatDate(group.startDate)} | {group.startTime || "-"}
                            </span>

                            <div className="flex justify-end gap-2">
                                {activeTab === "ACTIVE" && (
                                    <>
                                        <button
                                            onClick={() => handleView(group)}
                                            className="rounded-xl p-2 text-slate-700 transition hover:bg-slate-100"
                                            title="Ko'rish"
                                        >
                                            <Eye className="h-3.5 w-3.5" />
                                        </button>
                                        <button
                                            onClick={() => handleEdit(group)}
                                            className="rounded-xl p-2 text-slate-700 transition hover:bg-slate-100"
                                            title="Tahrirlash"
                                        >
                                            <Pencil className="h-3.5 w-3.5" />
                                        </button>
                                        <button
                                            onClick={() => handleArchive(group.id)}
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
                                            onClick={() => handleView(group)}
                                            className="rounded-xl p-2 text-slate-700 transition hover:bg-slate-100"
                                            title="Ko'rish"
                                        >
                                            <Eye className="h-3.5 w-3.5" />
                                        </button>
                                        <button
                                            onClick={() => handleRestore(group.id)}
                                            className="rounded-xl p-2 text-emerald-600 transition hover:bg-emerald-50"
                                            title="Faollashtirish"
                                        >
                                            <RotateCcw className="h-3.5 w-3.5" />
                                        </button>
                                        <button
                                            onClick={() => handleDelete(group.id)}
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
        </>
    );
}
