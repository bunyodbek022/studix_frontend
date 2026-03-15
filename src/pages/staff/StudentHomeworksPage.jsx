import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { studentService } from "../../api/student.service";

function formatDate(date) {
  if (!date) return "-";
  return new Date(date).toLocaleDateString("en-GB");
}

export default function StudentHomeworksPage() {
  const { studentId, groupId } = useParams();
  const navigate = useNavigate();

  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchHomeworks = async () => {
    try {
      setLoading(true);
      setError("");

      const res = await studentService.getStudentGroupHomeworks(studentId, groupId);
      setItems(res?.data || []);
    } catch (err) {
      setError(
        err?.response?.data?.message ||
          "Vazifalarni yuklashda xatolik yuz berdi"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHomeworks();
  }, [studentId, groupId]);

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between gap-3">
        <h1 className="text-2xl font-semibold text-slate-800">Vazifalar</h1>

        <button
          onClick={() => navigate(-1)}
          className="inline-flex items-center gap-2 rounded-xl border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
        >
          <ArrowLeft className="h-4 w-4" />
          Orqaga
        </button>
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        {loading ? (
          <div className="py-10 text-center text-slate-500">Yuklanmoqda...</div>
        ) : error ? (
          <div className="rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
            {error}
          </div>
        ) : (
          <div className="overflow-hidden rounded-2xl border border-slate-200">
            <div className="grid grid-cols-[2fr_1.3fr_130px_160px_160px_100px] border-b border-slate-200 bg-slate-50 px-4 py-4 text-sm font-semibold text-slate-600">
              <span>Vazifa</span>
              <span>Dars</span>
              <span>Sana</span>
              <span>Status</span>
              <span>Teacher result</span>
              <span>Ball</span>
            </div>

            {items.length === 0 ? (
              <div className="px-4 py-10 text-center text-slate-500">
                Vazifalar topilmadi
              </div>
            ) : (
              items.map((item, index) => (
                <div
                  key={item.homeworkId || index}
                  className="grid grid-cols-[2fr_1.3fr_130px_160px_160px_100px] border-b border-slate-100 px-4 py-4 text-sm text-slate-700"
                >
                  <span>{item.title || "-"}</span>
                  <span>{item.lessonTitle || "-"}</span>
                  <span>{formatDate(item.createdAt)}</span>
                  <span>{item.studentResponseStatus || "-"}</span>
                  <span>{item.teacherResultStatus || "-"}</span>
                  <span>{item.score ?? "-"}</span>
                </div>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
}