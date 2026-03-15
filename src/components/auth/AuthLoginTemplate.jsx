import { useState } from "react"
import { useNavigate, Link } from "react-router-dom"
import { Alert, CircularProgress } from "@mui/material"
import { api } from "../../api/axios"
import Cookies from "js-cookie"

const EyeIcon = ({ open }) =>
  open ? (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  ) : (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M9.88 9.88a3 3 0 1 0 4.24 4.24" />
      <path d="M10.73 5.08A10.43 10.43 0 0 1 12 5c7 0 10 7 10 7a13.16 13.16 0 0 1-1.67 2.68" />
      <path d="M6.61 6.61A13.526 13.526 0 0 0 2 12s3 7 10 7a9.74 9.74 0 0 0 5.39-1.61" />
      <line x1="2" x2="22" y1="2" y2="22" />
    </svg>
  )

const MailIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <rect width="20" height="16" x="2" y="4" rx="2" />
    <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
  </svg>
)

const LockIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <rect width="18" height="11" x="3" y="11" rx="2" ry="2" />
    <path d="M7 11V7a5 5 0 0 1 10 0v4" />
  </svg>
)

const getDashboardByRole = (role) => {
  switch (role) {
    case "STUDENT":
      return "/student/dashboard"
    case "TEACHER":
      return "/teacher/dashboard"
    case "SUPERADMIN":
    case "ADMIN":
    case "MANAGEMENT":
    case "ADMINISTRATOR":
      return "/staff/dashboard"
    default:
      return "/student/login"
  }
}

export default function AuthLoginTemplate({
  badgeText,
  title,
  description,
  apiUrl,
  imageSrc,
  imageAlt,
  rightTitle,
  rightDescription,
  leftGradient,
  badgeClasses,
  inputFocusClasses,
  buttonClasses,
  rightBgClasses,
}) {
  const navigate = useNavigate()

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  })

  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleLogin = async (e) => {
    e.preventDefault()
    setError("")
    setLoading(true)

    try {
      const { data } = await api.post(apiUrl, formData)

      Cookies.set("token", data.token, {
        expires: 7,
        secure: false,
        sameSite: "Lax",
      })

      Cookies.set("role", data.role, {
        expires: 7,
        secure: false,
        sameSite: "Lax",
      })

      if (data.user) {
        Cookies.set("user", JSON.stringify(data.user), {
          expires: 7,
          secure: false,
          sameSite: "Lax",
        })
      }

      navigate(getDashboardByRole(data.role), { replace: true })
    } catch (err) {
      setError(err.response?.data?.message || "Login xatolik. Qayta urinib ko‘ring.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen grid grid-cols-1 md:grid-cols-2 bg-slate-50">
      {/* LEFT */}
      <div className="flex flex-col justify-center px-6 sm:px-10 md:px-16 py-10 bg-white">
        <div className="flex items-center gap-3 mb-12">
          <div
            className={`w-10 h-10 rounded-2xl ${leftGradient} flex items-center justify-center text-white font-black text-lg shadow-md`}
          >
            S
          </div>
          <span className="font-bold text-2xl text-slate-800">Studix</span>
        </div>

        <div className="max-w-md w-full">
          <span
            className={`inline-flex items-center gap-2 text-xs font-semibold px-3 py-1.5 rounded-full mb-4 ${badgeClasses}`}
          >
            <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 3L1 9l11 6 9-4.91V17h2V9L12 3zM5 13.18v4L12 21l7-3.82v-4L12 17l-7-3.82z" />
            </svg>
            {badgeText}
          </span>

          <h1 className="text-3xl font-bold text-slate-800 mb-2">{title}</h1>
          <p className="text-slate-500 text-sm mb-8">{description}</p>

          <form onSubmit={handleLogin} className="space-y-5">
            <div>
              <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                Email
              </label>
              <div
                className={`mt-2 flex items-center gap-3 px-4 py-3 rounded-xl border border-slate-200 transition bg-white ${inputFocusClasses}`}
              >
                <span className="text-slate-400">
                  <MailIcon />
                </span>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="email@example.com"
                  required
                  className="flex-1 outline-none text-sm text-slate-700 placeholder-slate-300 bg-transparent"
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                Parol
              </label>
              <div
                className={`mt-2 flex items-center gap-3 px-4 py-3 rounded-xl border border-slate-200 transition bg-white ${inputFocusClasses}`}
              >
                <span className="text-slate-400">
                  <LockIcon />
                </span>
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="••••••••"
                  required
                  className="flex-1 outline-none text-sm text-slate-700 placeholder-slate-300 bg-transparent"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((prev) => !prev)}
                  className="text-slate-400 hover:text-slate-600 transition"
                >
                  <EyeIcon open={showPassword} />
                </button>
              </div>
            </div>

            <div className="flex justify-end">
              <Link
                to="#"
                className="text-xs font-medium transition text-slate-500 hover:text-slate-700"
              >
                Parolni unutdingizmi?
              </Link>
            </div>

            {error && <Alert severity="error">{error}</Alert>}

            <button
              type="submit"
              disabled={loading}
              className={`w-full py-3.5 rounded-xl font-semibold text-white transition-all disabled:opacity-50 text-sm flex items-center justify-center gap-2 shadow-lg ${buttonClasses}`}
            >
              {loading && <CircularProgress size={18} sx={{ color: "white" }} />}
              {loading ? "Yuklanmoqda..." : "Kirish"}
            </button>
          </form>
        </div>

        <p className="text-xs text-slate-300 mt-auto pt-12">© 2026 Studix</p>
      </div>

      {/* RIGHT */}
      <div
        className={`hidden md:flex flex-col items-center justify-center p-12 relative overflow-hidden ${rightBgClasses}`}
      >
        <div
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage: "radial-gradient(circle, white 1px, transparent 1px)",
            backgroundSize: "32px 32px",
          }}
        />
        <img
          src={imageSrc}
          alt={imageAlt}
          className="relative z-10 w-full max-w-md drop-shadow-2xl"
        />
        <div className="relative z-10 mt-6 text-center text-white">
          <h3 className="text-2xl font-bold mb-2">{rightTitle}</h3>
          <p className="text-sm opacity-70">{rightDescription}</p>
        </div>
      </div>
    </div>
  )
}