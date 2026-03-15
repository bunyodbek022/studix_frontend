import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, CalendarDays, ClipboardList, Eye, Home, Mail, Pencil, User, X } from "lucide-react";
import { studentService } from "../../api/student.service";
import StudentDrawer from "./components/StudentDrawer";

function formatDate(date) {
  if (!date) return "-";
  return new Date(date).toLocaleDateString("en-GB");
}

export default function StudentDetailsPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [student, setStudent] = useState(null);
  const [summaryRows, setSummaryRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [editDrawerOpen, setEditDrawerOpen] = useState(false);

  const [attendanceOpen, setAttendanceOpen] = useState(false);
  const [attendanceLoading, setAttendanceLoading] = useState(false);
  const [attendanceError, setAttendanceError] = useState("");
  const [attendanceData, setAttendanceData] = useState([]);
  const [attendanceSummary, setAttendanceSummary] = useState(null);

  const [homeworksOpen, setHomeworksOpen] = useState(false);
  const [homeworksLoading, setHomeworksLoading] = useState(false);
  const [homeworksError, setHomeworksError] = useState("");
  const [homeworksData, setHomeworksData] = useState([]);
  const [homeworksTitle, setHomeworksTitle] = useState("");

  const fetchPageData = async () => {
    try {
      setLoading(true);
      setError("");

      const [studentRes, summaryRes] = await Promise.all([
        studentService.getStudentById(id),
        studentService.getStudentGroupSummary(id),
      ]);

      setStudent(studentRes?.data || null);
      setSummaryRows(summaryRes?.data || []);
    } catch (err) {
      setError(err?.response?.data?.message || "Student ma'lumotlarini yuklashda xatolik yuz berdi");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPageData();
  }, [id]);

  if (loading) {
    return (
      <div className="rounded-3xl border border-slate-200 bg-white px-6 py-10 text-center text-slate-500 shadow-sm">
        Yuklanmoqda...
      </div>
    );
  }

  if (error) {
    return <div className="rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">{error}</div>;
  }

  if (!student) {
    return (
      <div className="rounded-2xl border border-slate-200 bg-white px-4 py-8 text-center text-slate-500">
        Student topilmadi
      </div>
    );
  }

  return (
    <>
      <div className="space-y-5">
        <div className="flex items-center justify-between gap-3">
          <button
            onClick={() => navigate("/staff/students")}
            className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 shadow-sm hover:bg-slate-50"
          >
            <ArrowLeft className="h-4 w-4" />
            Orqaga
          </button>

          <button
            onClick={() => setEditDrawerOpen(true)}
            className="inline-flex items-center gap-2 rounded-xl bg-violet-600 px-4 py-2 text-sm font-medium text-white hover:bg-violet-700"
          >
            <Pencil className="h-4 w-4" />
            Tahrirlash
          </button>
        </div>

        <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
          <div className="h-48 w-full bg-linear-to-r from-slate-200 via-slate-100 to-slate-200" />

          <div className="relative px-5 pb-5">
            <div className="-mt-14 flex items-center gap-4">
              {student.photo ? (
                <img
                  src={student.photo}
                  alt={student.fullName}
                  className="h-28 w-28 rounded-full border-4 border-white object-cover shadow-md"
                />
              ) : (
                <div className="flex h-28 w-28 items-center justify-center rounded-full border-4 border-white bg-slate-100 text-3xl font-semibold text-slate-700 shadow-md">
                  {student.fullName?.[0] || "S"}
                </div>
              )}

              <div className="pt-8">
                <div className="flex flex-wrap items-center gap-3 text-sm text-slate-400">
                  <Home className="h-4 w-4" />
                  <span>Students</span>
                  <span>›</span>
                  <span className="font-medium text-slate-700">{student.fullName}</span>
                </div>

                <div className="mt-2 flex flex-wrap items-center gap-2">
                  <span className="rounded-full bg-emerald-50 px-2.5 py-1 text-[11px] font-semibold text-emerald-700">
                    {student.status}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-5 xl:grid-cols-[300px_1fr]">
          <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
            <div className="mb-4 flex rounded-xl bg-slate-100 p-1">
              <button className="flex-1 rounded-lg bg-white px-4 py-2 text-sm font-semibold text-slate-800 shadow-sm">
                Ma'lumotlari
              </button>
            </div>

            <div className="rounded-2xl bg-slate-50 p-4">
              <h3 className="mb-4 text-lg font-semibold text-slate-900">Talaba ma'lumotlari</h3>

              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="mt-0.5 flex h-8 w-8 items-center justify-center rounded-lg bg-slate-100 text-slate-500">
                    <User className="h-4 w-4" />
                  </div>
                  <div>
                    <p className="text-[12px] text-slate-400">F.I.O</p>
                    <p className="text-[15px] font-medium text-slate-700">{student.fullName}</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="mt-0.5 flex h-8 w-8 items-center justify-center rounded-lg bg-slate-100 text-slate-500">
                    <CalendarDays className="h-4 w-4" />
                  </div>
                  <div>
                    <p className="text-[12px] text-slate-400">Tug'ilgan sana</p>
                    <p className="text-[15px] font-medium text-slate-700">{formatDate(student.birth_date)}</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="mt-0.5 flex h-8 w-8 items-center justify-center rounded-lg bg-slate-100 text-slate-500">
                    <Mail className="h-4 w-4" />
                  </div>
                  <div>
                    <p className="text-[12px] text-slate-400">Email</p>
                    <p className="text-[15px] font-medium text-slate-700 break-all">{student.email}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
            <div className="overflow-hidden rounded-2xl border border-slate-200">
              <div className="grid grid-cols-[1.3fr_2fr_140px_180px_120px] border-b border-slate-200 bg-slate-50 px-4 py-4 text-sm font-semibold text-slate-600">
                <span>Fan</span>
                <span>O'qituvchi</span>
                <span>Davomat</span>
                <span>Amal</span>
                <span>Reja</span>
              </div>

              {summaryRows.length === 0 ? (
                <div className="px-4 py-10 text-center text-slate-500">Guruhlar topilmadi</div>
              ) : (
                summaryRows.map((row, index) => (
                  <div
                    key={row.groupId || index}
                    className="grid grid-cols-[1.3fr_2fr_140px_180px_120px] items-center border-b border-slate-100 px-4 py-5 text-sm"
                  >
                    <div className="pr-4 text-[15px] font-medium text-slate-700">{row.courseName || "-"}</div>

                    <div className="pr-4">
                      <p className="text-[15px] font-medium text-slate-800">
                        {row.groupName || "-"} - {row.teacherName || "-"}
                      </p>
                    </div>

                    <div>
                      <button
                        onClick={() => navigate(`/staff/students/${id}/attendance/${row.groupId}`)}
                        className="inline-flex h-11 min-w-14 items-center justify-center rounded-xl border border-slate-300 px-4 text-[18px] font-semibold text-slate-700 hover:bg-slate-50"
                      >
                        {row.attendanceMissedCount ?? 0}
                      </button>
                    </div>

                    <div>
                      <button
                        onClick={() => navigate(`/staff/students/${id}/homeworks/${row.groupId}`)}
                        className="inline-flex items-center gap-2 rounded-xl border border-slate-300 px-4 py-3 text-sm font-medium text-slate-700 hover:bg-slate-50"
                      >
                        <ClipboardList className="h-4 w-4" />
                        Vazifalar
                      </button>
                    </div>

                    <div>
                      <button className="inline-flex items-center justify-center rounded-xl border border-slate-300 p-3 text-slate-700 hover:bg-slate-50">
                        <Eye className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>

      <StudentDrawer
        open={editDrawerOpen}
        onClose={() => setEditDrawerOpen(false)}
        mode="edit"
        initialData={student}
        onSuccess={fetchPageData}
      />
    </>
  );
}
