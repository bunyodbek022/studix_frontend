import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, BookOpen, Clock, Calendar, Wallet } from "lucide-react";
import { courseService } from "../../api/course.service";

const LEVEL_LABELS = {
    BEGINNER: { label: "Boshlang'ich", color: "bg-emerald-50 text-emerald-700" },
    INTERMEDIATE: { label: "O'rta", color: "bg-amber-50 text-amber-700" },
    ADVANCED: { label: "Yuqori", color: "bg-rose-50 text-rose-700" },
};

function formatPrice(price) {
    if (!price) return "-";
    return Number(price).toLocaleString("uz-UZ") + " so'm";
}

export default function CourseDetailsPage() {
    const { id } = useParams();
    const navigate = useNavigate();
    
    const [course, setCourse] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchCourse = async () => {
            try {
                setLoading(true);
                const data = await courseService.getCourseById(id);
                // API response either wraps in { data: ... } or returns object directly depending on axios setup
                // In your service it does: const { data } = await api.get(); return data;
                setCourse(data?.data || data);
            } catch (err) {
                setError(err?.response?.data?.message || "Kurs ma'lumotlarini yuklashda xatolik yuz berdi");
            } finally {
                setLoading(false);
            }
        };

        if (id) {
            fetchCourse();
        }
    }, [id]);

    return (
        <div className="space-y-6 lg:max-w-4xl">
            <div className="flex items-center gap-4">
                <button
                    onClick={() => navigate(-1)}
                    className="flex h-10 w-10 items-center justify-center rounded-xl bg-white text-slate-500 shadow-sm transition hover:bg-slate-50 hover:text-slate-700"
                >
                    <ArrowLeft className="h-5 w-5" />
                </button>
                <div>
                    <h1 className="text-2xl font-bold text-slate-900">Kurs ma'lumotlari</h1>
                    <p className="mt-1 text-sm text-slate-500">Kursing batafsil sahifasi</p>
                </div>
            </div>

            {loading ? (
                <div className="rounded-3xl border border-slate-200 bg-white p-10 text-center shadow-sm">
                    Yuklanmoqda...
                </div>
            ) : error ? (
                <div className="rounded-2xl border border-rose-200 bg-rose-50 px-4 py-8 text-center text-sm text-rose-700">
                    {error}
                </div>
            ) : !course ? (
                <div className="rounded-3xl border border-slate-200 bg-white p-10 text-center shadow-sm">
                    Kurs topilmadi
                </div>
            ) : (
                <div className="space-y-6">
                    {/* Asosiy ma'lumotlar kartochkasi */}
                    <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm overflow-hidden relative">
                        {/* Background design */}
                        <div className="absolute top-0 right-0 p-8 opacity-5">
                            <BookOpen className="w-48 h-48" />
                        </div>
                        
                        <div className="relative z-10">
                            <div className="flex justify-between items-start mb-6">
                                <div>
                                    <h2 className="text-2xl font-bold text-slate-900">{course.name}</h2>
                                    {course.description && (
                                        <p className="mt-2 text-slate-500 max-w-2xl">{course.description}</p>
                                    )}
                                </div>
                                {course.level && (
                                    <span className={`px-4 py-1.5 rounded-full text-sm font-semibold ${LEVEL_LABELS[course.level]?.color || "bg-slate-100 text-slate-700"}`}>
                                        {LEVEL_LABELS[course.level]?.label || course.level}
                                    </span>
                                )}
                            </div>

                            <hr className="border-slate-100 my-6" />

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                <div className="flex items-center gap-4 bg-slate-50/50 p-4 rounded-2xl border border-slate-100">
                                    <div className="p-3 bg-violet-100 text-violet-600 rounded-xl">
                                        <Calendar className="w-5 h-5" />
                                    </div>
                                    <div>
                                        <p className="text-sm text-slate-500">Davomiyligi (oy)</p>
                                        <p className="font-semibold text-slate-800">{course.durationMonth || "-"} oy</p>
                                    </div>
                                </div>
                                
                                <div className="flex items-center gap-4 bg-slate-50/50 p-4 rounded-2xl border border-slate-100">
                                    <div className="p-3 bg-emerald-100 text-emerald-600 rounded-xl">
                                        <Clock className="w-5 h-5" />
                                    </div>
                                    <div>
                                        <p className="text-sm text-slate-500">Dars vaqti (daq)</p>
                                        <p className="font-semibold text-slate-800">{course.durationLesson || "-"} daqiqa</p>
                                    </div>
                                </div>

                                <div className="flex items-center gap-4 bg-slate-50/50 p-4 rounded-2xl border border-slate-100">
                                    <div className="p-3 bg-amber-100 text-amber-600 rounded-xl">
                                        <Wallet className="w-5 h-5" />
                                    </div>
                                    <div>
                                        <p className="text-sm text-slate-500">Kurs narxi</p>
                                        <p className="font-semibold text-slate-800">{formatPrice(course.price)}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    
                    {/* Bu yerda kelgusida kursga tegishli guruhlar ro'yxatini chiqarishingiz mumkin */}
                </div>
            )}
        </div>
    );
    
}
