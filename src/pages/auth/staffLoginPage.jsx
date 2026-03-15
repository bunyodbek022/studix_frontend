import AuthLoginTemplate from "../../components/auth/AuthLoginTemplate"
import staffSvg from "../../assets/staff.svg"

export default function StaffLoginPage() {
  return (
    <AuthLoginTemplate
      badgeText="Staff panel"
      title="Xush kelibsiz!"
      description="Platforma boshqaruvi, tahlillar va nazorat uchun tizimga kiring"
      apiUrl="/staff/login"
      role="staff"
      redirectPath="/staff/dashboard"
      imageSrc={staffSvg}
      imageAlt="Staff"
      rightTitle="To‘liq nazorat"
      rightDescription="Platforma boshqaruvi va tahlillar bir joyda"
      leftGradient="bg-gradient-to-br from-emerald-400 to-green-600"
      badgeClasses="bg-emerald-50 text-emerald-700"
      inputFocusClasses="focus-within:border-emerald-400 focus-within:ring-2 focus-within:ring-emerald-50"
      buttonClasses="bg-gradient-to-r from-emerald-400 to-green-600 hover:from-emerald-500 hover:to-green-700 shadow-emerald-100"
      rightBgClasses="bg-gradient-to-br from-[#064e3b] via-[#065f46] to-[#047857]"
    />
  )
}