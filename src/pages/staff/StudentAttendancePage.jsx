import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { studentService } from "../../api/student.service";

function formatDate(date) {
  if (!date) return "-";
  return new Date(date).toLocaleDateString("en-GB");
}

export default function StudentAttendancePage() {
  const { studentId, groupId } = useParams();
  const navigate = useNavigate();

  const [summary, setSummary] = useState(null);
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchAttendance = async () => {
    try {
      setLoading(true);
      setError("");

      const res = await studentService.getAttendanceDetails(studentId, groupId);

      setSummary(res?.data?.summary || null);
      setItems(res?.data?.items || []);
    } catch (err) {
      setError(
        err?.response?.data?.message ||
          "Davomat ma'lumotlarini yuklashda xatolik yuz berdi"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAttendance();
  }, [studentId, groupId]);

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between gap-3">
        <h1 className="text-2xl font-semibold text-slate-800">Davomat</h1>

        <button
          onClick={() => navigate(-1)}
          className="inline-flex items-center gap-2 rounded-xl border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
        >
          <ArrowLeft className="h-4 w-4" />
          Orqaga
        </button>
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="mb-6">
          <p className="text-sm text-slate-500">
            {summary?.courseName || "-"} / {summary?.groupName || "-"}
          </p>
        </div>

        {loading ? (
          <div className="py-10 text-center text-slate-500">Yuklanmoqda...</div>
        ) : error ? (
          <div className="rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
            {error}
          </div>
        ) : (
          <div className="overflow-hidden rounded-2xl border border-slate-200">
            <div className="mb-6 flex items-center justify-between">
              <div className="w-90">
                <select className="h-11 w-full rounded-xl border border-slate-300 px-4 text-sm outline-none">
                  <option>{summary?.courseName || "Fan tanlang"}</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-[140px_1.4fr_140px_140px_2fr] border-b border-slate-200 bg-slate-50 px-4 py-4 text-sm font-semibold text-slate-600">
              <span>Vaqt</span>
              <span>Fan</span>
              <span>Turi</span>
              <span>Mavzu raqami</span>
              <span>Mavzu</span>
            </div>

            {items.length === 0 ? (
              <div className="px-4 py-10 text-center text-slate-500">
                Ma'lumot topilmadi
              </div>
            ) : (
              items.map((item, index) => (
                <div
                  key={item.attendanceId || item.lessonId || index}
                  className="grid grid-cols-[140px_1.4fr_140px_140px_2fr] border-b border-slate-100 px-4 py-4 text-sm text-slate-700"
                >
                  <span>{formatDate(item.date)}</span>
                  <span>{item.courseName || "-"}</span>
                  <span>{item.lessonType || "-"}</span>
                  <span>{item.topicOrder || "-"}</span>
                  <span>{item.topicTitle || item.lessonTitle || "-"}</span>
                </div>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
}