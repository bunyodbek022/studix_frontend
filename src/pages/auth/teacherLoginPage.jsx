import AuthLoginTemplate from "../../components/auth/AuthLoginTemplate";

export default function TeacherLoginPage() {
    return (
        <AuthLoginTemplate
            badgeText="Teacher panel"
            title="Xush kelibsiz!"
            description="Guruhlar, darslar va talabalarni boshqarish uchun tizimga kiring"
            apiUrl="/auth/teacher/login"
            imageAlt="Teacher"
            rightTitle="Samarali o'qitish"
            rightDescription="Guruhlar va darslarni oson boshqaring"
            accentColor="blue"
            rightBgClasses="bg-gradient-to-br from-[#1e3a5f] via-[#1e40af] to-[#2563eb]"
        />
    );
}