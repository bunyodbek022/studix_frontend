import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom"
import StudentLoginPage from "./pages/auth/studentLoginPage"
import TeacherLoginPage from "./pages/auth/teacherLoginPage"
import StaffLoginPage from "./pages/auth/staffLoginPage"

import StudentDashboard from "./pages/student/StudentDashboard"
import TeacherDashboard from "./pages/teacher/TeacherDashboard"
import StaffDashboard from "./pages/staff/StaffDashboard"
import StudentsPage from "./pages/staff/StudentsPage"
import TeachersPage from "./pages/staff/TeachersPage"
import CoursesPage from "./pages/staff/CoursesPage"
import GroupsPage from "./pages/staff/GroupsPage"
import RoomsPage from "./pages/staff/RoomsPage"
import SettingsPage from "./pages/staff/SettingsPage"
import StudentDetailsPage from "./pages/staff/StudentDetailsPage";
import StudentAttendancePage from "./pages/staff/StudentAttendancePage";
import StudentHomeworksPage from "./pages/staff/StudentHomeworksPage";
import TeacherDetailsPage from "./pages/staff/TeacherDetailsPage";
import GroupDetailsPage from "./pages/staff/GroupDetailsPage";
import LessonDetailsPage from "./pages/staff/LessonDetailsPage";

import ProtectedRoute from "./components/guards/protectedRoute"
import RoleRoute from "./components/guards/RoleRoute"
import StaffLayout from "./layout/StaffLayout"

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/student/login" element={<StudentLoginPage />} />
        <Route path="/teacher/login" element={<TeacherLoginPage />} />
        <Route path="/staff/login" element={<StaffLoginPage />} />

        <Route element={<ProtectedRoute />}>
          <Route element={<RoleRoute allowedRoles={["STUDENT"]} />}>
            <Route path="/student/dashboard" element={<StudentDashboard />} />
          </Route>

          <Route element={<RoleRoute allowedRoles={["TEACHER"]} />}>
            <Route path="/teacher/dashboard" element={<TeacherDashboard />} />
          </Route>

          <Route
            element={
              <RoleRoute
                allowedRoles={[
                  "SUPERADMIN",
                  "ADMIN",
                  "MANAGEMENT",
                  "ADMINISTRATOR",
                ]}
              />
            }
          >
            <Route path="/staff" element={<StaffLayout />}>
              <Route path="dashboard" element={<StaffDashboard />} />
             <Route path="students" element={<StudentsPage />} />
            <Route path="students/:id" element={<StudentDetailsPage />} />
            <Route path="students/:studentId/attendance/:groupId" element={<StudentAttendancePage />}/>
            <Route path="students/:studentId/homeworks/:groupId" element={<StudentHomeworksPage />}/>
            <Route path="teachers" element={<TeachersPage />} />
            <Route path="teachers/:id" element={<TeacherDetailsPage />} />
            <Route path="courses" element={<CoursesPage />} />
            <Route path="groups" element={<GroupsPage />} />
            <Route path="groups/:id" element={<GroupDetailsPage />} />
            <Route path="lessons/:id" element={<LessonDetailsPage />} />
            <Route path="rooms" element={<RoomsPage />} />
            <Route path="settings" element={<SettingsPage />} />
            </Route>
          </Route>
        </Route>

        <Route path="/" element={<Navigate to="/student/login" replace />} />
        <Route path="*" element={<Navigate to="/student/login" replace />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App