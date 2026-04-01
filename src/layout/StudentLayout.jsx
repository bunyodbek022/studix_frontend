import { useState } from "react";
import { NavLink, Outlet, useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import { ToastContainer } from "../components/ui/Toast";
import {
    Bell,
    Gift,
    LayoutDashboard,
    LogOut,
    Menu,
    Moon,
    Search,
    ShoppingBag,
    Coins,
    BookOpen,
    X,
} from "lucide-react";

const sidebarItems = [
    { label: "Dashboard", icon: LayoutDashboard, path: "/student/dashboard" },
    { label: "Mening Kurslarim", icon: BookOpen, path: "/student/courses" },
    { label: "Do'kon (Studix Shop)", icon: ShoppingBag, path: "/student/shop" },
];

export default function StudentLayout() {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const navigate = useNavigate();

    // Mock student data for coin system preview
    const studentInfo = {
        name: "Javohir Tursunov",
        balance: 1450 // This would normally come from an API/Context
    };

    const handleLogout = () => {
        Cookies.remove("token");
        Cookies.remove("role");
        Cookies.remove("user");
        navigate("/student/login", { replace: true });
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
                        <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-br from-violet-500 to-fuchsia-600 text-base font-black text-white shadow-lg">
                            S
                        </div>
                        <div>
                            <h1 className="text-lg font-bold text-slate-900">Studix</h1>
                            <p className="text-xs text-slate-500">Student panel</p>
                        </div>
                    </div>

                    <button
                        onClick={() => setSidebarOpen(false)}
                        className="rounded-xl p-2 text-slate-500 hover:bg-slate-100 lg:hidden"
                    >
                        <X className="h-5 w-5" />
                    </button>
                </div>

                <div className="mt-8 mb-4 mx-2 relative overflow-hidden rounded-2xl bg-gradient-to-br from-amber-400 to-orange-500 p-4 text-white shadow-lg shadow-amber-500/20">
                    <div className="relative z-10 flex flex-col items-center justify-center">
                        <Coins className="h-8 w-8 mb-2 text-yellow-100 drop-shadow-sm" />
                        <p className="text-xs font-semibold text-amber-100 tracking-wider uppercase mb-0.5">Mening tangalarim</p>
                        <h2 className="text-3xl font-black drop-shadow-md">{studentInfo.balance}</h2>
                    </div>
                    <div className="absolute -right-4 -top-4 opacity-20">
                        <Gift className="h-24 w-24" />
                    </div>
                </div>

                <nav className="mt-4 space-y-2 overflow-y-auto">
                    {sidebarItems.map((item) => {
                        const Icon = item.icon;

                        return (
                            <NavLink
                                key={item.label}
                                to={item.path}
                                className={({ isActive }) =>
                                    `flex w-full items-center gap-3 rounded-2xl px-4 py-3 text-sm font-medium transition ${
                                        isActive
                                            ? "bg-violet-50 text-violet-700"
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
                                
                                <div className="hidden sm:block">
                                    <h2 className="text-lg font-bold text-slate-800">Salom, {studentInfo.name.split(' ')[0]} 👋</h2>
                                </div>
                            </div>

                            <div className="flex items-center gap-2">
                                <div className="flex items-center gap-2 px-3 py-1.5 bg-amber-50 border border-amber-200 rounded-xl mr-2">
                                    <Coins className="w-4 h-4 text-amber-500" />
                                    <span className="font-bold text-amber-600">{studentInfo.balance}</span>
                                </div>

                                <button className="relative flex h-11 w-11 items-center justify-center rounded-2xl border border-slate-200 bg-white text-slate-600 shadow-sm hover:bg-slate-50">
                                    <Bell className="h-4 w-4" />
                                    <span className="absolute right-3 top-3 h-2 w-2 rounded-full bg-violet-600" />
                                </button>

                                <button className="flex h-11 w-11 items-center justify-center rounded-2xl border border-slate-200 bg-[#25324a] text-white shadow-sm hover:opacity-90">
                                    <Moon className="h-4 w-4" />
                                </button>

                                <button className="flex h-11 items-center gap-2 rounded-2xl border border-slate-200 bg-white px-3 shadow-sm hover:bg-slate-50">
                                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-500 text-xs font-bold text-white">
                                        {studentInfo.name.charAt(0)}
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
