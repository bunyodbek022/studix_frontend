import { useEffect, useState } from "react";
import { Plus, Search, Filter, CreditCard, Banknote, Download, ArrowUpRight, TrendingUp } from "lucide-react";
import { paymentService } from "../../api/payment.service";

const PAYMENT_METHODS = {
    NAQD: { bg: "bg-emerald-100", text: "text-emerald-700", label: "Naqd pul" },
    PAYME: { bg: "bg-cyan-100", text: "text-cyan-700", label: "Payme" },
    CLICK: { bg: "bg-blue-100", text: "text-blue-700", label: "Click" }
};

export default function PaymentsPage() {
    const [activeTab, setActiveTab] = useState("HISTORY"); // HISTORY, DEBTORS
    const [search, setSearch] = useState("");
    const [payments, setPayments] = useState([]);
    const [debtors, setDebtors] = useState([]);
    const [loading, setLoading] = useState(true);

    const loadData = async () => {
        setLoading(true);
        try {
            if (activeTab === "HISTORY") {
                const res = await paymentService.getPayments();
                setPayments(res?.data || []);
            } else {
                const res = await paymentService.getDebtors();
                setDebtors(res?.data || []);
            }
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadData();
    }, [activeTab]);

    return (
        <div className="space-y-6">
            {/* Header / Title */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Moliya va To'lovlar</h1>
                    <p className="mt-1 text-sm text-slate-500">Kirim qilingan mablag'lar va qarzdorlar nazorati</p>
                </div>
                <div className="flex items-center gap-3">
                    <button className="inline-flex items-center justify-center gap-2 rounded-xl bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 shadow-sm border border-slate-200 transition-all hover:bg-slate-50 hover:border-slate-300">
                        <Download className="h-4 w-4" />
                        Hisobot (Excel)
                    </button>
                    <button className="inline-flex items-center justify-center gap-2 rounded-xl bg-violet-600 px-5 py-2.5 text-sm font-semibold text-white shadow-md transition-all hover:bg-violet-700 hover:shadow-lg active:scale-95">
                        <Plus className="h-4 w-4" />
                        To'lov qabul qilish
                    </button>
                </div>
            </div>

            {/* Quick Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                <div className="relative overflow-hidden rounded-3xl bg-white border border-slate-100 p-6 shadow-sm hover:shadow-md transition-shadow">
                    <div className="flexjustify-between items-start">
                        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-600 mb-4">
                            <TrendingUp className="h-6 w-6" />
                        </div>
                        <div>
                            <p className="text-sm font-medium text-slate-500">Joriy oydagi tushum</p>
                            <h3 className="text-2xl font-bold text-slate-900 mt-1">12,450,000 so'm</h3>
                            <div className="mt-2 flex items-center text-xs text-emerald-600 font-medium">
                                <ArrowUpRight className="h-3 w-3 mr-1" />
                                +15.3% o'tgan oyga nisbatan
                            </div>
                        </div>
                    </div>
                    <div className="absolute -right-6 -bottom-6 opacity-5 pointer-events-none">
                        <Banknote className="h-32 w-32 text-emerald-500" />
                    </div>
                </div>

                <div className="relative overflow-hidden rounded-3xl bg-white border border-slate-100 p-6 shadow-sm hover:shadow-md transition-shadow">
                    <div className="flexjustify-between items-start">
                        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-violet-50 text-violet-600 mb-4">
                            <CreditCard className="h-6 w-6" />
                        </div>
                        <div>
                            <p className="text-sm font-medium text-slate-500">Onlayn to'lovlar (Click/Payme)</p>
                            <h3 className="text-2xl font-bold text-slate-900 mt-1">4,200,000 so'm</h3>
                        </div>
                    </div>
                </div>

                <div className="relative overflow-hidden rounded-3xl bg-white border border-rose-100 p-6 shadow-sm hover:shadow-md transition-shadow">
                    <div className="flexjustify-between items-start">
                        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-rose-50 text-rose-600 mb-4">
                            <Banknote className="h-6 w-6" />
                        </div>
                        <div>
                            <p className="text-sm font-medium text-slate-500">Umumiy kutilayotgan qarzlar</p>
                            <h3 className="text-2xl font-bold text-rose-600 mt-1">3,150,000 so'm</h3>
                        </div>
                    </div>
                </div>
            </div>

            {/* List Header controls */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 rounded-2xl bg-white p-2 border border-slate-100 shadow-sm">
                <div className="flex items-center gap-1 w-full sm:w-auto p-1 bg-slate-100/70 rounded-xl">
                    <button
                        onClick={() => setActiveTab("HISTORY")}
                        className={`px-5 py-2 text-sm font-semibold rounded-lg transition-all ${activeTab === "HISTORY" ? "bg-white text-slate-900 shadow-sm" : "text-slate-500 hover:text-slate-700"}`}
                    >
                        To'lovlar tarixi
                    </button>
                    <button
                        onClick={() => setActiveTab("DEBTORS")}
                        className={`px-5 py-2 text-sm font-semibold rounded-lg transition-all ${activeTab === "DEBTORS" ? "bg-white text-rose-600 shadow-sm" : "text-slate-500 hover:text-slate-700"}`}
                    >
                        Qarzdorlar
                    </button>
                </div>
                
                <div className="flex w-full sm:w-auto gap-3 items-center pr-2">
                    <div className="relative w-full sm:w-64">
                        <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                        <input
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            placeholder="O'quvchi ismi bo'yicha qidiruv"
                            className="h-10 w-full rounded-xl border border-slate-200 bg-slate-50 pl-10 pr-4 text-sm outline-none transition-all focus:border-violet-400 focus:bg-white focus:ring-4 focus:ring-violet-50"
                        />
                    </div>
                    <button className="h-10 w-10 flex items-center justify-center rounded-xl border border-slate-200 text-slate-500 hover:bg-slate-50 transition-colors">
                        <Filter className="h-4 w-4" />
                    </button>
                </div>
            </div>

            {/* Content Table */}
            <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
                {activeTab === "HISTORY" ? (
                    <div className="min-w-full">
                        <div className="grid grid-cols-[80px_2fr_2fr_1.5fr_1.5fr_1fr] gap-4 border-b border-slate-200 bg-slate-50/50 px-6 py-4 text-xs font-semibold uppercase tracking-wider text-slate-500">
                            <span>ID</span>
                            <span>O'quvchi</span>
                            <span>Guruh / Kurs</span>
                            <span>To'lov usuli</span>
                            <span>Sana / Vaqt</span>
                            <span className="text-right">Summa</span>
                        </div>
                        {loading ? (
                            <div className="p-10 text-center text-slate-500">Yuklanmoqda...</div>
                        ) : payments.length === 0 ? (
                            <div className="p-10 text-center text-slate-500">To'lovlar topilmadi.</div>
                        ) : (
                            payments.map((p) => (
                                <div key={p.id} className="grid grid-cols-[80px_2fr_2fr_1.5fr_1.5fr_1fr] items-center gap-4 border-b border-slate-100 px-6 py-4 text-sm hover:bg-slate-50/50 transition-colors last:border-0">
                                    <span className="font-mono text-xs text-slate-400">#{p.id}</span>
                                    <span className="font-semibold text-slate-800">{p.studentName}</span>
                                    <span className="text-slate-600">{p.groupName}</span>
                                    <div>
                                        <span className={`inline-flex items-center px-2.5 py-1 rounded-md text-xs font-bold ${PAYMENT_METHODS[p.method]?.bg} ${PAYMENT_METHODS[p.method]?.text}`}>
                                            {PAYMENT_METHODS[p.method]?.label || p.method}
                                        </span>
                                    </div>
                                    <span className="text-slate-500">
                                        {new Date(p.date).toLocaleString('uz-UZ', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute:'2-digit' })}
                                    </span>
                                    <span className="text-right font-bold text-slate-900">
                                        {p.amount.toLocaleString()} so'm
                                    </span>
                                </div>
                            ))
                        )}
                    </div>
                ) : (
                    <div className="min-w-full">
                        <div className="grid grid-cols-[80px_2fr_2fr_1.5fr_1fr] gap-4 border-b border-slate-200 bg-rose-50/30 px-6 py-4 text-xs font-semibold uppercase tracking-wider text-slate-500">
                            <span>ID</span>
                            <span>O'quvchi</span>
                            <span>Telefon</span>
                            <span>So'ngi muddat</span>
                            <span className="text-right">Qarz miqdori</span>
                        </div>
                        {loading ? (
                            <div className="p-10 text-center text-slate-500">Yuklanmoqda...</div>
                        ) : debtors.length === 0 ? (
                            <div className="p-10 text-center text-slate-500">Qarzdorlar topilmadi. Yaxshi natija!</div>
                        ) : (
                            debtors.map((d) => (
                                <div key={d.id} className="grid grid-cols-[80px_2fr_2fr_1.5fr_1fr] items-center gap-4 border-b border-rose-50 px-6 py-4 text-sm hover:bg-rose-50/20 transition-colors last:border-0">
                                    <span className="font-mono text-xs text-slate-400">#{d.id}</span>
                                    <span className="font-semibold text-slate-800">{d.studentName}</span>
                                    <span className="text-slate-600 font-medium">{d.phone}</span>
                                    <span className="text-rose-500 font-medium">
                                        {d.dueDate} gacha
                                    </span>
                                    <span className="text-right font-bold text-rose-600">
                                        {d.debtAmount.toLocaleString()} so'm
                                    </span>
                                </div>
                            ))
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}
