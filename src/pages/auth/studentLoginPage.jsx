import AuthLoginTemplate from "../../components/auth/AuthLoginTemplate"
import studentSvg from "../../assets/student.svg"

export default function StudentLoginPage() {
  return (
    <AuthLoginTemplate
      badgeText="Student panel"
      title="Xush kelibsiz!"
      description="Darslar, topshiriqlar va natijalarni ko‘rish uchun tizimga kiring"
      apiUrl="/student/login"
      role="student"
      redirectPath="/student/dashboard"
      imageSrc={studentSvg}
      imageAlt="Student"
      rightTitle="Bilimingizni oshiring"
      rightDescription="Barcha darslar va topshiriqlar bir joyda"
      leftGradient="bg-gradient-to-br from-teal-400 to-cyan-500"
      badgeClasses="bg-teal-50 text-teal-700"
      inputFocusClasses="focus-within:border-teal-400 focus-within:ring-2 focus-within:ring-teal-50"
      buttonClasses="bg-gradient-to-r from-teal-400 to-cyan-500 hover:from-teal-500 hover:to-cyan-600 shadow-teal-100"
      rightBgClasses="bg-gradient-to-br from-[#1a2f6e] via-[#1e3a8a] to-[#1e40af]"
    />
  )
}