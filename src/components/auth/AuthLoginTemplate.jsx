import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../../api/axios";
import Cookies from "js-cookie";

const getDashboardByRole = (role) => {
    switch (role) {
        case "STUDENT": return "/student/dashboard";
        case "TEACHER": return "/teacher/dashboard";
        case "SUPERADMIN":
        case "ADMIN":
        case "MANAGEMENT":
        case "ADMINISTRATOR": return "/staff/dashboard";
        default: return "/student/login";
    }
};

const accents = {
    emerald: {
        badge: "bg-emerald-50 text-emerald-600",
        ring: "focus-within:border-emerald-400 focus-within:ring-2 focus-within:ring-emerald-50",
        button: "bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-600 hover:to-green-700 shadow-emerald-200",
        logo: "bg-gradient-to-br from-emerald-400 to-green-600",
    },
    violet: {
        badge: "bg-violet-50 text-violet-600",
        ring: "focus-within:border-violet-400 focus-within:ring-2 focus-within:ring-violet-50",
        button: "bg-gradient-to-r from-violet-500 to-purple-600 hover:from-violet-600 hover:to-purple-700 shadow-violet-200",
        logo: "bg-gradient-to-br from-violet-400 to-purple-600",
    },
    blue: {
        badge: "bg-blue-50 text-blue-600",
        ring: "focus-within:border-blue-400 focus-within:ring-2 focus-within:ring-blue-50",
        button: "bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 shadow-blue-200",
        logo: "bg-gradient-to-br from-blue-400 to-indigo-600",
    },
};

export default function AuthLoginTemplate({
    badgeText,
    title,
    description,
    apiUrl,
    imageSrc,
    imageAlt,
    rightTitle,
    rightDescription,
    accentColor = "emerald",
    rightBgClasses,
}) {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({ email: "", password: "" });
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const accent = accents[accentColor];

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleLogin = async (e) => {
        e.preventDefault();
        setError("");
        setLoading(true);
        try {
            const { data } = await api.post(apiUrl, formData);
            Cookies.set("role", data.role, { expires: 7, sameSite: "Lax" });
            if (data.user) {
                Cookies.set("user", JSON.stringify(data.user), { expires: 7, sameSite: "Lax" });
            }
            navigate(getDashboardByRole(data.role), { replace: true });
        } catch (err) {
            setError(err.response?.data?.message || "Login xatolik. Qayta urinib ko'ring.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen grid grid-cols-1 md:grid-cols-2 bg-white">
            {/* LEFT */}
            <div className="flex flex-col justify-between px-8 sm:px-12 md:px-16 py-10 bg-white">
                {/* Logo */}
                <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-2xl ${accent.logo} flex items-center justify-center text-white font-black text-lg shadow-md`}>
                        S
                    </div>
                    <span className="font-bold text-2xl text-slate-800">Studix</span>
                </div>

                {/* Form */}
                <div className="max-w-sm w-full mx-auto">
                    <span className={`inline-flex items-center gap-2 text-xs font-semibold px-3 py-1.5 rounded-full mb-5 ${accent.badge}`}>
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M12 3L1 9l11 6 9-4.91V17h2V9L12 3zM5 13.18v4L12 21l7-3.82v-4L12 17l-7-3.82z" />
                        </svg>
                        {badgeText}
                    </span>

                    <h1 className="text-3xl font-bold text-slate-800 mb-2">{title}</h1>
                    <p className="text-slate-400 text-sm mb-8">{description}</p>

                    <form onSubmit={handleLogin} className="space-y-4">
                        {/* Email */}
                        <div>
                            <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
                                Telefon raqam yoki Email
                            </label>
                            <div className={`flex items-center gap-3 px-4 py-3 rounded-xl border border-slate-200 bg-white transition ${accent.ring}`}>
                                <svg className="text-slate-300 shrink-0" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <rect width="20" height="16" x="2" y="4" rx="2" />
                                    <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
                                </svg>
                                <input
                                    type="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    placeholder="Enter your email or number"
                                    required
                                    className="flex-1 outline-none text-sm text-slate-700 placeholder-slate-300 bg-transparent"
                                />
                            </div>
                        </div>

                        {/* Password */}
                        <div>
                            <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
                                Password
                            </label>
                            <div className={`flex items-center gap-3 px-4 py-3 rounded-xl border border-slate-200 bg-white transition ${accent.ring}`}>
                                <svg className="text-slate-300 shrink-0" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <rect width="18" height="11" x="3" y="11" rx="2" ry="2" />
                                    <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                                </svg>
                                <input
                                    type={showPassword ? "text" : "password"}
                                    name="password"
                                    value={formData.password}
                                    onChange={handleChange}
                                    placeholder="Create a password"
                                    required
                                    className="flex-1 outline-none text-sm text-slate-700 placeholder-slate-300 bg-transparent"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword((p) => !p)}
                                    className="text-slate-300 hover:text-slate-500 transition"
                                >
                                    {showPassword ? (
                                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                            <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z" />
                                            <circle cx="12" cy="12" r="3" />
                                        </svg>
                                    ) : (
                                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                            <path d="M9.88 9.88a3 3 0 1 0 4.24 4.24" />
                                            <path d="M10.73 5.08A10.43 10.43 0 0 1 12 5c7 0 10 7 10 7a13.16 13.16 0 0 1-1.67 2.68" />
                                            <path d="M6.61 6.61A13.526 13.526 0 0 0 2 12s3 7 10 7a9.74 9.74 0 0 0 5.39-1.61" />
                                            <line x1="2" x2="22" y1="2" y2="22" />
                                        </svg>
                                    )}
                                </button>
                            </div>
                            <p className="mt-1.5 text-xs text-slate-400">Must be at least 8 characters.</p>
                        </div>

                        {/* Error */}
                        {error && (
                            <div className="rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-600">
                                {error}
                            </div>
                        )}

                        {/* Submit */}
                        <button
                            type="submit"
                            disabled={loading}
                            className={`w-full py-3.5 rounded-xl font-semibold text-white transition-all disabled:opacity-50 text-sm flex items-center justify-center gap-2 shadow-lg ${accent.button}`}
                        >
                            {loading ? (
                                <>
                                    <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                                    </svg>
                                    Yuklanmoqda...
                                </>
                            ) : "Kirish"}
                        </button>
                    </form>
                </div>

                {/* Footer */}
                <p className="text-xs text-slate-300">© 2026 Studix</p>
            </div>

            {/* RIGHT */}
            <div className={`hidden md:flex flex-col items-center justify-center p-12 relative overflow-hidden ${rightBgClasses}`}>
                <div
                    className="absolute inset-0 opacity-10"
                    style={{
                        backgroundImage: "radial-gradient(circle, white 1px, transparent 1px)",
                        backgroundSize: "32px 32px",
                    }}
                />

                {imageSrc && (
                    <img
                        src={imageSrc}
                        alt={imageAlt}
                        className="relative z-10 w-full max-w-sm drop-shadow-2xl mb-8"
                    />
                )}

                <div className="relative z-10 w-full max-w-sm bg-white/10 backdrop-blur-sm rounded-2xl p-5 border border-white/20">
                    <div className="flex items-center justify-between mb-2">
                        <span className="text-white font-semibold text-sm">{rightTitle}</span>
                        <div className="flex gap-1">
                            <div className="w-2 h-2 rounded-full bg-white/40" />
                            <div className="w-2 h-2 rounded-full bg-white/40" />
                            <div className="w-2 h-2 rounded-full bg-white/40" />
                        </div>
                    </div>
                    <p className="text-white/60 text-xs">{rightDescription}</p>
                </div>
            </div>
        </div>
    );
}