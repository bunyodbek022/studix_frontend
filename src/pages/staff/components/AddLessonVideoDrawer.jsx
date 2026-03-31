import { useEffect, useState } from "react";
import { Upload, X } from "lucide-react";
import { toast } from "../../../components/ui/Toast";
import { lessonVideoService } from "../../../api/lessonVideo.service";

export default function AddLessonVideoDrawer({
  open,
  onClose,
  lessonId,
  lessonTitle,
  onSuccess,
}) {
  const [title, setTitle] = useState("");
  const [file, setFile] = useState(null);
  const [fileName, setFileName] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (open) {
      setTitle("");
      setFile(null);
      setFileName("");
      setError("");
      setLoading(false);
    }
  }, [open]);

  const handleFileChange = (e) => {
    const selected = e.target.files?.[0];
    if (!selected) return;

    setFile(selected);
    setFileName(selected.name);
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    console.log("START UPLOAD");
    console.log("lessonId:", lessonId);
    console.log("title:", title);
    console.log("file:", file);

    if (!lessonId) {
      setError("Lesson ID topilmadi");
      return;
    }

    if (!title.trim()) {
      setError("Video nomini kiriting");
      return;
    }

    if (!file) {
      setError("Video fayl tanlang");
      return;
    }

    try {
      setLoading(true);
      setError("");

      const res = await lessonVideoService.createLessonVideo({
        lessonId: String(lessonId),
        title: title.trim(),
        file,
      });

      console.log("UPLOAD RESPONSE:", res?.data);

      toast.success("Video muvaffaqiyatli qo'shildi");
      onSuccess?.(res?.data);
      onClose?.();
    } catch (err) {
      console.log("FULL ERROR:", err);
      console.log("ERROR MESSAGE:", err?.message);
      console.log("ERROR RESPONSE:", err?.response);
      console.log("ERROR DATA:", err?.response?.data);

      setError(
        err?.response?.data?.message ||
          err?.message ||
          "Video yuklashda xatolik"
      );
    } finally {
      setLoading(false);
    }
  };

  if (!open) return null;

  return (
    <>
      <button
        type="button"
        className="fixed inset-0 z-40 bg-black/20"
        onClick={onClose}
      />

      <div className="fixed right-0 top-0 z-50 h-full w-full max-w-md overflow-y-auto border-l border-slate-200 bg-white shadow-2xl">
        <div className="flex items-center justify-between border-b border-slate-200 px-6 py-5">
          <div>
            <h2 className="text-lg font-bold text-slate-900">Video qo'shish</h2>
            <p className="mt-0.5 text-xs text-slate-500">
              Dars uchun video yuklang
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="rounded-xl p-2 text-slate-400 hover:bg-slate-100"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 px-6 py-5">
          <div className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3">
            <p className="text-xs text-slate-400">Dars</p>
            <p className="mt-1 text-sm font-medium text-slate-700">
              {lessonTitle || `Lesson #${lessonId || "-"}`}
            </p>
          </div>

          <div>
            <label className="mb-1.5 block text-xs font-medium text-slate-600">
              Video nomi
            </label>
            <input
              value={title}
              onChange={(e) => {
                setTitle(e.target.value);
                setError("");
              }}
              placeholder="Masalan: 1-dars Kirish"
              className="h-10 w-full rounded-xl border border-slate-200 px-4 text-sm outline-none focus:border-violet-400"
            />
          </div>

          <div>
            <label className="mb-1.5 block text-xs font-medium text-slate-600">
              Video fayl
            </label>

            <label className="flex cursor-pointer flex-col items-center justify-center rounded-2xl border border-dashed border-slate-300 px-4 py-8 text-center transition hover:border-violet-400 hover:bg-violet-50/30">
              <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-slate-100">
                <Upload className="h-5 w-5 text-slate-500" />
              </div>

              <span className="text-sm font-medium text-slate-700">
                Video yuklash uchun bosing
              </span>

              <span className="mt-1 text-xs text-slate-400">
                MP4, MOV, AVI ...
              </span>

              {fileName && (
                <span className="mt-3 rounded-lg bg-violet-50 px-3 py-1 text-xs font-medium text-violet-700">
                  {fileName}
                </span>
              )}

              <input
                type="file"
                accept="video/*"
                onChange={handleFileChange}
                className="hidden"
              />
            </label>
          </div>

          {error && (
            <div className="rounded-xl bg-rose-50 px-4 py-3 text-sm text-rose-600">
              {error}
            </div>
          )}

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
              {loading ? "Yuklanmoqda..." : "Saqlash"}
            </button>
          </div>
        </form>
      </div>
    </>
  );
}