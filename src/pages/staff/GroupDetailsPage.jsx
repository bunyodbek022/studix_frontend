import { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
    ArrowLeft,
    BookOpen,
    Calendar,
    ChevronLeft,
    ChevronRight,
    Clock,
    Eye,
    Plus,
    Search,
    User,
    UserMinus,
    Trash2,
    X,
    CheckCircle2,
    XCircle,
    MapPin,
    Lock,
    Pencil,
    Clapperboard,
} from "lucide-react";
import AddLessonVideoDrawer from "./components/AddLessonVideoDrawer";
import { groupService } from "../../api/group.service";
import { studentService } from "../../api/student.service";
import { lessonService } from "../../api/lesson.service";
import { toast } from "../../components/ui/Toast";
import { lessonVideoService } from "../../api/lessonVideo.service";

function AddStudentDrawer({ open, onClose, groupId, onSuccess }) {
    const [students, setStudents] = useState([]);
    const [selectedStudent, setSelectedStudent] = useState(null);
    const [search, setSearch] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");


    useEffect(() => {
        if (open) {
            studentService.getStudents().then((res) => setStudents(res?.data || []));
            setSelectedStudent(null);
            setSearch("");
            setError("");
        }
    }, [open]);

    const filteredStudents = useMemo(() => {
        if (!search) return students;
        const q = search.toLowerCase();
        return students.filter((s) => s.fullName?.toLowerCase().includes(q) || s.email?.toLowerCase().includes(q));
    }, [students, search]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!selectedStudent) {
            setError("Talabani tanlang!");
            return;
        }
        try {
            setLoading(true);
            await groupService.addStudentToGroup({ groupId: Number(groupId), studentId: Number(selectedStudent.id) });
            onSuccess?.();
            onClose?.();
        } catch (err) {
            setError(err?.response?.data?.message || "Saqlashda xatolik");
        } finally {
            setLoading(false);
        }
    };

    if (!open) return null;

    return (
        <>
            <button className="fixed inset-0 z-40 bg-black/20" onClick={onClose} />
            <div className="fixed right-0 top-0 z-50 h-full w-full max-w-md overflow-y-auto border-l border-slate-200 bg-white shadow-2xl">
                <div className="flex items-center justify-between border-b border-slate-200 px-6 py-5">
                    <div>
                        <h2 className="text-lg font-bold text-slate-900">Talaba qo'shish</h2>
                        <p className="mt-0.5 text-xs text-slate-500">Guruhga yangi talaba qo'shish</p>
                    </div>
                    <button onClick={onClose} className="rounded-xl p-2 text-slate-400 hover:bg-slate-100">
                        <X className="h-5 w-5" />
                    </button>
                </div>
                <form onSubmit={handleSubmit} className="space-y-4 px-6 py-5">
                    <div className="relative">
                        <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                        <input
                            value={search}
                            onChange={(e) => {
                                setSearch(e.target.value);
                                setSelectedStudent(null);
                            }}
                            placeholder="Ism yoki email..."
                            className="h-10 w-full rounded-xl border border-slate-200 pl-9 pr-4 text-sm outline-none focus:border-violet-400"
                        />
                    </div>
                    {selectedStudent && (
                        <div className="flex items-center justify-between rounded-xl border border-violet-200 bg-violet-50 px-4 py-3">
                            <div>
                                <p className="text-sm font-medium text-violet-800">{selectedStudent.fullName}</p>
                                <p className="text-xs text-violet-500">{selectedStudent.email}</p>
                            </div>
                            <button
                                type="button"
                                onClick={() => setSelectedStudent(null)}
                                className="text-violet-400 hover:text-violet-600"
                            >
                                <X className="h-4 w-4" />
                            </button>
                        </div>
                    )}
                    {!selectedStudent && (
                        <div className="max-h-64 overflow-y-auto rounded-xl border border-slate-200">
                            {filteredStudents.length === 0 ? (
                                <div className="py-6 text-center text-sm text-slate-400">Topilmadi</div>
                            ) : (
                                filteredStudents.map((s) => (
                                    <button
                                        key={s.id}
                                        type="button"
                                        onClick={() => {
                                            setSelectedStudent(s);
                                            setSearch("");
                                        }}
                                        className="flex w-full items-center gap-3 border-b border-slate-100 px-4 py-2.5 text-left hover:bg-slate-50 last:border-0"
                                    >
                                        <div className="flex h-7 w-7 items-center justify-center rounded-full bg-slate-100 text-xs font-semibold text-slate-600">
                                            {s.fullName?.[0]}
                                        </div>
                                        <div>
                                            <p className="text-sm font-medium text-slate-800">{s.fullName}</p>
                                            <p className="text-xs text-slate-400">{s.email}</p>
                                        </div>
                                    </button>
                                ))
                            )}
                        </div>
                    )}
                    {error && <div className="rounded-xl bg-rose-50 px-4 py-3 text-sm text-rose-600">{error}</div>}
                    <div className="flex gap-3">
                        <button
                            type="button"
                            onClick={onClose}
                            className="flex-1 rounded-xl border border-slate-200 py-2.5 text-sm font-medium text-slate-700"
                        >
                            Bekor
                        </button>
                        <button
                            type="submit"
                            disabled={loading || !selectedStudent}
                            className="flex-1 rounded-xl bg-violet-500 py-2.5 text-sm font-medium text-white disabled:opacity-50"
                        >
                            {loading ? "..." : "Qo'shish"}
                        </button>
                    </div>
                </form>
            </div>
        </>
    );
}

function AddLessonDrawer({ open, onClose, groupId, onSuccess }) {
    const [title, setTitle] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    useEffect(() => {
        if (open) {
            setTitle("");
            setError("");
        }
    }, [open]);


    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!title) {
            setError("Mavzuni kiriting!");
            return;
        }
        try {
            setLoading(true);
            await lessonService.createLesson({ groupId: Number(groupId), title });
            onSuccess?.();
            onClose?.();
        } catch (err) {
            setError(err?.response?.data?.message || "Xatolik");
        } finally {
            setLoading(false);
        }
    };

    if (!open) return null;

    return (
        <>
            <button className="fixed inset-0 z-40 bg-black/20" onClick={onClose} />
            <div className="fixed right-0 top-0 z-50 h-full w-full max-w-md overflow-y-auto border-l border-slate-200 bg-white shadow-2xl">
                <div className="flex items-center justify-between border-b border-slate-200 px-6 py-5">
                    <div>
                        <h2 className="text-lg font-bold text-slate-900">Dars qo'shish</h2>
                        <p className="mt-0.5 text-xs text-slate-500">Yangi dars mavzusini kiriting</p>
                    </div>
                    <button onClick={onClose} className="rounded-xl p-2 text-slate-400 hover:bg-slate-100">
                        <X className="h-5 w-5" />
                    </button>
                </div>
                <form onSubmit={handleSubmit} className="space-y-4 px-6 py-5">
                    <div>
                        <label className="mb-1.5 block text-xs font-medium text-slate-600">Dars mavzusi</label>
                        <input
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            placeholder="Mavzuni kiriting..."
                            className="h-10 w-full rounded-xl border border-slate-200 px-4 text-sm outline-none focus:border-violet-400"
                        />
                    </div>
                    {error && <div className="rounded-xl bg-rose-50 px-4 py-3 text-sm text-rose-600">{error}</div>}
                    <div className="flex gap-3">
                        <button
                            type="button"
                            onClick={onClose}
                            className="flex-1 rounded-xl border border-slate-200 py-2.5 text-sm font-medium text-slate-700"
                        >
                            Bekor
                        </button>
                        <button
                            type="submit"
                            disabled={loading}
                            className="flex-1 rounded-xl bg-violet-500 py-2.5 text-sm font-medium text-white disabled:opacity-50"
                        >
                            {loading ? "..." : "Saqlash"}
                        </button>
                    </div>
                </form>
            </div>
        </>
    );
}

function MonthSchedule({ scheduleData, onSelectDay, selectedDay }) {
    const today = new Date().toISOString().split("T")[0];
    const allDays = scheduleData?.scheduleDays || [];

    const [currentMonth, setCurrentMonth] = useState(() => {
        const t = new Date();
        return { year: t.getFullYear(), month: t.getMonth() };
    });

    const monthDays = allDays.filter((d) => {
        const date = new Date(d.date);
        return date.getFullYear() === currentMonth.year && date.getMonth() === currentMonth.month;
    });

    // Mavjud oylar ro'yxati
    const allMonths = useMemo(() => {
        const seen = new Set();
        const result = [];
        for (const d of allDays) {
            const date = new Date(d.date);
            const key = `${date.getFullYear()}-${date.getMonth()}`;
            if (!seen.has(key)) {
                seen.add(key);
                result.push({ year: date.getFullYear(), month: date.getMonth() });
            }
        }
        return result;
    }, [allDays]);

    const currentIdx = allMonths.findIndex((m) => m.year === currentMonth.year && m.month === currentMonth.month);

    const monthLabel = `${currentMonth.month + 1}-oy o'quv rejasi`;

    // Oy o'zgarganda birinchi kunni tanlash
    useEffect(() => {
        if (monthDays.length > 0) {
            const todayDay = monthDays.find((d) => d.date === today);
            onSelectDay?.(todayDay || monthDays[0]);
        }
    }, [currentMonth.year, currentMonth.month]);

    return (
        <div>
            <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-semibold text-slate-600">{monthLabel}</span>
                <div className="flex gap-1">
                    <button
                        onClick={() => currentIdx > 0 && setCurrentMonth(allMonths[currentIdx - 1])}
                        disabled={currentIdx <= 0}
                        className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 disabled:opacity-30 transition"
                        title="Oldingi oy"
                    >
                        <ChevronLeft className="h-3.5 w-3.5" />
                    </button>
                    <button
                        onClick={() => currentIdx < allMonths.length - 1 && setCurrentMonth(allMonths[currentIdx + 1])}
                        disabled={currentIdx >= allMonths.length - 1}
                        className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 disabled:opacity-30 transition"
                        title="Keyingi oy"
                    >
                        <ChevronRight className="h-3.5 w-3.5" />
                    </button>
                </div>
            </div>

            <div className="flex gap-1.5 overflow-x-auto pb-1" style={{ scrollbarWidth: "none" }}>
                {monthDays.length === 0 ? (
                    <p className="text-xs text-slate-400 py-2">Bu oyda dars yo'q</p>
                ) : (
                    monthDays.map((day) => {
                        const isToday = day.date === today;
                        const isPast = day.date < today;
                        const isFuture = day.date > today;
                        const isSelected = selectedDay?.date === day.date;
                        const hasLesson = !!day.lesson;

                        return (
                            <button
                                key={day.date}
                                onClick={() => !isFuture && onSelectDay?.(day)}
                                disabled={isFuture}
                                title={isFuture ? "Hali o'tilmagan dars" : undefined}
                                className={`flex flex-col items-center justify-center rounded-xl px-2.5 py-2 min-w-11.5 transition-all text-center
                                ${
                                    isFuture
                                        ? "opacity-40 cursor-not-allowed border border-dashed border-slate-200 text-slate-400 bg-white"
                                        : isSelected && isToday
                                          ? "bg-emerald-500 text-white shadow-md shadow-emerald-100"
                                          : isSelected
                                            ? "bg-violet-500 text-white shadow-md shadow-violet-100"
                                            : isToday
                                              ? "border-2 border-emerald-400 text-emerald-600 bg-white"
                                              : isPast && hasLesson
                                                ? "bg-slate-100 text-slate-600 hover:bg-slate-200"
                                                : "bg-slate-50 text-slate-300 hover:bg-slate-100"
                                }`}
                            >
                                <span className="text-[9px] font-medium leading-none mb-0.5 opacity-70">
                                    {day.monthLabel}
                                </span>
                                <span className="text-sm font-bold leading-none">{day.dayLabel}</span>
                                {hasLesson && !isFuture && (
                                    <div
                                        className={`mt-1 w-1 h-1 rounded-full ${isSelected ? "bg-white" : "bg-emerald-400"}`}
                                    />
                                )}
                            </button>
                        );
                    })
                )}
            </div>
        </div>
    );
}

function DayPanel({ selectedDay, students, groupId, startTime, durationLesson, onRefresh }) {
    const navigate = useNavigate();
    const today = new Date().toISOString().split("T")[0];
    const isPast = selectedDay?.date < today;
    const isToday = selectedDay?.date === today;
    const isFuture = selectedDay?.date > today;

    const [topic, setTopic] = useState("");
    const [creating, setCreating] = useState(false);
    const [createError, setCreateError] = useState("");
    const [attendance, setAttendance] = useState({});
    const [saving, setSaving] = useState(false);
    const [saved, setSaved] = useState(false); // ← saqlandi holati
    const [isEditing, setIsEditing] = useState(false); // ← qayta tahrirlash
    const [attendanceLoading, setAttendanceLoading] = useState(false);
    const selectedDayRef = useRef(null);

    const lesson = selectedDay?.lesson || null;
    const canCreate = (isToday || isPast) && !lesson;
    const canEditAttendance = isToday && !saved && !!lesson;
    const isReadOnly = (isPast && !!lesson && !isEditing) || (isToday && saved && !isEditing);

    const endTime = useMemo(() => {
        if (!startTime || !durationLesson) return "";
        const [h, m] = startTime.split(":").map(Number);
        const total = h * 60 + m + Number(durationLesson);
        return `${String(Math.floor(total / 60)).padStart(2, "0")}:${String(total % 60).padStart(2, "0")}`;
    }, [startTime, durationLesson]);

    useEffect(() => {
        if (lesson) {
            setAttendanceLoading(true);
            setSaved(false);
            setIsEditing(false);
            lessonService
                .getLessonAttendance(lesson.id)
                .then((res) => {
                    const map = {};
                    (res?.data || []).forEach((a) => {
                        map[a.studentId] = a.isPresent;
                    });
                    if (!isPast) {
                        students.forEach((sg) => {
                            if (map[sg.student?.id] === undefined) map[sg.student?.id] = true;
                        });
                    }
                    setAttendance(map);
                })
                .finally(() => setAttendanceLoading(false));
        } else {
            setAttendance({});
            setTopic("");
            setCreateError("");
            setSaved(false);
            setIsEditing(false);
        }
    }, [lesson?.id, selectedDay?.date]);

    const handleCreateLesson = async () => {
        if (!topic.trim()) {
            setCreateError("Mavzuni kiriting");
            return;
        }
        try {
            setCreating(true);
            setCreateError("");
            await lessonService.createLesson({ groupId: Number(groupId), title: topic });
            toast.success("Dars muvaffaqiyatli yaratildi");
            setTopic("");
            onRefresh?.();
        } catch (err) {
            toast.error(err?.response?.data?.message || "Xatolik yuz berdi");
        } finally {
            setCreating(false);
        }
    };

    const toggleAttendance = (studentId) => {
        if (!canEditAttendance) return;
        setAttendance((prev) => ({ ...prev, [studentId]: !prev[studentId] }));
    };

    const handleSave = async () => {
        try {
            setSaving(true);
            await lessonService.saveAttendance(lesson.id, attendance);
            setSaved(true);
            setIsEditing(false);
            toast.success("Davomat muvaffaqiyatli saqlandi");
        } catch (err) {
            toast.error(err?.response?.data?.message || "Xatolik yuz berdi");
        } finally {
            setSaving(false);
        }
    };

    if (!selectedDay) {
        return <div className="py-8 text-center text-sm text-slate-400">Kun tanlang</div>;
    }

    return (
        <div className="space-y-4">
            {/* Sana header */}
            <div className="flex items-center justify-between">
                <div>
                    <p className="text-sm font-semibold text-slate-700">
                        {new Date(selectedDay.date).toLocaleDateString("uz-UZ", {
                            weekday: "long",
                            day: "numeric",
                            month: "long",
                        })}
                    </p>
                    <p className="text-xs text-slate-400 mt-0.5">
                        {startTime}
                        {endTime ? ` – ${endTime}` : ""} • {durationLesson} daqiqa
                    </p>
                </div>
                {lesson && (
                    <button
                        onClick={() => navigate(`/staff/lessons/${lesson.id}`)}
                        className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 px-3 py-1.5 text-xs font-medium text-slate-600 hover:bg-slate-50"
                    >
                        <Eye className="h-3.5 w-3.5" /> Batafsil
                    </button>
                )}
            </div>

            {/* Mavzu */}
            <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                <p className="text-[10px] font-semibold uppercase tracking-wide text-slate-400 mb-2">Mavzu</p>
                {lesson ? (
                    <p className="text-sm font-medium text-slate-700">{lesson.title}</p>
                ) : canCreate ? (
                    <div>
                        <div className="flex gap-2">
                            <input
                                value={topic}
                                onChange={(e) => {
                                    setTopic(e.target.value);
                                    setCreateError("");
                                }}
                                onKeyDown={(e) => e.key === "Enter" && handleCreateLesson()}
                                placeholder="Dars mavzusini kiriting..."
                                className="h-9 flex-1 rounded-lg border border-slate-200 bg-white px-3 text-sm outline-none focus:border-violet-400"
                            />
                            <button
                                onClick={handleCreateLesson}
                                disabled={creating || !topic.trim()}
                                className="h-9 rounded-lg bg-violet-500 px-4 text-xs font-semibold text-white hover:bg-violet-600 disabled:opacity-50"
                            >
                                {creating ? "..." : "Yaratish"}
                            </button>
                        </div>
                        {createError && <p className="mt-1.5 text-xs text-rose-500">{createError}</p>}
                    </div>
                ) : (
                    <p className="text-xs text-slate-400 italic">Dars o'tilmagan</p>
                )}
            </div>

            {/* Davomat */}
            <div>
                <div className="mb-2 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <p className="text-[10px] font-semibold uppercase tracking-wide text-slate-400">Davomat</p>
                        {/* Saqlandi badge */}
                        {saved && !isEditing && (
                            <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2 py-0.5 text-[10px] font-semibold text-emerald-600">
                                <CheckCircle2 className="h-3 w-3" /> Saqlandi
                            </span>
                        )}
                        {!lesson && (
                            <span className="text-[10px] text-amber-500 font-normal">— avval dars yarating</span>
                        )}
                        {isReadOnly && !isEditing && (
                            <span className="text-[10px] text-slate-400 font-normal">— arxiv</span>
                        )}
                    </div>

                    <div className="flex items-center gap-3">
                        {lesson && (
                            <div className="flex items-center gap-2 text-[11px] text-slate-400">
                                <span className="flex items-center gap-1">
                                    <CheckCircle2 className="h-3 w-3 text-emerald-500" />
                                    {Object.values(attendance).filter(Boolean).length}
                                </span>
                                <span className="flex items-center gap-1">
                                    <XCircle className="h-3 w-3 text-rose-400" />
                                    {Object.values(attendance).filter((v) => !v).length}
                                </span>
                            </div>
                        )}

                        {/* Qayta tahrirlash — admin uchun, faqat o'tgan kunlar */}
                        {isPast && lesson && !isEditing && (
                            <button
                                onClick={() => setIsEditing(true)}
                                className="inline-flex items-center gap-1 rounded-lg border border-slate-200 px-2.5 py-1 text-[11px] font-medium text-slate-500 hover:bg-slate-50 transition"
                            >
                                <Pencil className="h-3 w-3" />
                                Tahrirlash
                            </button>
                        )}

                        {/* Tahrirlashni bekor qilish */}
                        {isEditing && (
                            <button
                                onClick={() => setIsEditing(false)}
                                className="inline-flex items-center gap-1 rounded-lg border border-slate-200 px-2.5 py-1 text-[11px] font-medium text-slate-500 hover:bg-slate-50 transition"
                            >
                                <X className="h-3 w-3" />
                                Bekor
                            </button>
                        )}
                    </div>
                </div>

                <div className="overflow-hidden rounded-xl border border-slate-200">
                    <div className="grid grid-cols-[36px_1fr_80px_56px] gap-3 border-b border-slate-100 bg-slate-50 px-4 py-2 text-[10px] font-semibold uppercase tracking-wide text-slate-400">
                        <span>#</span>
                        <span>O'quvchi</span>
                        <span>Vaqt</span>
                        <span className="text-center">Holat</span>
                    </div>

                    {attendanceLoading ? (
                        <div className="py-6 text-center text-xs text-slate-400">Yuklanmoqda...</div>
                    ) : students.length === 0 ? (
                        <div className="py-6 text-center text-xs text-slate-400">Talabalar yo'q</div>
                    ) : (
                        students.map((sg, i) => (
                            <div
                                key={sg.studentGroupId}
                                className="grid grid-cols-[36px_1fr_80px_56px] items-center gap-3 border-b border-slate-100 px-4 py-2.5 last:border-0"
                            >
                                <span className="text-[11px] text-slate-400">{i + 1}</span>
                                <div className="flex items-center gap-2 min-w-0">
                                    <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-slate-100 text-[10px] font-semibold text-slate-600">
                                        {sg.student?.fullName?.[0]}
                                    </div>
                                    <span className="text-xs font-medium text-slate-700 truncate">
                                        {sg.student?.fullName}
                                    </span>
                                </div>
                                <span className="text-[11px] text-slate-400">{startTime}</span>
                                <div className="flex justify-center">
                                    {!lesson ? (
                                        <button
                                            onClick={() => toast.error("Avval dars mavzusini yarating")}
                                            className="text-slate-300 hover:text-slate-400 transition"
                                        >
                                            <Lock className="h-4 w-4" />
                                        </button>
                                    ) : isReadOnly && !isEditing ? (
                                        // Faqat ko'rish
                                        attendance[sg.student?.id] !== false ? (
                                            <CheckCircle2 className="h-5 w-5 text-emerald-400 opacity-60" />
                                        ) : (
                                            <XCircle className="h-5 w-5 text-rose-300 opacity-60" />
                                        )
                                    ) : (
                                        // Toggle
                                        <button
                                            onClick={() => toggleAttendance(sg.student?.id)}
                                            className="transition hover:scale-110"
                                        >
                                            {attendance[sg.student?.id] !== false ? (
                                                <CheckCircle2 className="h-5 w-5 text-emerald-500" />
                                            ) : (
                                                <XCircle className="h-5 w-5 text-rose-400" />
                                            )}
                                        </button>
                                    )}
                                </div>
                            </div>
                        ))
                    )}
                </div>

                {/* Saqlash tugmasi */}
                {(canEditAttendance || isEditing) && lesson && students.length > 0 && (
                    <div className="mt-3 flex items-center justify-between">
                        <p className="text-[11px] text-slate-400">
                            {isEditing ? "Tahrirlash rejimida" : "O'zgarishlarni saqlang"}
                        </p>
                        <button
                            onClick={handleSave}
                            disabled={saving}
                            className="inline-flex items-center gap-1.5 rounded-xl bg-emerald-500 px-5 py-2 text-xs font-semibold text-white hover:bg-emerald-600 disabled:opacity-50 transition"
                        >
                            {saving ? (
                                <>
                                    <svg className="animate-spin h-3.5 w-3.5" viewBox="0 0 24 24" fill="none">
                                        <circle
                                            className="opacity-25"
                                            cx="12"
                                            cy="12"
                                            r="10"
                                            stroke="currentColor"
                                            strokeWidth="4"
                                        />
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                                    </svg>
                                    Saqlanmoqda...
                                </>
                            ) : (
                                <>
                                    <CheckCircle2 className="h-3.5 w-3.5" />
                                    Saqlash
                                </>
                            )}
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}

export default function GroupDetailsPage() {
    const { id } = useParams();
    const navigate = useNavigate();

    const [group, setGroup] = useState(null);
    const [students, setStudents] = useState([]);
    const [lessons, setLessons] = useState([]);
    const [scheduleData, setScheduleData] = useState(null);
    const [selectedDay, setSelectedDay] = useState(null);
    const selectedDayRef = useRef(null);
     const [videoDrawer, setVideoDrawer] = useState(false);
    const [selectedLesson, setSelectedLesson] = useState(null);

    const openVideoDrawer = (lesson) => {
        setSelectedLesson(lesson);
        setVideoDrawer(true);
    };

    const updateSelectedDay = (day) => {
        selectedDayRef.current = day;
        setSelectedDay(day);
    };

    const [activeTab, setActiveTab] = useState("ATTENDANCE");
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");
    const [studentDrawer, setStudentDrawer] = useState(false);
    const [lessonDrawer, setLessonDrawer] = useState(false);

    const fetchGroupData = async () => {
        try {
            setLoading(true);
            const [groupRes, scheduleRes] = await Promise.all([
                groupService.getGroupById(id),
                groupService.getGroupSchedule(id),
            ]);
            setGroup(groupRes?.data);
            setScheduleData(scheduleRes?.data);
            await Promise.all([fetchStudents(), fetchLessons()]);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const fetchStudents = async () => {
        const res = await groupService.getGroupStudents(id, { limit: 100 });
        setStudents(res?.data || []);
    };

    const fetchLessons = async () => {
        const res = await groupService.getGroupLessons(id, { limit: 100 });
        setLessons(res?.data || []);
    };

    const handleScheduleRefresh = async () => {
        const [scheduleRes, lessonsRes] = await Promise.all([
            groupService.getGroupSchedule(id),
            groupService.getGroupLessons(id, { limit: 100 }),
        ]);

        const updatedDays = scheduleRes?.data?.scheduleDays || [];
        setScheduleData(scheduleRes?.data);
        setLessons(lessonsRes?.data || []);

        // ref orqali — closure muammosi yo'q
        const currentDay = selectedDayRef.current;
        if (currentDay) {
            const updated = updatedDays.find((d) => d.date === currentDay.date);
            updateSelectedDay(updated || currentDay);
        }
    };

    const removeStudent = async (sg) => {
        const sgId = sg.studentGroupId || sg.id;
        if (!confirm("Talaba guruhdan chiqarilsinmi?")) return;
        try {
            await groupService.removeStudentFromGroup(sgId);
            fetchStudents();
        } catch (err) {
            alert(err?.response?.data?.message || "Xatolik");
        }
    };

    const removeLesson = async (lessonId) => {
        if (!confirm("Dars o'chirilsinmi?")) return;
        try {
            await lessonService.deleteLesson(lessonId);
            fetchLessons();
        } catch (err) {
            alert(err?.response?.data?.message || "Xatolik");
        }
    };

    useEffect(() => {
        fetchGroupData();
    }, [id]);

    const filteredStudents = useMemo(() => {
        if (!search) return students;
        const q = search.toLowerCase();
        return students.filter(
            (sg) => sg.student?.fullName?.toLowerCase().includes(q) || sg.student?.email?.toLowerCase().includes(q),
        );
    }, [students, search]);

    const filteredLessons = useMemo(() => {
        if (!search) return lessons;
        const q = search.toLowerCase();
        return lessons.filter((l) => l.title?.toLowerCase().includes(q));
    }, [lessons, search]);

    if (loading || !group) {
        return (
            <div className="rounded-3xl border border-slate-200 bg-white px-6 py-10 text-center text-sm text-slate-400">
                Yuklanmoqda...
            </div>
        );
    }

    const TABS = [
        { key: "ATTENDANCE", label: "Davomat" },
        { key: "STUDENTS", label: "Talabalar", count: students.length },
        { key: "LESSONS", label: "Darslar", count: lessons.length },
    ];

    return (
        <div className="space-y-4">
            {/* Orqaga */}
            <button
                onClick={() => navigate("/staff/groups")}
                className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-600 shadow-sm hover:bg-slate-50"
            >
                <ArrowLeft className="h-4 w-4" /> Orqaga
            </button>

            {/* Guruh + O'qituvchi */}
            <div className="grid grid-cols-1 gap-4 lg:grid-cols-[1fr_260px]">
                <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                    <div className="mb-3 flex items-start justify-between">
                        <div>
                            <h1 className="text-xl font-bold text-slate-800">{group.name}</h1>
                            <p className="text-xs text-slate-400 mt-0.5">
                                {group.course?.name} • {group.weekDays?.map((d) => d.slice(0, 3)).join(", ")}
                            </p>
                        </div>
                        <span
                            className={`rounded-full px-2.5 py-1 text-[11px] font-semibold ${group.status === "ACTIVE" ? "bg-emerald-50 text-emerald-700" : "bg-slate-100 text-slate-500"}`}
                        >
                            {group.status}
                        </span>
                    </div>
                    <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
                        {[
                            { label: "Kurs", value: group.course?.name || "-" },
                            { label: "Boshlanish", value: new Date(group.startDate).toLocaleDateString("en-GB") },
                            { label: "Vaqt", value: group.startTime },
                            { label: "Xona", value: group.room?.name || "-" },
                        ].map(({ label, value }) => (
                            <div key={label} className="rounded-xl bg-slate-50 p-3">
                                <p className="text-[10px] text-slate-400 mb-1">{label}</p>
                                <p className="text-xs font-semibold text-slate-700 truncate">{value}</p>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                    <p className="text-[10px] font-semibold uppercase tracking-wide text-slate-400 mb-3">O'qituvchi</p>
                    <div className="flex items-center gap-3 mb-3">
                        {group.teacher?.photo ? (
                            <img src={group.teacher.photo} alt="" className="h-10 w-10 rounded-full object-cover" />
                        ) : (
                            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-violet-100 text-sm font-bold text-violet-600">
                                {group.teacher?.fullName?.[0]}
                            </div>
                        )}
                        <div>
                            <p className="text-sm font-semibold text-slate-800">{group.teacher?.fullName || "-"}</p>
                            <p className="text-xs text-slate-400">{group.teacher?.position || "Teacher"}</p>
                        </div>
                    </div>
                    <div className="space-y-1.5 text-xs text-slate-500">
                        <div className="flex items-center gap-2">
                            <Clock className="h-3.5 w-3.5 text-slate-300 shrink-0" />
                            <span>
                                {group.startTime}
                                {scheduleData?.durationLesson
                                    ? ` – ${(() => {
                                          const [h, m] = group.startTime.split(":").map(Number);
                                          const total = h * 60 + m + scheduleData.durationLesson;
                                          return `${String(Math.floor(total / 60)).padStart(2, "0")}:${String(total % 60).padStart(2, "0")}`;
                                      })()}`
                                    : ""}
                            </span>
                        </div>
                        <div className="flex items-center gap-2">
                            <MapPin className="h-3.5 w-3.5 text-slate-300 shrink-0" />
                            <span>{group.room?.name || "-"}</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Tab + kontent */}
            <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
                {/* Tab header */}
                <div className="flex items-center justify-between border-b border-slate-200 px-5 py-3">
                    <div className="flex gap-1">
                        {TABS.map(({ key, label, count }) => (
                            <button
                                key={key}
                                onClick={() => {
                                    setActiveTab(key);
                                    setSearch("");
                                }}
                                className={`rounded-lg px-3 py-1.5 text-xs font-medium transition-colors ${activeTab === key ? "bg-violet-50 text-violet-700" : "text-slate-500 hover:text-slate-700"}`}
                            >
                                {label}
                                {count !== undefined && (
                                    <span className="ml-1.5 rounded-full bg-slate-100 px-1.5 py-0.5 text-[10px] text-slate-500">
                                        {count}
                                    </span>
                                )}
                            </button>
                        ))}
                    </div>

                    {activeTab !== "ATTENDANCE" && (
                        <div className="flex items-center gap-2">
                            <div className="relative">
                                <Search className="pointer-events-none absolute left-2.5 top-1/2 h-3 w-3 -translate-y-1/2 text-slate-400" />
                                <input
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                    placeholder="Qidirish..."
                                    className="h-8 w-40 rounded-lg border border-slate-200 bg-white pl-7 pr-3 text-xs outline-none focus:border-violet-400"
                                />
                            </div>
                            {activeTab === "STUDENTS" ? (
                                <button
                                    onClick={() => setStudentDrawer(true)}
                                    className="inline-flex items-center gap-1.5 rounded-lg bg-violet-500 px-3 py-1.5 text-xs font-medium text-white hover:bg-violet-600"
                                >
                                    <Plus className="h-3 w-3" /> Talaba
                                </button>
                            ) : (
                                <button
                                    onClick={() => setLessonDrawer(true)}
                                    className="inline-flex items-center gap-1.5 rounded-lg bg-violet-500 px-3 py-1.5 text-xs font-medium text-white hover:bg-violet-600"
                                >
                                    <Plus className="h-3 w-3" /> Dars
                                </button>
                            )}
                        </div>
                    )}
                </div>

                {/* DAVOMAT TAB */}
                {activeTab === "ATTENDANCE" && (
                    <div className="p-5">
                        {scheduleData && (
                            <div className="mb-5">
                                <MonthSchedule
                                    scheduleData={scheduleData}
                                    selectedDay={selectedDay}
                                    onSelectDay={updateSelectedDay}
                                />
                            </div>
                        )}
                        <DayPanel
                            selectedDay={selectedDay}
                            students={students}
                            groupId={id}
                            startTime={group.startTime}
                            durationLesson={scheduleData?.durationLesson}
                            onRefresh={handleScheduleRefresh}
                        />
                    </div>
                )}

                {/* TALABALAR TAB */}
                {activeTab === "STUDENTS" && (
                    <>
                        <div className="grid grid-cols-[36px_1.5fr_1.5fr_80px] gap-3 border-b border-slate-100 bg-slate-50 px-5 py-2.5 text-[10px] font-semibold uppercase tracking-wide text-slate-400">
                            <span>№</span>
                            <span>Ism</span>
                            <span>Email</span>
                            <span className="text-right">Amal</span>
                        </div>
                        {filteredStudents.length === 0 ? (
                            <div className="py-8 text-center text-sm text-slate-400">Talaba topilmadi</div>
                        ) : (
                            filteredStudents.map((sg, i) => (
                                <div
                                    key={sg.studentGroupId}
                                    className="grid grid-cols-[36px_1.5fr_1.5fr_80px] items-center gap-3 border-b border-slate-100 px-5 py-2.5 text-xs last:border-0"
                                >
                                    <span className="text-slate-400">{i + 1}</span>
                                    <span className="font-medium text-slate-700 truncate">
                                        {sg.student?.fullName || "-"}
                                    </span>
                                    <span className="text-slate-400 truncate">{sg.student?.email || "-"}</span>
                                    <div className="flex justify-end gap-1">
                                        <button
                                            onClick={() => navigate(`/staff/students/${sg.student?.id}`)}
                                            className="rounded-lg p-1.5 text-slate-500 hover:bg-slate-100"
                                        >
                                            <Eye className="h-3.5 w-3.5" />
                                        </button>
                                        <button
                                            onClick={() => removeStudent(sg)}
                                            className="rounded-lg p-1.5 text-rose-400 hover:bg-rose-50"
                                        >
                                            <UserMinus className="h-3.5 w-3.5" />
                                        </button>
                                    </div>
                                </div>
                            ))
                        )}
                    </>
                )}

                {/* DARSLAR TAB */}
                {activeTab === "LESSONS" && (
                    <>
                        <div className="grid grid-cols-[36px_36px_1fr_90px_110px] gap-3 border-b border-slate-100 bg-slate-50 px-5 py-2.5 text-[10px] font-semibold uppercase tracking-wide text-slate-400">
                            <span>№</span>
                            <span>#</span>
                            <span>Mavzu</span>
                            <span>Sana</span>
                            <span className="text-right">Amal</span>
                        </div>

                        {filteredLessons.length === 0 ? (
                            <div className="py-8 text-center text-sm text-slate-400">Dars topilmadi</div>
                        ) : (
                            filteredLessons.map((lesson, i) => (
                                <div
                                    key={lesson.lessonId || lesson.id}
                                    className="grid grid-cols-[36px_36px_1fr_90px_110px] items-center gap-3 border-b border-slate-100 px-5 py-2.5 text-xs last:border-0"
                                >
                                    <span className="text-slate-400">{i + 1}</span>
                                    <span className="text-slate-400">{lesson.orderNumber || i + 1}</span>

                                    <span className="font-medium text-slate-700 truncate">{lesson.title}</span>

                                    <span className="text-slate-400">
                                        {new Date(lesson.createdAt || lesson.created_at).toLocaleDateString("en-GB")}
                                    </span>

                                    <div className="flex justify-end gap-1">
                                        {/* VIDEO BUTTON */}
                                        <button
                                            onClick={() => openVideoDrawer(lesson)}
                                            className="rounded-lg p-1.5 text-violet-500 hover:bg-violet-50"
                                        >
                                            <Clapperboard className="h-3.5 w-3.5" />
                                        </button>

                                        {/* VIEW */}
                                        <button
                                            onClick={() => navigate(`/staff/lessons/${lesson.lessonId || lesson.id}`)}
                                            className="rounded-lg p-1.5 text-slate-500 hover:bg-slate-100"
                                        >
                                            <Eye className="h-3.5 w-3.5" />
                                        </button>

                                        {/* DELETE */}
                                        <button
                                            onClick={() => removeLesson(lesson.lessonId || lesson.id)}
                                            className="rounded-lg p-1.5 text-rose-400 hover:bg-rose-50"
                                        >
                                            <Trash2 className="h-3.5 w-3.5" />
                                        </button>
                                    </div>
                                </div>
                            ))
                        )}
                    </>
                )}
            </div>

            <AddStudentDrawer
                open={studentDrawer}
                onClose={() => setStudentDrawer(false)}
                groupId={id}
                onSuccess={fetchStudents}
            />
            <AddLessonDrawer
                open={lessonDrawer}
                onClose={() => setLessonDrawer(false)}
                groupId={id}
                onSuccess={fetchLessons}
            />

            <AddLessonVideoDrawer
                open={videoDrawer}
                onClose={() => setVideoDrawer(false)}
                lessonId={selectedLesson?.lessonId || selectedLesson?.id}
                lessonTitle={selectedLesson?.title}
                onSuccess={() => {
                    
                }}
            />
        </div>
    );
}
