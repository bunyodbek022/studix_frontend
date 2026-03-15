import { useEffect, useState } from "react";
import { Upload, X } from "lucide-react";
import { studentService } from "../../../api/student.service";

export default function StudentDrawer({
    open,
    onClose,
    groups = [],
    mode = "create",
    initialData = null,
    onSuccess,
}) {
    const isEdit = mode === "edit";

    const [form, setForm] = useState({
        fullName: "",
        email: "",
        password: "",
        birth_date: "",
        groupId: "",
        photo: null,
    });

    const [preview, setPreview] = useState("");
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState("");

    useEffect(() => {
        if (!open) return;

        if (isEdit && initialData) {
            setForm({
                fullName: initialData.fullName || "",
                email: initialData.email || "",
                password: "",
                birth_date: initialData.birth_date
                    ? new Date(initialData.birth_date).toISOString().split("T")[0]
                    : "",
                groupId: "",
                photo: null,
            });
            setPreview(initialData.photo || "");
        } else {
            setForm({
                fullName: "",
                email: "",
                password: "",
                birth_date: "",
                groupId: "",
                photo: null,
            });
            setPreview("");
        }

        setError("");
        setSubmitting(false);
    }, [open, isEdit, initialData]);

    const handleChange = (e) => {
        const { name, value } = e.target;

        setForm((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handlePhotoChange = (e) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setForm((prev) => ({
            ...prev,
            photo: file,
        }));

        setPreview(URL.createObjectURL(file));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            setSubmitting(true);
            setError("");

            if (isEdit) {
                await studentService.updateStudent(initialData.id, {
                    fullName: form.fullName,
                    email: form.email,
                    password: form.password || undefined,
                    birth_date: form.birth_date,
                    photo: form.photo,
                });

                onSuccess?.();
                onClose?.();
                return;
            }

            const createdRes = await studentService.createStudent({
                fullName: form.fullName,
                email: form.email,
                password: form.password,
                birth_date: form.birth_date,
                photo: form.photo,
            });

            const createdStudentId = createdRes?.student?.id;

            if (!createdStudentId) {
                throw new Error("Yangi student ID qaytmadi");
            }

            if (form.groupId) {
                await studentService.attachGroup({
                    studentId: createdStudentId,
                    groupId: Number(form.groupId),
                });
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
            <button
                className="fixed inset-0 z-40 bg-black/20"
                onClick={onClose}
            />

            <div className="fixed right-0 top-0 z-50 h-full w-full max-w-md overflow-y-auto border-l border-slate-200 bg-white shadow-2xl">
                <div className="flex items-center justify-between border-b border-slate-200 px-6 py-5">
                    <div>
                        <h2 className="text-2xl font-bold text-slate-900">
                            {isEdit ? "Talabani tahrirlash" : "Talaba qo'shish"}
                        </h2>
                        <p className="mt-1 text-sm text-slate-500">
                            {isEdit
                                ? "Talaba ma'lumotlarini yangilang"
                                : "Yangi talaba ma'lumotlarini kiriting"}
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
                            Talaba FIO
                        </label>
                        <input
                            name="fullName"
                            value={form.fullName}
                            onChange={handleChange}
                            placeholder="Ma'lumotni kiriting"
                            required
                            className="h-11 w-full rounded-xl border border-slate-200 px-4 outline-none focus:border-violet-400"
                        />
                    </div>

                    <div>
                        <label className="mb-2 block text-sm font-medium text-slate-700">
                            Email
                        </label>
                        <input
                            name="email"
                            type="email"
                            value={form.email}
                            onChange={handleChange}
                            placeholder="Elektron pochtani kiriting"
                            required
                            className="h-11 w-full rounded-xl border border-slate-200 px-4 outline-none focus:border-violet-400"
                        />
                    </div>

                    <div>
                        <label className="mb-2 block text-sm font-medium text-slate-700">
                            Parol {isEdit && <span className="text-slate-400">(ixtiyoriy)</span>}
                        </label>
                        <input
                            name="password"
                            type="password"
                            value={form.password}
                            onChange={handleChange}
                            placeholder={isEdit ? "O'zgartirmasangiz bo'sh qoldiring" : "Kamida 6 ta belgi"}
                            required={!isEdit}
                            className="h-11 w-full rounded-xl border border-slate-200 px-4 outline-none focus:border-violet-400"
                        />
                    </div>

                    <div>
                        <label className="mb-2 block text-sm font-medium text-slate-700">
                            Tug'ilgan sana
                        </label>
                        <input
                            name="birth_date"
                            type="date"
                            value={form.birth_date}
                            onChange={handleChange}
                            required
                            className="h-11 w-full rounded-xl border border-slate-200 px-4 outline-none focus:border-violet-400"
                        />
                    </div>

                    {!isEdit && (
                        <div>
                            <label className="mb-2 block text-sm font-medium text-slate-700">
                                Sinf/Guruh
                            </label>
                            <select
                                name="groupId"
                                value={form.groupId}
                                onChange={handleChange}
                                className="h-11 w-full rounded-xl border border-slate-200 px-4 outline-none focus:border-violet-400"
                            >
                                <option value="">Guruhni tanlang</option>
                                {groups.map((group) => (
                                    <option key={group.id} value={group.id}>
                                        {group.name}
                                    </option>
                                ))}
                            </select>
                        </div>
                    )}

                    <div>
                        <label className="mb-2 block text-sm font-medium text-slate-700">
                            Surati
                        </label>

                        <label className="flex cursor-pointer flex-col items-center justify-center rounded-2xl border border-dashed border-slate-300 px-4 py-8 text-center transition hover:border-violet-400 hover:bg-violet-50/30">
                            {preview ? (
                                <img
                                    src={preview}
                                    alt="preview"
                                    className="mb-3 h-24 w-24 rounded-xl object-cover"
                                />
                            ) : (
                                <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-slate-100">
                                    <Upload className="h-5 w-5 text-slate-500" />
                                </div>
                            )}

                            <span className="text-sm font-medium text-slate-700">
                                Rasm yuklash uchun bosing
                            </span>
                            <span className="mt-1 text-xs text-slate-400">
                                JPG, PNG, WEBP
                            </span>

                            <input
                                type="file"
                                accept="image/*"
                                onChange={handlePhotoChange}
                                className="hidden"
                            />
                        </label>
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
                            className="flex-1 rounded-xl bg-violet-600 py-3 font-medium text-white transition hover:bg-violet-700 disabled:opacity-50"
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
