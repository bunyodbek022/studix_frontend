import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, PlayCircle, Plus, Trash2, Video, X, Upload } from "lucide-react";
import { lessonService } from "../../api/lesson.service";
import { lessonVideoService } from "../../api/lessonVideo.service";

function formatDate(date) {
  if (!date) return "-";
  return new Date(date).toLocaleDateString("en-GB");
}

function AddVideoDrawer({ open, onClose, lessonId, onSuccess }) {
  const [title, setTitle] = useState("");
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (open) {
      setTitle("");
      setFile(null);
      setError("");
    }
  }, [open]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title || !file) {
      setError("Iltimos, barcha maydonlarni to'ldiring!");
      return;
    }
    try {
      setLoading(true);
      await lessonVideoService.uploadVideo({
        lessonId: Number(lessonId),
        title,
        file
      });
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
      <div className="fixed inset-0 z-40 bg-black/20" onClick={onClose} />
      <div className="fixed right-0 top-0 z-50 h-full w-full max-w-md bg-white shadow-2xl">
        <div className="flex items-center justify-between border-b px-6 py-5">
          <h2 className="text-xl font-bold">Video qo'shish</h2>
          <button onClick={onClose} className="p-2"><X className="h-5 w-5"/></button>
        </div>
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="mb-2 block text-sm font-medium">Video sarlavhasi</label>
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Masalan: 1-qism"
              className="w-full rounded-xl border p-3 outline-none focus:border-violet-400"
            />
          </div>
          <div>
            <label className="mb-2 block text-sm font-medium">Video fayli</label>
            <label className="flex cursor-pointer flex-col items-center justify-center rounded-2xl border border-dashed border-slate-300 px-4 py-8 text-center transition hover:border-violet-400 hover:bg-violet-50/30">
                <Upload className="mb-3 h-8 w-8 text-slate-400" />
                <span className="text-sm font-medium text-slate-700">Video tanlash uchun bosing</span>
                <span className="mt-1 text-xs text-slate-400">{file ? file.name : "MP4, WEBM"}</span>
                <input
                    type="file"
                    accept="video/*"
                    onChange={(e) => setFile(e.target.files?.[0])}
                    className="hidden"
                />
            </label>
          </div>
          {error && <div className="text-sm text-red-600">{error}</div>}
          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-xl bg-violet-600 p-3 text-white disabled:opacity-50"
          >
            {loading ? "Yuklanmoqda..." : "Saqlash"}
          </button>
        </form>
      </div>
    </>
  );
}

export default function LessonDetailsPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [lesson, setLesson] = useState(null);
  const [loading, setLoading] = useState(true);
  
  const [videoDrawer, setVideoDrawer] = useState(false);
  const [currentVideoUrl, setCurrentVideoUrl] = useState(null);

  const fetchLesson = async () => {
    try {
      setLoading(true);
      const res = await lessonService.getLessonById(id);
      setLesson(res?.data?.data); // Adjusted according to service return structure
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const removeVideo = async (videoId) => {
     if (!confirm("Video o'chirilsinmi?")) return;
    try {
      await lessonVideoService.deleteVideo(videoId);
      fetchLesson();
    } catch(err) {
      alert("Xatolik");
    }
  }

  useEffect(() => {
    fetchLesson();
  }, [id]);

  if (loading || !lesson) return <div className="p-10 text-center">Yuklanmoqda...</div>;

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <button
          onClick={() => navigate(`/staff/groups/${lesson.groupId}`)}
          className="inline-flex items-center gap-2 rounded-xl bg-white border px-4 py-2 text-sm font-medium text-slate-700 shadow-sm"
        >
          <ArrowLeft className="h-4 w-4" /> Orqaga
        </button>
      </div>

      <div className="rounded-3xl border bg-white p-6 shadow-sm">
        <h1 className="text-2xl font-bold text-slate-800 mb-2">{lesson.title}</h1>
        <div className="flex flex-wrap gap-6 text-sm text-slate-500">
            <span>Sana: {formatDate(lesson.created_at)}</span>
            {lesson.group && <span>Guruh: {lesson.group.name}</span>}
        </div>
      </div>

      <div className="rounded-3xl border bg-white p-6 shadow-sm">
        <div className="flex items-center justify-between border-b pb-4 mb-4">
           <div className="flex gap-4">
             <h2 className="text-lg font-medium text-slate-800">Videolar</h2>
           </div>
           
           <button 
              onClick={() => setVideoDrawer(true)}
              className="inline-flex items-center gap-2 rounded-xl bg-violet-600 px-4 py-2 font-medium text-white">
              <Plus className="h-4 w-4"/> Video qo'shish
           </button>
        </div>

        <div className="space-y-4">
            {lesson.lessonVideo?.length === 0 ? <p className="text-slate-500 text-center py-4">Video mavjud emas</p> : null}
            {lesson.lessonVideo?.map((video, i) => (
                <div key={video.id} className="flex items-center justify-between border-b pb-4">
                    <div className="flex items-center gap-4">
                        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-violet-100 text-violet-600">
                            <Video className="h-6 w-6" />
                        </div>
                        <div>
                            <div className="font-medium text-lg">{video.title}</div>
                            <div className="text-slate-500 text-sm">O'rnatildi: {formatDate(video.created_at)}</div>
                        </div>
                    </div>
                    <div className="flex items-center gap-3">
                        <button 
                            onClick={() => setCurrentVideoUrl(`http://localhost:4000/uploads/videos/${video.file}`)}
                            className="inline-flex items-center gap-2 rounded-xl border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
                        >
                            <PlayCircle className="h-4 w-4" /> Ijro
                        </button>
                        <button onClick={() => removeVideo(video.id)} className="p-2 border rounded-xl hover:bg-rose-50 text-rose-600">
                            <Trash2 className="h-4 w-4" />
                        </button>
                    </div>
                </div>
            ))}
        </div>
      </div>

      {currentVideoUrl && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 px-4">
            <div className="relative w-full max-w-4xl bg-black rounded-2xl overflow-hidden shadow-2xl">
                <button 
                    onClick={() => setCurrentVideoUrl(null)}
                    className="absolute top-4 right-4 z-10 rounded-full bg-black/50 p-2 text-white hover:bg-black/80"
                >
                    <X className="h-6 w-6"/>
                </button>
                <video 
                    controls 
                    autoPlay 
                    src={currentVideoUrl}
                    className="w-full max-h-[85vh]"
                />
            </div>
        </div>
      )}

      <AddVideoDrawer 
        open={videoDrawer} 
        onClose={() => setVideoDrawer(false)}
        lessonId={id}
        onSuccess={fetchLesson}
      />
    </div>
  );
}
