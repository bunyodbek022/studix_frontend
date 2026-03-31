import { useState } from "react";
import { NavLink, Outlet, useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import { ToastContainer } from "../components/ui/Toast";
import {
    Bell,
    BookOpen,
    DoorOpen,
    GraduationCap,
    LayoutDashboard,
    LogOut,
    Menu,
    Moon,
    Search,
    Settings,
    UserSquare2,
    Users,
    X,
} from "lucide-react";

const sidebarItems = [
    { label: "Dashboard", icon: LayoutDashboard, path: "/staff/dashboard" },
    { label: "Students", icon: Users, path: "/staff/students" },
    { label: "Teachers", icon: UserSquare2, path: "/staff/teachers" },
    { label: "Courses", icon: BookOpen, path: "/staff/courses" },
    { label: "Groups", icon: GraduationCap, path: "/staff/groups" },
    { label: "Rooms", icon: DoorOpen, path: "/staff/rooms" },
    { label: "Settings", icon: Settings, path: "/staff/settings" },
];

export default function StaffLayout() {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const navigate = useNavigate();

    const handleLogout = () => {
        Cookies.remove("token");
        Cookies.remove("role");
        Cookies.remove("user");
        navigate("/staff/login", { replace: true });
    };

    return (
        <div className="h-screen overflow-hidden bg-[#f6f7fb] text-slate-900">
            <ToastContainer />

            {sidebarOpen && (
                <button
                    className="fixed inset-0 z-30 bg-slate-900/30 lg:hidden"
                    onClick={() => setSidebarOpen(false)}
                />
            )}

            <aside
                className={`fixed left-0 top-0 z-40 flex h-screen w-64 flex-col border-r border-slate-200 bg-white px-4 py-5 transition-transform duration-300 ${
                    sidebarOpen ? "translate-x-0" : "-translate-x-full"
                } lg:translate-x-0`}
            >
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-600 text-base font-black text-white shadow-lg">
                            S
                        </div>
                        <div>
                            <h1 className="text-lg font-bold text-slate-900">Studix</h1>
                            <p className="text-xs text-slate-500">Admin panel</p>
                        </div>
                    </div>

                    <button
                        onClick={() => setSidebarOpen(false)}
                        className="rounded-xl p-2 text-slate-500 hover:bg-slate-100 lg:hidden"
                    >
                        <X className="h-5 w-5" />
                    </button>
                </div>

                <nav className="mt-8 space-y-2 overflow-y-auto">
                    {sidebarItems.map((item) => {
                        const Icon = item.icon;

                        return (
                            <NavLink
                                key={item.label}
                                to={item.path}
                                className={({ isActive }) =>
                                    `flex w-full items-center gap-3 rounded-2xl px-4 py-3 text-sm font-medium transition ${
                                        isActive
                                            ? "bg-emerald-50 text-emerald-700"
                                            : "text-slate-600 hover:bg-slate-100"
                                    }`
                                }
                            >
                                <Icon className="h-4 w-4" />
                                <span>{item.label}</span>
                            </NavLink>
                        );
                    })}
                </nav>

                <div className="mt-auto pt-8">
                    <button
                        onClick={handleLogout}
                        className="flex w-full items-center gap-3 rounded-2xl px-4 py-3 text-sm font-medium text-rose-600 transition hover:bg-rose-50"
                    >
                        <LogOut className="h-4 w-4" />
                        Chiqish
                    </button>
                </div>
            </aside>

            <main className="h-screen overflow-y-auto lg:ml-64">
                <div className="px-4 py-4 sm:px-5 lg:px-6">
                    <header className="sticky top-0 z-20 mb-6 rounded-3xl border border-slate-200 bg-white px-4 py-3 shadow-sm">
                        <div className="flex items-center justify-between gap-3">
                            <div className="flex flex-1 items-center gap-3">
                                <button
                                    onClick={() => setSidebarOpen(true)}
                                    className="rounded-2xl border border-slate-200 p-2.5 text-slate-600 lg:hidden"
                                >
                                    <Menu className="h-5 w-5" />
                                </button>

                                <div className="relative w-full max-w-sm">
                                    <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                                    <input
                                        placeholder="Qidirish..."
                                        className="h-11 w-full rounded-2xl border border-slate-200 bg-slate-50 pl-10 pr-4 text-sm outline-none transition focus:border-violet-400 focus:ring-4 focus:ring-violet-50"
                                    />
                                </div>
                            </div>

                            <div className="flex items-center gap-2">
                                <button className="relative flex h-11 w-11 items-center justify-center rounded-2xl border border-slate-200 bg-white text-slate-600 shadow-sm hover:bg-slate-50">
                                    <Bell className="h-4 w-4" />
                                    <span className="absolute right-3 top-3 h-2 w-2 rounded-full bg-emerald-500" />
                                </button>

                                <button className="flex h-11 w-11 items-center justify-center rounded-2xl border border-slate-200 bg-[#25324a] text-white shadow-sm hover:opacity-90">
                                    <Moon className="h-4 w-4" />
                                </button>

                                <button className="flex h-11 items-center gap-2 rounded-2xl border border-slate-200 bg-white px-3 shadow-sm hover:bg-slate-50">
                                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-violet-500 text-xs font-bold text-white">
                                        S
                                    </div>
                                    <div className="text-left">
                                        <p className="text-sm font-semibold text-slate-800">Super Admin</p>
                                    </div>
                                </button>
                            </div>
                        </div>
                    </header>

                    <Outlet />
                </div>
            </main>
        </div>
    );
}