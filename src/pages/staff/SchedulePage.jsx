import { useEffect, useState } from "react";
import { Plus, Search, CalendarDays, Clock, MapPin, UserSquare2, ChevronRight, ChevronLeft, Filter } from "lucide-react";
import { scheduleService } from "../../api/schedule.service";

const WEEK_DAYS = [
    { id: "Dushanba", label: "Dushanba" },
    { id: "Seshanba", label: "Seshanba" },
    { id: "Chorshanba", label: "Chorshanba" },
    { id: "Payshanba", label: "Payshanba" },
    { id: "Juma", label: "Juma" },
    { id: "Shanba", label: "Shanba" }
];

export default function SchedulePage() {
    const [schedule, setSchedule] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedDay, setSelectedDay] = useState("Dushanba");
    const [search, setSearch] = useState("");

    const fetchSchedule = async () => {
        setLoading(true);
        try {
            const res = await scheduleService.getWeeklySchedule();
            setSchedule(res?.data || []);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchSchedule();
    }, []);

    const filteredSchedule = schedule.filter(s => 
        s.day === selectedDay &&
        (s.groupName.toLowerCase().includes(search.toLowerCase()) || 
        s.teacher.toLowerCase().includes(search.toLowerCase()))
    ).sort((a, b) => a.startTime.localeCompare(b.startTime));

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Dars jadvali</h1>
                    <p className="mt-1 text-sm text-slate-500">Xonalar bandligi va haftalik o'quv jarayoni (Timetable)</p>
                </div>
                <div className="flex items-center gap-3">
                    <div className="relative w-full sm:w-64">
                        <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                        <input
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            placeholder="Guruh yoki ustoz izlash..."
                            className="h-11 w-full rounded-xl border border-slate-200 bg-white pl-10 pr-4 text-sm outline-none transition-all focus:border-violet-400 focus:ring-4 focus:ring-violet-50 shadow-sm"
                        />
                    </div>
                    <button className="h-11 w-11 flex items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-500 hover:bg-slate-50 transition-colors shadow-sm">
                        <Filter className="h-4 w-4" />
                    </button>
                    <button className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-violet-600 px-5 text-sm font-semibold text-white shadow-md transition-all hover:bg-violet-700 hover:shadow-lg active:scale-95">
                        <Plus className="h-4 w-4" />
                        Dars qo'shish
                    </button>
                </div>
            </div>

            {/* Main Content Area */}
            <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
                
                {/* Days Navigation */}
                <div className="flex items-center justify-between border-b border-slate-100 px-4 py-3 bg-slate-50/50">
                    <button className="h-9 w-9 flex items-center justify-center rounded-full bg-white border border-slate-200 text-slate-500 hover:text-slate-800 shadow-sm">
                        <ChevronLeft className="h-4 w-4" />
                    </button>
                    
                    <div className="flex gap-2 p-1 bg-slate-200/50 rounded-2xl">
                        {WEEK_DAYS.map((day) => (
                            <button
                                key={day.id}
                                onClick={() => setSelectedDay(day.id)}
                                className={`px-5 py-2.5 text-sm font-semibold rounded-xl transition-all ${
                                    selectedDay === day.id
                                        ? "bg-white text-violet-700 shadow-sm"
                                        : "text-slate-500 hover:text-slate-800 hover:bg-slate-100/50"
                                }`}
                            >
                                {day.label}
                            </button>
                        ))}
                    </div>

                    <button className="h-9 w-9 flex items-center justify-center rounded-full bg-white border border-slate-200 text-slate-500 hover:text-slate-800 shadow-sm">
                        <ChevronRight className="h-4 w-4" />
                    </button>
                </div>

                {/* Daily Schedule List */}
                <div className="p-6 bg-slate-50/30 min-h-[400px]">
                    {loading ? (
                        <div className="flex items-center justify-center h-full text-slate-400">
                            Jadval yuklanmoqda...
                        </div>
                    ) : filteredSchedule.length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-20 text-center">
                            <div className="w-16 h-16 mb-4 rounded-full bg-slate-100 flex items-center justify-center text-slate-300">
                                <CalendarDays className="h-8 w-8" />
                            </div>
                            <h3 className="text-lg font-bold text-slate-800">Bo'sh kun</h3>
                            <p className="text-slate-500 mt-1 max-w-sm">
                                {selectedDay} kuniga qo'yilgan darjadvalidagi guruhlar ro'yxati topilmadi yoki hamma xonalar bo'sh.
                            </p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
                            {filteredSchedule.map((item) => (
                                <div key={item.id} className="group relative bg-white rounded-2xl border border-slate-200 p-5 shadow-sm hover:shadow-md hover:border-violet-300 transition-all overflow-hidden">
                                    <div className={`absolute top-0 left-0 w-1.5 h-full ${item.type === 'PRACTICE' ? 'bg-emerald-500' : 'bg-blue-500'}`}></div>
                                    
                                    <div className="flex justify-between items-start mb-4">
                                        <div>
                                            <h4 className="font-bold text-lg text-slate-900">{item.groupName}</h4>
                                            <span className={`inline-block mt-1 px-2 py-0.5 rounded-md text-[10px] font-bold tracking-wider uppercase ${item.type === 'PRACTICE' ? 'text-emerald-700 bg-emerald-50' : 'text-blue-700 bg-blue-50'}`}>
                                                {item.type === 'PRACTICE' ? 'Amaliyot' : 'Nazariya'}
                                            </span>
                                        </div>
                                        <div className="flex items-center gap-1.5 bg-slate-100 text-slate-700 px-3 py-1.5 rounded-lg text-sm font-semibold">
                                            <Clock className="w-4 h-4 text-slate-500" />
                                            {item.startTime} - {item.endTime}
                                        </div>
                                    </div>

                                    <div className="space-y-3 mt-5 border-t border-slate-100 pt-4">
                                        <div className="flex items-center gap-3 text-sm">
                                            <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-500">
                                                <UserSquare2 className="w-4 h-4" />
                                            </div>
                                            <div>
                                                <p className="text-xs text-slate-400 font-medium">O'qituvchi</p>
                                                <p className="font-semibold text-slate-700">{item.teacher}</p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-3 text-sm">
                                            <div className="w-8 h-8 rounded-full bg-amber-50 flex items-center justify-center text-amber-600">
                                                <MapPin className="w-4 h-4" />
                                            </div>
                                            <div>
                                                <p className="text-xs text-slate-400 font-medium">Xona nomi / Lokatsiya</p>
                                                <p className="font-semibold text-slate-700">{item.room}</p>
                                            </div>
                                        </div>
                                    </div>
                                    
                                    <button className="absolute inset-x-0 bottom-0 h-10 bg-slate-50 text-slate-600 font-medium text-sm flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity border-t border-slate-100 hover:bg-violet-50 hover:text-violet-700">
                                        Batafsil ko'rish
                                    </button>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
