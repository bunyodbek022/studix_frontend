import AuthLoginTemplate from "../../components/auth/AuthLoginTemplate";

export default function StudentLoginPage() {
    return (
        <AuthLoginTemplate
            badgeText="Student panel"
            title="Xush kelibsiz!"
            description="Darslar, vazifalar va davomatni kuzatish uchun tizimga kiring"
            apiUrl="/auth/student/login"
            imageAlt="Student"
            rightTitle="O'qish qulay"
            rightDescription="Barcha darslar va vazifalar bir joyda"
            accentColor="violet"
            rightBgClasses="bg-gradient-to-br from-[#2e1065] via-[#4c1d95] to-[#6d28d9]"
        />
    );
}