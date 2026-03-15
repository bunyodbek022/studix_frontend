import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, BookOpen, Calendar, Clock, Eye, Trash2, User, Plus, X } from "lucide-react";
import { groupService } from "../../api/group.service";
import { studentService } from "../../api/student.service";
import { lessonService } from "../../api/lesson.service";

function formatDate(date) {
  if (!date) return "-";
  return new Date(date).toLocaleDateString("en-GB");
}

function AddStudentDrawer({ open, onClose, groupId, onSuccess }) {
  const [students, setStudents] = useState([]);
  const [selectedStudentId, setSelectedStudentId] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (open) {
      studentService.getStudents().then((res) => {
        setStudents(res?.data || []);
      });
      setSelectedStudentId("");
      setError("");
    }
  }, [open]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedStudentId) {
      setError("Talabani tanlang!");
      return;
    }
    try {
      setLoading(true);
      await groupService.addStudentToGroup({
        groupId: Number(groupId),
        studentId: Number(selectedStudentId),
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
          <h2 className="text-xl font-bold">Guruhga talaba qo'shish</h2>
          <button onClick={onClose} className="p-2"><X className="h-5 w-5"/></button>
        </div>
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="mb-2 block text-sm font-medium">Talabani tanlang</label>
            <select
              value={selectedStudentId}
              onChange={(e) => setSelectedStudentId(e.target.value)}
              className="w-full rounded-xl border p-3"
            >
              <option value="">Tanlang...</option>
              {students.map((s) => (
                <option key={s.id} value={s.id}>{s.fullName} ({s.email})</option>
              ))}
            </select>
          </div>
          {error && <div className="text-sm text-red-600">{error}</div>}
          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-xl bg-violet-600 p-3 text-white disabled:opacity-50"
          >
            {loading ? "Saqlanmoqda..." : "Saqlash"}
          </button>
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
      await lessonService.createLesson({
        groupId: Number(groupId),
        title,
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
          <h2 className="text-xl font-bold">Yangi dars qo'shish</h2>
          <button onClick={onClose} className="p-2"><X className="h-5 w-5"/></button>
        </div>
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="mb-2 block text-sm font-medium">Dars mavzusi</label>
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Masalan: 1-dars. Kirish"
              className="w-full rounded-xl border p-3"
            />
          </div>
          {error && <div className="text-sm text-red-600">{error}</div>}
          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-xl bg-violet-600 p-3 text-white disabled:opacity-50"
          >
            {loading ? "Saqlanmoqda..." : "Saqlash"}
          </button>
        </form>
      </div>
    </>
  );
}

export default function GroupDetailsPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [group, setGroup] = useState(null);
  const [students, setStudents] = useState([]);
  const [lessons, setLessons] = useState([]);
  
  const [activeTab, setActiveTab] = useState("STUDENTS"); // STUDENTS | LESSONS
  const [loading, setLoading] = useState(true);
  
  const [studentDrawer, setStudentDrawer] = useState(false);
  const [lessonDrawer, setLessonDrawer] = useState(false);

  const fetchGroupData = async () => {
    try {
      setLoading(true);
      const res = await groupService.getGroupById(id);
      setGroup(res?.data);
      fetchStudents();
      fetchLessons();
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

  const removeStudent = async (studentGroupId) => {
    if (!confirm("Talaba guruhdan chiqarilsinmi?")) return;
    try {
      await groupService.removeStudentFromGroup(studentGroupId);
      fetchStudents();
    } catch(err) {
      alert("Xatolik");
    }
  }

  const removeLesson = async (lessonId) => {
     if (!confirm("Dars o'chirilsinmi?")) return;
    try {
      await lessonService.deleteLesson(lessonId);
      fetchLessons();
    } catch(err) {
      alert("Xatolik");
    }
  }

  useEffect(() => {
    fetchGroupData();
  }, [id]);

  if (loading || !group) return <div className="p-10 text-center">Yuklanmoqda...</div>;

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <button
          onClick={() => navigate("/staff/groups")}
          className="inline-flex items-center gap-2 rounded-xl bg-white border px-4 py-2 text-sm font-medium text-slate-700 shadow-sm"
        >
          <ArrowLeft className="h-4 w-4" /> Orqaga
        </button>
      </div>

      <div className="rounded-3xl border bg-white p-6 shadow-sm">
        <h1 className="text-2xl font-bold text-slate-800 mb-4">{group.name}</h1>
        <div className="flex flex-wrap gap-6 text-sm text-slate-600">
            <div className="flex items-center gap-2">
                <BookOpen className="h-5 w-5 text-slate-400" />
                <span>Kurs: <b className="text-slate-800">{group.course?.name || "-"}</b></span>
            </div>
            <div className="flex items-center gap-2">
                <User className="h-5 w-5 text-slate-400" />
                <span>O'qituvchi: <b className="text-slate-800">{group.teacher?.fullName || "-"}</b></span>
            </div>
            <div className="flex items-center gap-2">
                <Calendar className="h-5 w-5 text-slate-400" />
                <span>Boshlanish: <b className="text-slate-800">{formatDate(group.startDate)}</b></span>
            </div>
            <div className="flex items-center gap-2">
                <Clock className="h-5 w-5 text-slate-400" />
                <span>Vaqt: <b className="text-slate-800">{group.startTime}</b></span>
            </div>
        </div>
      </div>

      <div className="rounded-3xl border bg-white p-6 shadow-sm">
        <div className="flex items-center justify-between border-b pb-4 mb-4">
           <div className="flex gap-4">
             <button 
                onClick={() => setActiveTab("STUDENTS")}
                className={`text-lg font-medium pb-2 border-b-2 ${activeTab === "STUDENTS" ? "border-violet-600 text-violet-700" : "border-transparent text-slate-500"}`}
             >
                Talabalar
             </button>
             <button 
                onClick={() => setActiveTab("LESSONS")}
                className={`text-lg font-medium pb-2 border-b-2 ${activeTab === "LESSONS" ? "border-violet-600 text-violet-700" : "border-transparent text-slate-500"}`}
             >
                Lesson
             </button>
           </div>
           
           {activeTab === "STUDENTS" ? (
             <button 
                onClick={() => setStudentDrawer(true)}
                className="inline-flex items-center gap-2 rounded-xl bg-violet-600 px-4 py-2 font-medium text-white">
                <Plus className="h-4 w-4"/> Talaba qo'shish
             </button>
           ) : (
             <button 
                onClick={() => setLessonDrawer(true)}
                className="inline-flex items-center gap-2 rounded-xl bg-violet-600 px-4 py-2 font-medium text-white">
                <Plus className="h-4 w-4"/> Lesson qo'shish
             </button>
           )}
        </div>

        {activeTab === "STUDENTS" && (
            <div className="space-y-4">
                {students.length === 0 ? <p className="text-slate-500 text-center py-4">Hali talabalar qo'shilmagan</p> : null}
                {students.map((sg, i) => (
                    <div key={sg.id} className="flex items-center justify-between border-b pb-4">
                        <div className="flex items-center gap-3">
                            <span className="w-6 text-slate-500">{i + 1}.</span>
                            <div className="font-medium">{sg.student?.fullName}</div>
                            <div className="text-slate-500 text-sm">{sg.student?.email}</div>
                        </div>
                        <div className="flex items-center gap-2">
                            <button onClick={() => navigate(`/staff/students/${sg.studentId}`)} className="p-2 border rounded-xl hover:bg-slate-50 text-slate-600">
                                <Eye className="h-4 w-4" />
                            </button>
                            <button onClick={() => removeStudent(sg.id)} className="p-2 border rounded-xl hover:bg-rose-50 text-rose-600">
                                <Trash2 className="h-4 w-4" />
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        )}

        {activeTab === "LESSONS" && (
            <div className="space-y-4">
                {lessons.length === 0 ? <p className="text-slate-500 text-center py-4">Hali darslar qo'shilmagan</p> : null}
                {lessons.map((lesson, i) => (
                    <div key={lesson.id} className="flex items-center justify-between border-b pb-4">
                        <div className="flex items-center gap-6">
                            <span className="w-6 text-slate-500">{i + 1}.</span>
                            <div className="font-medium text-lg min-w-[200px]">{lesson.title}</div>
                            <div className="text-slate-500 text-sm">Sana: {formatDate(lesson.created_at)}</div>
                        </div>
                        <div className="flex items-center gap-2">
                            <button 
                                onClick={() => navigate(`/staff/lessons/${lesson.id}`)} 
                                className="p-2 border rounded-xl hover:bg-slate-50 text-slate-600 inline-flex items-center gap-2 px-4"
                            >
                                <Eye className="h-4 w-4" /> Ko'rish
                            </button>
                            <button onClick={() => removeLesson(lesson.id)} className="p-2 border rounded-xl hover:bg-rose-50 text-rose-600">
                                <Trash2 className="h-4 w-4" />
                            </button>
                        </div>
                    </div>
                ))}
            </div>
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
    </div>
  );
}
