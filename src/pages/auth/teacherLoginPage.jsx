import AuthLoginTemplate from "../../components/auth/AuthLoginTemplate"
import teacherSvg from "../../assets/teacher.svg"

export default function TeacherLoginPage() {
  return (
    <AuthLoginTemplate
      badgeText="O‘qituvchi panel"
      title="Xush kelibsiz!"
      description="Kurslar, guruhlar va talabalarni boshqarish uchun tizimga kiring"
      apiUrl="/teacher/login"
      role="teacher"
      redirectPath="/teacher/dashboard"
      imageSrc={teacherSvg}
      imageAlt="Teacher"
      rightTitle="Samarali dars bering"
      rightDescription="Kurslar, topshiriqlar va natijalar bir joyda"
      leftGradient="bg-gradient-to-br from-sky-400 to-blue-600"
      badgeClasses="bg-sky-50 text-sky-700"
      inputFocusClasses="focus-within:border-sky-400 focus-within:ring-2 focus-within:ring-sky-50"
      buttonClasses="bg-gradient-to-r from-sky-400 to-blue-600 hover:from-sky-500 hover:to-blue-700 shadow-sky-100"
      rightBgClasses="bg-gradient-to-br from-[#0c2461] via-[#1e3799] to-[#0652DD]"
    />
  )
}