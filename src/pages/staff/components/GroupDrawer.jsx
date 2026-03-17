import { useEffect, useState } from "react";
import { X } from "lucide-react";
import { groupService } from "../../../api/group.service";
import { courseService } from "../../../api/course.service";
import { teacherService } from "../../../api/teacher.service";

const WEEK_DAYS = [
    { value: "MONDAY", label: "Dushanba" },
    { value: "TUESDAY", label: "Seshanba" },
    { value: "WEDNESDAY", label: "Chorshanba" },
    { value: "THURSDAY", label: "Payshanba" },
    { value: "FRIDAY", label: "Juma" },
    { value: "SATURDAY", label: "Shanba" },
    { value: "SUNDAY", label: "Yakshanba" },
];

export default function GroupDrawer({
    open,
    onClose,
    mode = "create",
    initialData = null,
    onSuccess,
}) {
    const isEdit = mode === "edit";

    const [form, setForm] = useState({
        name: "",
        courseId: "",
        teacherId: "",
        roomId: "",
        startDate: "",
        startTime: "",
        weekDays: [],
    });

    const [courses, setCourses] = useState([]);
    const [teachers, setTeachers] = useState([]);
    const [rooms, setRooms] = useState([]);
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState("");

    // Kurs va xonalarni yuklash
    useEffect(() => {
        if (!open) return;

        Promise.all([
            courseService.getCourses({ limit: 100 }),
            groupService.getRooms({ limit: 100 }),
        ]).then(([coursesRes, roomsRes]) => {
            console.log("coursesRes:", coursesRes);  // ← qo'shing
            console.log("roomsRes:", roomsRes); 
            setCourses(coursesRes?.data  || []);
            setRooms(roomsRes?.data || []);
        });

        if (isEdit && initialData) {
            setForm({
                name: initialData.name || "",
                courseId: initialData.courseId || initialData.course?.id || "",
                teacherId: initialData.teacherId || initialData.teacher?.id || "",
                roomId: initialData.roomId || initialData.room?.id || "",
                startDate: initialData.startDate
                    ? new Date(initialData.startDate).toISOString().split("T")[0]
                    : "",
                startTime: initialData.startTime || "",
                weekDays: initialData.weekDays || [],
            });
        } else {
            setForm({
                name: "",
                courseId: "",
                teacherId: "",
                roomId: "",
                startDate: "",
                startTime: "",
                weekDays: [],
            });
        }

        setError("");
        setSubmitting(false);
    }, [open, isEdit, initialData]);

    // Kurs o'zgarganda teacherlarni yuklash
    useEffect(() => {
        if (!form.courseId) {
            setTeachers([]);
            return;
        }

        teacherService.getTeachersByCourse(form.courseId).then((res) => {
            setTeachers(res?.data?.data || res?.data || []);
        });
    }, [form.courseId]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm((prev) => ({
            ...prev,
            [name]: value,
            // Kurs o'zgarganda teacherni reset
            ...(name === "courseId" && { teacherId: "" }),
        }));
    };

    const toggleWeekDay = (day) => {
        setForm((prev) => ({
            ...prev,
            weekDays: prev.weekDays.includes(day)
                ? prev.weekDays.filter((d) => d !== day)
                : [...prev.weekDays, day],
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (form.weekDays.length === 0) {
            setError("Kamida bitta dars kunini tanlang");
            return;
        }

        try {
            setSubmitting(true);
            setError("");

            const payload = {
                name: form.name,
                courseId: Number(form.courseId),
                teacherId: Number(form.teacherId),
                roomId: Number(form.roomId),
                startDate: form.startDate,
                startTime: form.startTime,
                weekDays: form.weekDays,
            };

            if (isEdit) {
                await groupService.updateGroup(initialData.id, payload);
            } else {
                await groupService.createGroup(payload);
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
                            {isEdit ? "Guruhni tahrirlash" : "Guruh qo'shish"}
                        </h2>
                        <p className="mt-1 text-sm text-slate-500">
                            {isEdit
                                ? "Guruh ma'lumotlarini yangilang"
                                : "Yangi guruh ma'lumotlarini kiriting"}
                        </p>
                    </div>
                    <button
                        onClick={onClose}
                        className="rounded-xl p-2 text-slate-500 transition hover:bg-slate-100"
                    >
                        <X className="h-5 w-5" />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4 px-6 py-5">
                    {/* Guruh nomi */}
                    <div>
                        <label className="mb-2 block text-sm font-medium text-slate-700">
                            Guruh nomi
                        </label>
                        <input
                            name="name"
                            value={form.name}
                            onChange={handleChange}
                            placeholder="N-25"
                            required
                            className="h-11 w-full rounded-xl border border-slate-200 px-4 outline-none focus:border-violet-400"
                        />
                    </div>

                    {/* Kurs */}
                    <div>
                        <label className="mb-2 block text-sm font-medium text-slate-700">
                            Kurs
                        </label>
                        <select
                            name="courseId"
                            value={form.courseId}
                            onChange={handleChange}
                            required
                            className="h-11 w-full rounded-xl border border-slate-200 px-4 outline-none focus:border-violet-400"
                        >
                            <option value="">Tanlang...</option>
                            {courses.map((c) => (
                                <option key={c.id} value={c.id}>
                                    {c.name}
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* O'qituvchi */}
                    <div>
                        <label className="mb-2 block text-sm font-medium text-slate-700">
                            O'qituvchi
                        </label>
                        <select
                            name="teacherId"
                            value={form.teacherId}
                            onChange={handleChange}
                            required
                            disabled={!form.courseId}
                            className="h-11 w-full rounded-xl border border-slate-200 px-4 outline-none focus:border-violet-400 disabled:bg-slate-50 disabled:text-slate-400"
                        >
                            <option value="">
                                {!form.courseId
                                    ? "Avval kursni tanlang..."
                                    : "Tanlang..."}
                            </option>
                            {teachers.map((t) => (
                                <option key={t.id} value={t.id}>
                                    {t.fullName}
                                </option>
                            ))}
                        </select>
                        {form.courseId && teachers.length === 0 && (
                            <p className="mt-1 text-xs text-amber-500">
                                Bu kurs uchun o'qituvchi topilmadi
                            </p>
                        )}
                    </div>

                    {/* Xona */}
                    <div>
                        <label className="mb-2 block text-sm font-medium text-slate-700">
                            Xona
                        </label>
                        <select
                            name="roomId"
                            value={form.roomId}
                            onChange={handleChange}
                            required
                            className="h-11 w-full rounded-xl border border-slate-200 px-4 outline-none focus:border-violet-400"
                        >
                            <option value="">Tanlang...</option>
                            {rooms.map((r) => (
                                <option key={r.id} value={r.id}>
                                    {r.name} ({r.capacity} o'rin)
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* Boshlanish sanasi va vaqti */}
                    <div className="grid grid-cols-2 gap-3">
                        <div>
                            <label className="mb-2 block text-sm font-medium text-slate-700">
                                Boshlanish sanasi
                            </label>
                            <input
                                name="startDate"
                                type="date"
                                value={form.startDate}
                                onChange={handleChange}
                                required
                                className="h-11 w-full rounded-xl border border-slate-200 px-4 outline-none focus:border-violet-400"
                            />
                        </div>
                        <div>
                            <label className="mb-2 block text-sm font-medium text-slate-700">
                                Vaqt
                            </label>
                            <input
                                name="startTime"
                                type="time"
                                value={form.startTime}
                                onChange={handleChange}
                                required
                                className="h-11 w-full rounded-xl border border-slate-200 px-4 outline-none focus:border-violet-400"
                            />
                        </div>
                    </div>

                    {/* Dars kunlari */}
                    <div>
                        <label className="mb-2 block text-sm font-medium text-slate-700">
                            Dars kunlari
                        </label>
                        <div className="flex flex-wrap gap-2">
                            {WEEK_DAYS.map((day) => (
                                <button
                                    key={day.value}
                                    type="button"
                                    onClick={() => toggleWeekDay(day.value)}
                                    className={`rounded-xl px-3 py-2 text-xs font-medium transition ${
                                        form.weekDays.includes(day.value)
                                            ? "bg-violet-500 text-white"
                                            : "border border-slate-200 text-slate-600 hover:border-violet-300"
                                    }`}
                                >
                                    {day.label}
                                </button>
                            ))}
                        </div>
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
                                ? isEdit
                                    ? "Yangilanmoqda..."
                                    : "Saqlanmoqda..."
                                : isEdit
                                    ? "Yangilash"
                                    : "Saqlash"}
                        </button>
                    </div>
                </form>
            </div>
        </>
    );
}