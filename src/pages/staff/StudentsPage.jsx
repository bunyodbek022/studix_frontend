import { useEffect, useMemo, useState } from "react";
import {
    Eye,
    Pencil,
    Plus,
    Search,
    Trash2,
} from "lucide-react";
import { studentService } from "../../api/student.service";
import { dashboardService } from "../../api/dashboard.service";
import { useNavigate } from "react-router-dom";
import StudentDrawer from "./components/StudentDrawer";

function formatDate(date) {
    if (!date) return "-";
    return new Date(date).toLocaleDateString("en-GB");
}

export default function StudentsPage() {
    const [students, setStudents] = useState([]);
    const [groups, setGroups] = useState([]);
    const [loading, setLoading] = useState(true);
    const [drawerOpen, setDrawerOpen] = useState(false);
    const [editDrawerOpen, setEditDrawerOpen] = useState(false);
    const [editingStudent, setEditingStudent] = useState(null);
    const [search, setSearch] = useState("");
    const [error, setError] = useState("");

    const navigate = useNavigate();

    const fetchStudents = async () => {
        const res = await studentService.getStudents();
        setStudents(res?.data || []);
    };

    const fetchGroups = async () => {
        const res = await dashboardService.getGroups();
        setGroups(res?.data?.data || []);
    };

    const fetchData = async () => {
        try {
            setLoading(true);
            setError("");
            await Promise.all([fetchStudents(), fetchGroups()]);
        } catch (err) {
            setError(
                err?.response?.data?.message ||
                "Ma'lumotlarni yuklashda xatolik yuz berdi"
            );
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const filteredStudents = useMemo(() => {
        return students.filter((student) => {
            const fullName = student.fullName?.toLowerCase() || "";
            const email = student.email?.toLowerCase() || "";
            const query = search.toLowerCase();

            return fullName.includes(query) || email.includes(query);
        });
    }, [students, search]);

    const handleView = (student) => {
        navigate(`/staff/students/${student.id}`);
    };

    const handleEdit = (student) => {
        setEditingStudent(student);
        setEditDrawerOpen(true);
    };

    const handleDelete = async (id) => {
        const ok = confirm("O'quvchini o'chirmoqchimisiz?");
        if (!ok) return;

        try {
            await studentService.deleteStudent(id);
            await fetchStudents();
        } catch (err) {
            alert(err?.response?.data?.message || "O'chirishda xatolik");
        }
    };

    return (
        <>
            <div className="mb-6 flex items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-slate-900">O'quvchilar</h1>
                    <p className="mt-1 text-sm text-slate-500">
                        Barcha talabalar ro'yxati
                    </p>
                </div>

                <button
                    onClick={() => setDrawerOpen(true)}
                    className="inline-flex items-center gap-2 rounded-2xl bg-violet-600 px-5 py-3 font-medium text-white transition hover:bg-violet-700"
                >
                    <Plus className="h-4 w-4" />
                    Talaba qo'shish
                </button>
            </div>

            <div className="mb-4 flex items-center gap-3">
                <div className="relative w-full max-w-md">
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
                <div className="grid grid-cols-[70px_1.5fr_1.2fr_1fr_1fr_1fr_130px] gap-4 border-b border-slate-200 bg-slate-50 px-5 py-4 text-sm font-semibold text-slate-600">
                    <span>№</span>
                    <span>FIO</span>
                    <span>Email</span>
                    <span>Tug'ilgan sana</span>
                    <span>Yaratilgan sana</span>
                    <span>Status</span>
                    <span className="text-right">Amallar</span>
                </div>

                {loading ? (
                    <div className="px-5 py-10 text-center text-slate-500">
                        Yuklanmoqda...
                    </div>
                ) : filteredStudents.length === 0 ? (
                    <div className="px-5 py-10 text-center text-slate-500">
                        Student topilmadi
                    </div>
                ) : (
                    filteredStudents.map((student, index) => (
                        <div
                            key={student.id}
                            className="grid grid-cols-[70px_1.5fr_1.2fr_1fr_1fr_1fr_130px] items-center gap-4 border-b border-slate-100 px-5 py-4 text-sm"
                        >
                            <span>{index + 1}</span>

                            <div className="flex items-center gap-3">
                                {student.photo ? (
                                    <img
                                        src={student.photo}
                                        alt={student.fullName}
                                        className="h-10 w-10 rounded-full object-cover"
                                    />
                                ) : (
                                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-100 font-semibold text-slate-700">
                                        {student.fullName?.[0] || "S"}
                                    </div>
                                )}

                                <span className="font-medium text-slate-800">
                                    {student.fullName}
                                </span>
                            </div>

                            <span className="truncate text-slate-600">{student.email}</span>
                            <span className="text-slate-600">{formatDate(student.birth_date)}</span>
                            <span className="text-slate-600">{formatDate(student.created_at)}</span>
                            <span>
                                <span className="rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-semibold text-emerald-700">
                                    {student.status}
                                </span>
                            </span>

                            <div className="flex justify-end gap-2">
                                <button
                                    onClick={() => handleView(student)}
                                    className="rounded-xl p-2 text-slate-700 transition hover:bg-slate-100"
                                >
                                    <Eye className="h-4 w-4" />
                                </button>

                                <button
                                    onClick={() => handleEdit(student)}
                                    className="rounded-xl p-2 text-slate-700 transition hover:bg-slate-100"
                                >
                                    <Pencil className="h-4 w-4" />
                                </button>

                                <button
                                    onClick={() => handleDelete(student.id)}
                                    className="rounded-xl p-2 text-rose-600 transition hover:bg-rose-50"
                                >
                                    <Trash2 className="h-4 w-4" />
                                </button>
                            </div>
                        </div>
                    ))
                )}
            </div>

            <StudentDrawer
                open={drawerOpen}
                onClose={() => setDrawerOpen(false)}
                groups={groups}
                mode="create"
                onSuccess={fetchData}
            />

            <StudentDrawer
                open={editDrawerOpen}
                onClose={() => setEditDrawerOpen(false)}
                groups={groups}
                mode="edit"
                initialData={editingStudent}
                onSuccess={fetchData}
            />

           
        </>
    );
}