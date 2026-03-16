import React, { useEffect, useState } from "react";
import {
  BookOpen,
  GraduationCap,
  Users,
  UserSquare2,
  DoorOpen,
  Building2,
} from "lucide-react";
import { dashboardService } from "../../api/dashboard.service";
import { getArrayFromResponse } from "../../utils/normalizeResponse";

function StatCard({ item }) {
  const Icon = item.icon;

  return (
    <div className="rounded-3xl border border-slate-200 bg-white px-5 py-4 shadow-sm">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-sm text-slate-500">{item.label}</p>
          <h3 className="mt-3 text-3xl font-bold leading-none text-slate-900">
            {item.value}
          </h3>
        </div>

        <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-violet-50 text-violet-500">
          <Icon className="h-5 w-5" />
        </div>
      </div>
    </div>
  );
}

export default function StaffDashboard() {
  const [loading, setLoading] = useState(true);
  const [students, setStudents] = useState([]);
  const [teachers, setTeachers] = useState([]);
  const [groups, setGroups] = useState([]);
  const [courses, setCourses] = useState([]);
  const [rooms, setRooms] = useState([]);
  const [users, setUsers] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchDashboardData() {
      try {
        setLoading(true);
        setError("");

        const [
          usersRes,
          studentsRes,
          teachersRes,
          coursesRes,
          groupsRes,
          roomsRes,
        ] = await Promise.all([
          dashboardService.getUsers(),
          dashboardService.getStudents(),
          dashboardService.getTeachers(),
          dashboardService.getCourses(),
          dashboardService.getGroups(),
          dashboardService.getRooms(),
        ]);

        setUsers(getArrayFromResponse(usersRes));
        setStudents(getArrayFromResponse(studentsRes));
        setTeachers(getArrayFromResponse(teachersRes));
        setCourses(getArrayFromResponse(coursesRes));
        setGroups(getArrayFromResponse(groupsRes));
        setRooms(getArrayFromResponse(roomsRes));
      } catch (err) {
        console.error(err);
        setError(
          err?.response?.data?.message ||
            "Ma'lumotlarni yuklashda xatolik yuz berdi"
        );
      } finally {
        setLoading(false);
      }
    }

    fetchDashboardData();
  }, []);

  const stats = [
    { label: "Sinflar", value: groups.length || 0, icon: GraduationCap },
    { label: "Fanlar", value: courses.length || 0, icon: BookOpen },
    { label: "Talabalar", value: students.length || 0, icon: Users },
    { label: "O'qituvchilar", value: teachers.length || 0, icon: UserSquare2 },
    { label: "Xonalar", value: rooms.length || 0, icon: DoorOpen },
    { label: "Xodimlar", value: users.length || 0, icon: Building2 },
  ];

  return (
    <>
      <section className="mb-6">
        <h2 className="text-3xl font-bold tracking-tight text-slate-900">
          Salom, Super Admin!
        </h2>
        <p className="mt-2 text-base text-slate-500">
          Studix platformasiga xush kelibsiz!
        </p>
      </section>

      {error && (
        <div className="mb-5 rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
          {error}
        </div>
      )}

      {loading ? (
        <div className="rounded-3xl border border-slate-200 bg-white px-6 py-8 text-center text-sm text-slate-500 shadow-sm">
          Yuklanmoqda...
        </div>
      ) : (
        <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {stats.map((item) => (
            <StatCard key={item.label} item={item} />
          ))}
        </section>
      )}
    </>
  );
}