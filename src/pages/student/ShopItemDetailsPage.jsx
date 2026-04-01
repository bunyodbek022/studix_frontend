import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Coins } from "lucide-react";
import { shopService } from "../../api/shop.service";
import { toast } from "../../components/ui/Toast";

export default function ShopItemDetailsPage() {
    const { id } = useParams();
    const navigate = useNavigate();
    
    // Fake student balance for demo purposes
    const studentBalance = 900; 

    const [item, setItem] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchItem = async () => {
            try {
                const res = await shopService.getProductById(id);
                setItem(res?.data?.data || res?.data);
            } catch (error) {
                console.error("Mahsulotni yuklashda xatolik", error);
                // BACKEND YO'QLIGI UCHUN LOCALSTORAGEDAN QIDIRIB KO'RAMIZ
                const localSaved = JSON.parse(localStorage.getItem("_mockShopItems")) || [];
                const found = localSaved.find(i => i._id === id || String(i.id) === id);
                if (found) setItem(found);
            } finally {
                setLoading(false);
            }
        };
        fetchItem();
    }, [id]);

    const handleBuy = async () => {
        try {
            await shopService.buyProduct(id);
            toast.success("Muvaffaqiyatli xarid qilindi!");
        } catch (error) {
            toast.error("Xaridda xatolik yuz berdi");
        }
    }

    if (loading) {
        return <div className="p-20 text-center text-slate-500">Mahsulot ma'lumotlari serverdan ko'chirilmoqda...</div>;
    }

    if (!item) {
        return (
            <div className="p-10 text-center text-slate-500">
                Mahsulot topilmadi yoki hali bazaga kiritilmagan.
                <button onClick={() => navigate(-1)} className="mt-4 block text-violet-600 mx-auto">Ortga qaytish</button>
            </div>
        );
    }

    const canAfford = studentBalance >= item.price;

    return (
        <div className="max-w-[1200px] mx-auto pb-10">
            {/* Osonroq qaytish tugmasi */}
            <button 
                onClick={() => navigate(-1)}
                className="flex items-center gap-2 text-slate-500 hover:text-slate-800 transition-colors mb-6"
            >
                <ArrowLeft className="w-5 h-5" />
                <span className="text-sm font-medium">Ortga</span>
            </button>

            <div className="bg-white p-2">
                {/* Image Section - mimicking the provided screenshot EXACTLY */}
                <div className="w-full h-[350px] sm:h-[450px] md:h-[550px] bg-[#f0f2f5] mb-8 flex items-center justify-center overflow-hidden relative">
                    <img 
                        src={item.image || "https://placehold.co/400x400/f0f2f5/64748b?text=Rasm+yoq"} 
                        alt={item.title} 
                        className="w-auto h-full max-h-[80%] object-contain mix-blend-multiply drop-shadow-sm" 
                    />
                </div>

                {/* Details Section */}
                <div className="max-w-4xl">
                    <h1 className="text-2xl font-bold text-[#334155] mb-4">
                        {item.title}
                    </h1>
                    
                    <p className="text-[15px] text-slate-600 mb-6 leading-relaxed">
                        {item.description}
                    </p>

                    <div className="flex items-center gap-2 mb-6">
                        <span className="text-lg font-bold text-[#334155]">Qiymati: {item.price}</span>
                        <div className="flex items-center justify-center bg-yellow-100 rounded-full p-1 text-yellow-500 h-[22px] w-[22px] border border-yellow-200">
                            <Coins className="h-3 w-3" />
                        </div>
                    </div>

                    <div className="flex flex-col gap-3 items-start">
                        {!canAfford && (
                            <div className="bg-[#6b7280] text-white text-[14px] font-medium px-5 py-2.5 rounded-lg shadow-sm">
                                Kumushingiz yetarli emas
                            </div>
                        )}
                        
                        <button 
                            disabled={!canAfford}
                            onClick={handleBuy}
                            className={`px-6 py-2.5 rounded-lg font-medium shadow-sm transition-all focus:outline-none focus:ring-4 ${
                                canAfford 
                                    ? "bg-[#d5b290] text-white hover:bg-[#cfa16a] focus:ring-[#d5b290]/30 cursor-pointer" 
                                    : "bg-[#d5b290] opacity-80 text-white cursor-not-allowed"
                            }`}
                        >
                            Sotib olish
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
