import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, BookOpen, Briefcase, Eye, Home, Mail, Pencil, User } from "lucide-react";
import { teacherService } from "../../api/teacher.service";
import TeacherDrawer from "./components/TeacherDrawer";

export default function TeacherDetailsPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [teacher, setTeacher] = useState(null);
  const [groups, setGroups] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [editDrawerOpen, setEditDrawerOpen] = useState(false);

  const fetchPageData = async () => {
    try {
      setLoading(true);
      setError("");

      const [teacherRes, groupsRes] = await Promise.all([
        teacherService.getTeacherById(id),
        teacherService.getTeacherGroups(id),
      ]);

      setTeacher(teacherRes?.data || null);
      setGroups(groupsRes?.data || []);
    } catch (err) {
      setError(err?.response?.data?.message || "O'qituvchi ma'lumotlarini yuklashda xatolik yuz berdi");
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

  if (!teacher) {
    return (
      <div className="rounded-2xl border border-slate-200 bg-white px-4 py-8 text-center text-slate-500">
        O'qituvchi topilmadi
      </div>
    );
  }

  return (
    <>
      <div className="space-y-5">
        <div className="flex items-center justify-between gap-3">
          <button
            onClick={() => navigate("/staff/teachers")}
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
              {teacher.photo ? (
                <img
                  src={teacher.photo}
                  alt={teacher.fullName}
                  className="h-28 w-28 rounded-full border-4 border-white object-cover shadow-md"
                />
              ) : (
                <div className="flex h-28 w-28 items-center justify-center rounded-full border-4 border-white bg-slate-100 text-3xl font-semibold text-slate-700 shadow-md">
                  {teacher.fullName?.[0] || "T"}
                </div>
              )}

              <div className="pt-8">
                <div className="flex flex-wrap items-center gap-3 text-sm text-slate-400">
                  <Home className="h-4 w-4" />
                  <span>Ustozlar</span>
                  <span>›</span>
                  <span className="font-medium text-slate-700">{teacher.fullName}</span>
                </div>

                <div className="mt-2 flex flex-wrap items-center gap-2">
                  <span className="rounded-full bg-emerald-50 px-2.5 py-1 text-[11px] font-semibold text-emerald-700">
                    {teacher.status}
                  </span>
                  <span className="rounded-full bg-blue-50 px-2.5 py-1 text-[11px] font-semibold text-blue-700">
                    {teacher.position}
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
              <h3 className="mb-4 text-lg font-semibold text-slate-900">O'qituvchi ma'lumotlari</h3>

              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="mt-0.5 flex h-8 w-8 items-center justify-center rounded-lg bg-slate-100 text-slate-500">
                    <User className="h-4 w-4" />
                  </div>
                  <div>
                    <p className="text-[12px] text-slate-400">F.I.O</p>
                    <p className="text-[15px] font-medium text-slate-700">{teacher.fullName}</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="mt-0.5 flex h-8 w-8 items-center justify-center rounded-lg bg-slate-100 text-slate-500">
                    <Briefcase className="h-4 w-4" />
                  </div>
                  <div>
                    <p className="text-[12px] text-slate-400">Tajriba</p>
                    <p className="text-[15px] font-medium text-slate-700">{teacher.experience} yil</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="mt-0.5 flex h-8 w-8 items-center justify-center rounded-lg bg-slate-100 text-slate-500">
                    <Mail className="h-4 w-4" />
                  </div>
                  <div>
                    <p className="text-[12px] text-slate-400">Email</p>
                    <p className="text-[15px] font-medium text-slate-700 break-all">{teacher.email}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
            <div className="overflow-hidden rounded-2xl border border-slate-200">
              <div className="grid grid-cols-[1.5fr_1fr_1fr_120px] border-b border-slate-200 bg-slate-50 px-4 py-4 text-sm font-semibold text-slate-600">
                <span>Guruh nomi</span>
                <span>Kurs</span>
                <span>Vaqti</span>
                <span>Amal</span>
              </div>

              {groups.length === 0 ? (
                <div className="px-4 py-10 text-center text-slate-500">Guruhlar topilmadi</div>
              ) : (
                groups.map((group) => (
                  <div
                    key={group.id}
                    onClick={() => navigate(`/staff/groups/${group.id}`)}
                    className="cursor-pointer hover:bg-slate-50 transition grid grid-cols-[1.5fr_1fr_1fr_120px] items-center border-b border-slate-100 px-4 py-5 text-sm"
                  >
                    <div className="pr-4 text-[15px] font-medium text-slate-800">{group.name}</div>

                    <div className="pr-4">
                      <p className="text-[14px] text-slate-600">
                        {group.course?.name || "-"}
                      </p>
                    </div>

                    <div className="pr-4">
                        <span className="text-[14px] text-slate-600">{group.startTime || "-"}</span>
                    </div>

                    <div>
                      <button 
                        onClick={(e) => {
                            e.stopPropagation();
                            navigate(`/staff/groups/${group.id}`)}
                        }
                        className="inline-flex items-center justify-center rounded-xl border border-slate-300 p-3 text-slate-700 hover:bg-slate-100">
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

      <TeacherDrawer
        open={editDrawerOpen}
        onClose={() => setEditDrawerOpen(false)}
        mode="edit"
        initialData={teacher}
        onSuccess={fetchPageData}
      />
    </>
  );
}
