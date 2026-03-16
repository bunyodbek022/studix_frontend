import { useEffect, useMemo, useState } from "react";
import { Archive, Eye, Pencil, Plus, RotateCcw, Search, Trash2 } from "lucide-react";
import { courseService } from "../../api/course.service";
import { useNavigate } from "react-router-dom";
import CourseDrawer from "./components/CourseDrawer";

const LEVEL_LABELS = {
    BEGINNER: { label: "Boshlang'ich", color: "bg-emerald-50 text-emerald-700" },
    INTERMEDIATE: { label: "O'rta", color: "bg-amber-50 text-amber-700" },
    ADVANCED: { label: "Yuqori", color: "bg-rose-50 text-rose-700" },
};

function formatPrice(price) {
    if (!price) return "-";
    return Number(price).toLocaleString("uz-UZ") + " so'm";
}

export default function CoursesPage() {
    const [courses, setCourses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [drawerOpen, setDrawerOpen] = useState(false);
    const [editDrawerOpen, setEditDrawerOpen] = useState(false);
    const [editingCourse, setEditingCourse] = useState(null);
    const [search, setSearch] = useState("");
    const [error, setError] = useState("");
    const [activeTab, setActiveTab] = useState("ACTIVE");

    const navigate = useNavigate();

    const fetchCourses = async () => {
        try {
            setLoading(true);
            setError("");
            const res = await courseService.getCourses();
            setCourses(res?.data || []);
        } catch (err) {
            setError(err?.response?.data?.message || "Kurslarni yuklashda xatolik yuz berdi");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchCourses();
    }, []);

    const filteredCourses = useMemo(() => {
        return courses.filter((course) => {
            if (activeTab === "INACTIVE" && course.status !== "INACTIVE") return false;
            if (activeTab === "ACTIVE" && course.status === "INACTIVE") return false;

            const name = course.name?.toLowerCase() || "";
            const description = course.description?.toLowerCase() || "";
            const query = search.toLowerCase();

            return name.includes(query) || description.includes(query);
        });
    }, [courses, search, activeTab]);

    const handleView = (course) => {
        navigate(`/staff/courses/${course.id}`);
    };

    const handleEdit = (course) => {
        setEditingCourse(course);
        setEditDrawerOpen(true);
    };

    const handleArchive = async (id) => {
        const ok = confirm("Kursni arxivga o'tkazmoqchimisiz?");
        if (!ok) return;

        try {
            await courseService.archiveCourse(id);
            await fetchCourses();
        } catch (err) {
            alert(err?.response?.data?.message || "Arxivga o'tkazishda xatolik");
        }
    };

    const handleRestore = async (id) => {
        const ok = confirm("Kursni faollashtirishmoqchimisiz?");
        if (!ok) return;

        try {
            await courseService.restoreCourse(id);
            await fetchCourses();
        } catch (err) {
            alert(err?.response?.data?.message || "Faollashtirishda xatolik");
        }
    };

    const handleDelete = async (id) => {
        const ok = confirm("Kursni butunlay o'chirmoqchimisiz? Bu amalni qaytarib bo'lmaydi!");
        if (!ok) return;

        try {
            await courseService.deleteCourse(id);
            await fetchCourses();
        } catch (err) {
            alert(err?.response?.data?.message || "O'chirishda xatolik");
        }
    };

    return (
        <>
            <div className="mb-6 flex items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-slate-900">Kurslar</h1>
                    <p className="mt-1 text-sm text-slate-500">Barcha kurslar ro'yxati</p>
                </div>

                <button
                    onClick={() => setDrawerOpen(true)}
                    className="inline-flex items-center gap-2 rounded-2xl bg-violet-500 px-5 py-3 font-medium text-white transition hover:bg-violet-700"
                >
                    <Plus className="h-4 w-4" />
                    Kurs qo'shish
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
                        Faol kurslar
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
                <div className="grid grid-cols-[50px_1.5fr_1fr_1fr_1fr_1fr_120px] gap-4 border-b border-slate-200 bg-slate-50 px-5 py-4 text-xs font-semibold uppercase tracking-wide text-slate-500">
                    <span>№</span>
                    <span>Nomi</span>
                    <span>Daraja</span>
                    <span>Davomiyligi</span>
                    <span>Dars (daq)</span>
                    <span>Narxi</span>
                    <span className="text-right">Amallar</span>
                </div>

                {loading ? (
                    <div className="px-5 py-10 text-center text-slate-500">Yuklanmoqda...</div>
                ) : filteredCourses.length === 0 ? (
                    <div className="px-5 py-10 text-center text-slate-500">Kurs topilmadi</div>
                ) : (
                    filteredCourses.map((course, index) => (
                        <div
                            key={course.id}
                            className="grid grid-cols-[50px_1.5fr_1fr_1fr_1fr_1fr_120px] items-center gap-4 border-b border-slate-100 px-5 py-3 text-xs last:border-b-0"
                        >
                            <span className="text-slate-400">{index + 1}</span>

                            <div>
                                <span className="font-medium text-slate-800">{course.name}</span>
                                {course.description && (
                                    <p className="mt-0.5 truncate text-slate-400">{course.description}</p>
                                )}
                            </div>

                            <span>
                                {course.level ? (
                                    <span
                                        className={`rounded-full px-2.5 py-1 text-xs font-semibold ${LEVEL_LABELS[course.level]?.color}`}
                                    >
                                        {LEVEL_LABELS[course.level]?.label}
                                    </span>
                                ) : (
                                    "-"
                                )}
                            </span>

                            <span className="text-slate-600">{course.durationMonth} oy</span>

                            <span className="text-slate-600">{course.durationLesson} daq</span>

                            <span className="font-medium text-slate-700">{formatPrice(course.price)}</span>

                            <div className="flex justify-end gap-2">
                                {activeTab === "ACTIVE" && (
                                    <>
                                        <button
                                            onClick={() => handleView(course)}
                                            className="rounded-xl p-2 text-slate-700 transition hover:bg-slate-100"
                                            title="Ko'rish"
                                        >
                                            <Eye className="h-3.5 w-3.5" />
                                        </button>
                                        <button
                                            onClick={() => handleEdit(course)}
                                            className="rounded-xl p-2 text-slate-700 transition hover:bg-slate-100"
                                            title="Tahrirlash"
                                        >
                                            <Pencil className="h-3.5 w-3.5" />
                                        </button>
                                        <button
                                            onClick={() => handleArchive(course.id)}
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
                                            onClick={() => handleView(course)}
                                            className="rounded-xl p-2 text-slate-700 transition hover:bg-slate-100"
                                            title="Ko'rish"
                                        >
                                            <Eye className="h-3.5 w-3.5" />
                                        </button>
                                        <button
                                            onClick={() => handleRestore(course.id)}
                                            className="rounded-xl p-2 text-emerald-600 transition hover:bg-emerald-50"
                                            title="Faollashtirish"
                                        >
                                            <RotateCcw className="h-3.5 w-3.5" />
                                        </button>
                                        <button
                                            onClick={() => handleDelete(course.id)}
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

            <CourseDrawer
                open={drawerOpen}
                onClose={() => setDrawerOpen(false)}
                mode="create"
                onSuccess={fetchCourses}
            />

            <CourseDrawer
                open={editDrawerOpen}
                onClose={() => setEditDrawerOpen(false)}
                mode="edit"
                initialData={editingCourse}
                onSuccess={fetchCourses}
            />
        </>
    );
}
