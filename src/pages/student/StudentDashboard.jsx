import { authStorage } from "../../utils/auth"

export default function StudentDashboard() {
  const user = authStorage.getUser()

  return (
    <div className="min-h-screen bg-slate-100 p-6">
      <div className="bg-white rounded-2xl shadow-sm p-6">
        <h1 className="text-2xl font-bold text-slate-800">
          Student Dashboard
        </h1>
        <p className="text-slate-500 mt-2">
          Xush kelibsiz, {user?.fullName || "Student"}
        </p>
      </div>
    </div>
  )
}