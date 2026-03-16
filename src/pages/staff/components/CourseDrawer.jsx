import { useEffect, useState } from "react";
import { X } from "lucide-react";
import { courseService } from "../../../api/course.service";

const LEVELS = ["BEGINNER", "INTERMEDIATE", "ADVANCED"];

export default function CourseDrawer({
    open,
    onClose,
    mode = "create",
    initialData = null,
    onSuccess,
}) {
    const isEdit = mode === "edit";

    const [form, setForm] = useState({
        name: "",
        durationMonth: "",
        durationLesson: "",
        price: "",
        level: "",
        description: "",
    });

    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState("");

    useEffect(() => {
        if (!open) return;

        if (isEdit && initialData) {
            setForm({
                name: initialData.name || "",
                durationMonth: initialData.durationMonth || "",
                durationLesson: initialData.durationLesson || "",
                price: initialData.price || "",
                level: initialData.level || "",
                description: initialData.description || "",
            });
        } else {
            setForm({
                name: "",
                durationMonth: "",
                durationLesson: "",
                price: "",
                level: "",
                description: "",
            });
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
                durationMonth: Number(form.durationMonth),
                durationLesson: Number(form.durationLesson),
                price: form.price,
                level: form.level || undefined,
                description: form.description || undefined,
            };

            if (isEdit) {
                await courseService.updateCourse(initialData.id, payload);
            } else {
                await courseService.createCourse(payload);
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
                            {isEdit ? "Kursni tahrirlash" : "Kurs qo'shish"}
                        </h2>
                        <p className="mt-1 text-sm text-slate-500">
                            {isEdit
                                ? "Kurs ma'lumotlarini yangilang"
                                : "Yangi kurs ma'lumotlarini kiriting"}
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
                    <div>
                        <label className="mb-2 block text-sm font-medium text-slate-700">
                            Kurs nomi
                        </label>
                        <input
                            name="name"
                            value={form.name}
                            onChange={handleChange}
                            placeholder="Nodejs Backend"
                            required
                            className="h-11 w-full rounded-xl border border-slate-200 px-4 outline-none focus:border-violet-400"
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                        <div>
                            <label className="mb-2 block text-sm font-medium text-slate-700">
                                Davomiyligi (oy)
                            </label>
                            <input
                                name="durationMonth"
                                type="number"
                                value={form.durationMonth}
                                onChange={handleChange}
                                placeholder="6"
                                required
                                min={1}
                                className="h-11 w-full rounded-xl border border-slate-200 px-4 outline-none focus:border-violet-400"
                            />
                        </div>
                        <div>
                            <label className="mb-2 block text-sm font-medium text-slate-700">
                                Dars davomiyligi (daq)
                            </label>
                            <input
                                name="durationLesson"
                                type="number"
                                value={form.durationLesson}
                                onChange={handleChange}
                                placeholder="90"
                                required
                                min={1}
                                className="h-11 w-full rounded-xl border border-slate-200 px-4 outline-none focus:border-violet-400"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="mb-2 block text-sm font-medium text-slate-700">
                            Narxi (so'm)
                        </label>
                        <input
                            name="price"
                            type="number"
                            value={form.price}
                            onChange={handleChange}
                            placeholder="1500000"
                            required
                            min={0}
                            className="h-11 w-full rounded-xl border border-slate-200 px-4 outline-none focus:border-violet-400"
                        />
                    </div>

                    <div>
                        <label className="mb-2 block text-sm font-medium text-slate-700">
                            Daraja <span className="text-slate-400">(ixtiyoriy)</span>
                        </label>
                        <select
                            name="level"
                            value={form.level}
                            onChange={handleChange}
                            className="h-11 w-full rounded-xl border border-slate-200 px-4 outline-none focus:border-violet-400"
                        >
                            <option value="">Tanlang</option>
                            {LEVELS.map((l) => (
                                <option key={l} value={l}>{l}</option>
                            ))}
                        </select>
                    </div>

                    <div>
                        <label className="mb-2 block text-sm font-medium text-slate-700">
                            Tavsif <span className="text-slate-400">(ixtiyoriy)</span>
                        </label>
                        <textarea
                            name="description"
                            value={form.description}
                            onChange={handleChange}
                            placeholder="Kurs haqida qisqacha ma'lumot..."
                            rows={3}
                            className="w-full rounded-xl border border-slate-200 px-4 py-3 outline-none focus:border-violet-400 resize-none"
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