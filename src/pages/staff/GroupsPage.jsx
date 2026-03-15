import { useEffect, useMemo, useState } from "react";
import { Eye, Search } from "lucide-react";
import { groupService } from "../../api/group.service";
import { useNavigate } from "react-router-dom";

function formatDate(date) {
    if (!date) return "-";
    return new Date(date).toLocaleDateString("en-GB");
}

export default function GroupsPage() {
    const [groups, setGroups] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");
    const [error, setError] = useState("");

    const navigate = useNavigate();

    const fetchGroups = async () => {
        try {
            setLoading(true);
            setError("");
            const res = await groupService.getAllGroups();
            setGroups(res?.data || []);
        } catch (err) {
            setError(
                err?.response?.data?.message ||
                "Guruhlarni yuklashda xatolik yuz berdi"
            );
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
            const name = group.name?.toLowerCase() || "";
            const query = search.toLowerCase();

            return name.includes(query);
        });
    }, [groups, search]);

    const handleView = (group) => {
        navigate(`/staff/groups/${group.id}`);
    };

    return (
        <>
            <div className="mb-6 flex items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-slate-900">Guruhlar</h1>
                    <p className="mt-1 text-sm text-slate-500">
                        Barcha guruhlar ro'yxati
                    </p>
                </div>
            </div>

            <div className="mb-4 flex items-center gap-3">
                <div className="relative w-full max-w-md">
                    <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                    <input
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        placeholder="Guruh nomini qidirish..."
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
                <div className="grid grid-cols-[70px_1fr_1fr_1fr_1fr_130px] gap-4 border-b border-slate-200 bg-slate-50 px-5 py-4 text-sm font-semibold text-slate-600">
                    <span>№</span>
                    <span>Nomi</span>
                    <span>Kurs</span>
                    <span>O'qituvchi</span>
                    <span>Vaqti</span>
                    <span className="text-right">Amallar</span>
                </div>

                {loading ? (
                    <div className="px-5 py-10 text-center text-slate-500">
                        Yuklanmoqda...
                    </div>
                ) : filteredGroups.length === 0 ? (
                    <div className="px-5 py-10 text-center text-slate-500">
                        Guruh topilmadi
                    </div>
                ) : (
                    filteredGroups.map((group, index) => (
                        <div
                            key={group.id}
                            className="grid grid-cols-[70px_1fr_1fr_1fr_1fr_130px] items-center gap-4 border-b border-slate-100 px-5 py-4 text-sm"
                        >
                            <span>{index + 1}</span>

                            <div className="flex items-center gap-3 font-medium text-slate-800">
                                {group.name}
                            </div>

                            <span className="text-slate-600">{group.course?.name || "-"}</span>
                            <span className="text-slate-600">{group.teacher?.fullName || "-"}</span>
                            <span className="text-slate-600">
                                {formatDate(group.startDate)} | {group.startTime || "-"}
                            </span>

                            <div className="flex justify-end gap-2">
                                <button
                                    onClick={() => handleView(group)}
                                    className="rounded-xl p-2 text-slate-700 transition hover:bg-slate-100"
                                >
                                    <Eye className="h-4 w-4" />
                                </button>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </>
    );
}

