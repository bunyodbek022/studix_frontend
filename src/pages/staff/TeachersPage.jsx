import { useEffect, useMemo, useState } from "react";
import {
    Eye,
    Pencil,
    Plus,
    Search,
    Trash2,
} from "lucide-react";
import { teacherService } from "../../api/teacher.service";
import { useNavigate } from "react-router-dom";
import TeacherDrawer from "./components/TeacherDrawer";

function formatDate(date) {
    if (!date) return "-";
    return new Date(date).toLocaleDateString("en-GB");
}

export default function TeachersPage() {
    const [teachers, setTeachers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [drawerOpen, setDrawerOpen] = useState(false);
    const [editDrawerOpen, setEditDrawerOpen] = useState(false);
    const [editingTeacher, setEditingTeacher] = useState(null);
    const [search, setSearch] = useState("");
    const [error, setError] = useState("");
    const [activeTab, setActiveTab] = useState("ACTIVE");

    const navigate = useNavigate();

    const fetchTeachers = async () => {
        try {
            setLoading(true);
            setError("");
            const res = await teacherService.getTeachers();
            setTeachers(res?.data || []);
        } catch (err) {
            setError(
                err?.response?.data?.message ||
                "O'qituvchilarni yuklashda xatolik yuz berdi"
            );
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchTeachers();
    }, []);

    const filteredTeachers = useMemo(() => {
        return teachers.filter((teacher) => {
            if (activeTab === "INACTIVE" && teacher.status !== "INACTIVE") return false;
            if (activeTab === "ACTIVE" && teacher.status === "INACTIVE") return false;

            const fullName = teacher.fullName?.toLowerCase() || "";
            const email = teacher.email?.toLowerCase() || "";
            const query = search.toLowerCase();

            return fullName.includes(query) || email.includes(query);
        });
    }, [teachers, search, activeTab]);

    const handleView = (teacher) => {
        navigate(`/staff/teachers/${teacher.id}`);
    };

    const handleEdit = (teacher) => {
        setEditingTeacher(teacher);
        setEditDrawerOpen(true);
    };

    const handleDelete = async (id) => {
        const ok = confirm("O'qituvchini o'chirmoqchimisiz?");
        if (!ok) return;

        try {
            await teacherService.deleteTeacher(id);
            await fetchTeachers();
        } catch (err) {
            alert(err?.response?.data?.message || "O'chirishda xatolik");
        }
    };

    return (
        <>
            <div className="mb-6 flex items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-slate-900">O'qituvchilar</h1>
                    <p className="mt-1 text-sm text-slate-500">
                        Barcha o'qituvchilar ro'yxati
                    </p>
                </div>

                <button
                    onClick={() => setDrawerOpen(true)}
                    className="inline-flex items-center gap-2 rounded-2xl bg-violet-600 px-5 py-3 font-medium text-white transition hover:bg-violet-700"
                >
                    <Plus className="h-4 w-4" />
                    O'qituvchi qo'shish
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
                        Faol o'qituvchilar
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

                <div className="flex items-center gap-3">
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
            </div>

            {error && (
                <div className="mb-4 rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
                    {error}
                </div>
            )}

            <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
                <div className="grid grid-cols-[50px_1.5fr_1fr_1fr_1fr_1fr_1fr_100px] gap-4 border-b border-slate-200 bg-slate-50 px-5 py-4 text-sm font-semibold text-slate-600">
                    <span>#</span>
                    <span>Nomi</span>
                    <span>Guruh</span>
                    <span>Telefon</span>
                    <span>Tug'ilgan sanasi</span>
                    <span>Yaratilgan sana</span>
                    <span>Kim qo'shgan</span>
                    <span className="text-right">Amallar</span>
                </div>

                {loading ? (
                    <div className="px-5 py-10 text-center text-slate-500">
                        Yuklanmoqda...
                    </div>
                ) : filteredTeachers.length === 0 ? (
                    <div className="px-5 py-10 text-center text-slate-500">
                        O'qituvchi topilmadi
                    </div>
                ) : (
                    filteredTeachers.map((teacher, index) => (
                        <div
                            key={teacher.id}
                            className="grid grid-cols-[50px_1.5fr_1fr_1fr_1fr_1fr_1fr_100px] items-center gap-4 border-b border-slate-100 px-5 py-4 text-sm"
                        >
                            <span>{index + 1}</span>

                            <div className="flex items-center gap-3">
                                {teacher.photo ? (
                                    <img
                                        src={teacher.photo}
                                        alt={teacher.fullName}
                                        className="h-10 w-10 rounded-full object-cover"
                                    />
                                ) : (
                                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-100 font-semibold text-slate-700">
                                        {teacher.fullName?.[0] || "T"}
                                    </div>
                                )}

                                <span className="font-medium text-slate-800">
                                    {teacher.fullName}
                                </span>
                            </div>

                            <span className="text-slate-600">{teacher.groups?.[0]?.name || "-"}</span>
                            <span className="text-slate-600">{teacher.phone || "-"}</span>
                            <span className="text-slate-600">{formatDate(teacher.birth_date)}</span>
                            <span className="text-slate-600">{formatDate(teacher.created_at)}</span>
                            <span className="text-slate-600">{teacher.addedBy || "-"}</span>

                            <div className="flex justify-end gap-2">
                                <button
                                    onClick={() => handleView(teacher)}
                                    className="rounded-xl p-2 text-slate-700 transition hover:bg-slate-100"
                                >
                                    <Eye className="h-4 w-4" />
                                </button>

                                <button
                                    onClick={() => handleEdit(teacher)}
                                    className="rounded-xl p-2 text-slate-700 transition hover:bg-slate-100"
                                >
                                    <Pencil className="h-4 w-4" />
                                </button>

                                <button
                                    onClick={() => handleDelete(teacher.id)}
                                    className="rounded-xl p-2 text-rose-600 transition hover:bg-rose-50"
                                >
                                    <Trash2 className="h-4 w-4" />
                                </button>
                            </div>
                        </div>
                    ))
                )}
            </div>

            <TeacherDrawer
                open={drawerOpen}
                onClose={() => setDrawerOpen(false)}
                mode="create"
                onSuccess={fetchTeachers}
            />

            <TeacherDrawer
                open={editDrawerOpen}
                onClose={() => setEditDrawerOpen(false)}
                mode="edit"
                initialData={editingTeacher}
                onSuccess={fetchTeachers}
            />
        </>
    );
}
