import { useState, useEffect } from "react";
import { Plus, Search, ShoppingBag, CheckCircle, Timer, X, UploadCloud, Image as ImageIcon } from "lucide-react";
import { shopService } from "../../api/shop.service";
import { toast } from "../../components/ui/Toast";

export default function ShopManagementPage() {
    const [activeTab, setActiveTab] = useState("ITEMS"); 
    const [search, setSearch] = useState("");
    
    const [items, setItems] = useState([]);
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(false);

    // Drawer state
    const [isDrawerOpen, setIsDrawerOpen] = useState(false);
    
    // Form state handling for normal fields + file
    const [formData, setFormData] = useState({
        title: "",
        description: "",
        price: "",
        stock: "",
        category: "Aksessuar",
    });
    const [selectedImage, setSelectedImage] = useState(null); // the File object
    const [previewUrl, setPreviewUrl] = useState(null);       // URL preview for the UI

    // Fetch data
    const fetchItems = async () => {
        try {
            setLoading(true);
            const res = await shopService.getProducts();
            setItems(res?.data?.data || []);
        } catch (error) {
            console.log("Mahsulotlarni olishda xatolik", error);
        } finally {
            setLoading(false);
        }
    };

    const fetchOrders = async () => {
        try {
            setLoading(true);
            const res = await shopService.getOrders();
            setOrders(res?.data?.data || []);
        } catch (error) {
            console.log("Buyurtmalarni olishda xatolik", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (activeTab === "ITEMS") fetchItems();
        else fetchOrders();
    }, [activeTab]);

    // Format changes
    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            // Check if it really is an image
            if (!file.type.startsWith("image/")) {
                toast.error("Iltimos faqat rasm yuklang! (.png, .jpg, .webp)");
                return;
            }
            setSelectedImage(file);
            setPreviewUrl(URL.createObjectURL(file));
        }
    };

    const handleClearImage = () => {
        setSelectedImage(null);
        setPreviewUrl(null);
    }

    // Modalni yopishda reset qilish
    const closeDrawer = () => {
        setIsDrawerOpen(false);
        setFormData({ title: "", description: "", price: "", stock: "", category: "Aksessuar" });
        setSelectedImage(null);
        setPreviewUrl(null);
    }

    // Form submit with FormData encoding
    const handleSubmit = async (e) => {
        e.preventDefault();
        
        try {
            const data = new FormData();
            data.append("title", formData.title);
            data.append("description", formData.description);
            data.append("price", Number(formData.price));
            data.append("stock", Number(formData.stock));
            data.append("category", formData.category);
            
            if (selectedImage) {
                data.append("image", selectedImage); 
            }

            await shopService.createProduct(data);
            toast.success("Mahsulot muvaffaqiyatli saqlandi!");
            closeDrawer();
            fetchItems();
        } catch (error) {
           toast.error(error.response?.data?.message || "Mahsulot yaratishda xatolik! Backend ishlab turganligiga ishonch xosil qiling");
        }
    };

    // Fulfill order
    const handleFulfillOrder = async (orderId) => {
        try {
            await shopService.fulfillOrder(orderId);
            toast.success("Buyurtma topshirildi!");
            fetchOrders();
        } catch (error) {
            toast.error("Xatolik yuz berdi");
        }
    };

    const filteredItems = items.filter(i => i.title.toLowerCase().includes(search.toLowerCase()));
    const filteredOrders = orders.filter(o => o.studentName?.toLowerCase().includes(search.toLowerCase()));

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Coin Do'kon (Admin)</h1>
                    <p className="mt-1 text-sm text-slate-500">Real bazaga bog'langan mahsulotlarni yaratish paneli</p>
                </div>
                <div className="flex items-center gap-3">
                    <button 
                        onClick={() => setIsDrawerOpen(true)}
                        className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-violet-600 px-5 text-sm font-semibold text-white shadow-md transition-all hover:bg-violet-700 active:scale-95"
                    >
                        <Plus className="h-4 w-4" />
                        Mahsulot qo'shish
                    </button>
                </div>
            </div>

            {/* Tabs & Search */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 rounded-2xl bg-white p-2 border border-slate-100 shadow-sm">
                <div className="flex items-center gap-1 w-full sm:w-auto p-1 bg-slate-100/70 rounded-xl">
                    <button
                        onClick={() => setActiveTab("ITEMS")}
                        className={`px-5 py-2 text-sm font-semibold rounded-lg transition-all ${activeTab === "ITEMS" ? "bg-white text-slate-900 shadow-sm" : "text-slate-500 hover:text-slate-700"}`}
                    >
                        Barcha mahsulotlar
                    </button>
                    <button
                        onClick={() => setActiveTab("ORDERS")}
                        className={`px-5 py-2 text-sm font-semibold rounded-lg transition-all ${activeTab === "ORDERS" ? "bg-white text-violet-700 shadow-sm" : "text-slate-500 hover:text-slate-700"}`}
                    >
                        Xarid qilinganlar (Buyurtmalar)
                    </button>
                </div>
                
                <div className="relative w-full sm:w-64">
                    <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                    <input
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        placeholder="Qidirish..."
                        className="h-10 w-full rounded-xl border border-slate-200 bg-slate-50 pl-10 pr-4 text-sm outline-none transition-all focus:border-violet-400 focus:bg-white"
                    />
                </div>
            </div>

            {/* Lists */}
            <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
                {activeTab === "ITEMS" ? (
                    <div className="min-w-full">
                        <div className="grid grid-cols-[80px_2fr_1.5fr_1fr_1fr_120px] gap-4 border-b border-slate-200 bg-slate-50/50 px-6 py-4 text-xs font-semibold uppercase tracking-wider text-slate-500">
                            <span>ID</span>
                            <span>Mahsulot nomi</span>
                            <span>Toifa</span>
                            <span>Coin narxi</span>
                            <span>Zaxira</span>
                            <span className="text-right">Amallar</span>
                        </div>
                        {loading ? (
                             <div className="p-10 text-center text-slate-400">Yuklanmoqda... (P.S. Agar bo'sh bo'lsa postmen orqali backendni ishga tushiring)</div>
                        ) : filteredItems.length === 0 ? (
                            <div className="p-10 text-center text-slate-400">Hozircha baza bo'sh. Tepadan "Mahsulot qo'shish"ni bosing.</div>
                        ) : filteredItems.map((item) => (
                            <div key={item._id || item.id} className="grid grid-cols-[80px_2fr_1.5fr_1fr_1fr_120px] items-center gap-4 border-b border-slate-100 px-6 py-4 text-sm hover:bg-slate-50/50 last:border-0">
                                <span className="font-mono text-[10px] text-slate-400 truncate">{String(item._id || item.id).slice(-6)}</span>
                                <span className="font-semibold text-slate-800 flex items-center gap-3 truncate">
                                    {/* Preview image mini */}
                                    {item.image ? (
                                        <div className="w-8 h-8 rounded-lg overflow-hidden bg-slate-100 flex-shrink-0">
                                            <img src={item.image} alt="" className="w-full h-full object-cover" />
                                        </div>
                                    ) : (
                                        <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center flex-shrink-0">
                                            <ShoppingBag className="w-4 h-4 text-slate-400" />
                                        </div>
                                    )}
                                    <span className="truncate">{item.title}</span>
                                </span>
                                <span><span className="px-2.5 py-1 bg-slate-100 text-slate-600 text-[10px] font-bold uppercase rounded-md">{item.category}</span></span>
                                <span className="text-amber-600 font-bold">{item.price} Coin</span>
                                <span className="text-slate-600">{item.stock} ta</span>
                                <div className="text-right text-rose-500 hover:text-rose-600 cursor-pointer font-medium text-xs">O'chirish</div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="min-w-full">
                        <div className="grid grid-cols-[80px_2fr_2fr_1.5fr_1.5fr_120px] gap-4 border-b border-slate-200 bg-violet-50/30 px-6 py-4 text-xs font-semibold uppercase tracking-wider text-slate-500">
                            <span>ID</span>
                            <span>O'quvchi</span>
                            <span>Nima xarid qildi?</span>
                            <span>Coin miqdori</span>
                            <span>Holati</span>
                            <span className="text-right">Harakat</span>
                        </div>
                        {loading ? (
                            <div className="p-10 text-center text-slate-400">Yuklanmoqda...</div>
                        ) : filteredOrders.length === 0 ? (
                            <div className="p-10 text-center text-slate-400">Hech qanday buyurtma mavjud emas.</div>
                        ) : filteredOrders.map((order) => (
                            <div key={order._id || order.id} className="grid grid-cols-[80px_2fr_2fr_1.5fr_1.5fr_120px] items-center gap-4 border-b border-slate-100 px-6 py-4 text-sm hover:bg-violet-50/20 last:border-0">
                                <span className="font-mono text-[10px] text-slate-400 truncate">{String(order._id || order.id).slice(-6)}</span>
                                <span className="font-bold text-slate-800 truncate">{order.studentName || order.student?.name}</span>
                                <span className="text-slate-600 truncate">{order.item || order.product?.title}</span>
                                <span className="text-amber-600 font-bold">{order.cost || order.price} Coin</span>
                                <span>
                                    {order.status === "PENDING" ? (
                                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-amber-50 text-amber-700 text-[11px] font-bold uppercase rounded-lg">
                                            <Timer className="w-3.5 h-3.5" /> Kutmoqda
                                        </span>
                                    ) : (
                                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-emerald-50 text-emerald-700 text-[11px] font-bold uppercase rounded-lg">
                                            <CheckCircle className="w-3.5 h-3.5" /> Berildi
                                        </span>
                                    )}
                                </span>
                                <div className="text-right flex justify-end">
                                    {order.status === "PENDING" && (
                                        <button 
                                            onClick={() => handleFulfillOrder(order._id || order.id)}
                                            className="px-3 py-1.5 bg-violet-100 text-violet-700 hover:bg-violet-200 rounded-lg text-xs font-bold transition-colors"
                                        >
                                            Topshirish
                                        </button>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* RIGHT SIDE DRAWER FOR CREATING PRODUCT */}
            {/* Background Overlay */}
            {isDrawerOpen && (
                <div 
                    className="fixed inset-0 z-[100] bg-slate-900/40 backdrop-blur-sm transition-opacity" 
                    onClick={closeDrawer}
                />
            )}
            
            {/* Drawer Panel */}
            <div 
                className={`fixed inset-y-0 right-0 z-[110] w-full max-w-[450px] bg-white shadow-2xl transition-transform duration-300 transform flex flex-col ${
                    isDrawerOpen ? "translate-x-0" : "translate-x-full"
                }`}
            >
                <div className="flex items-start justify-between p-6 border-b border-slate-100">
                    <div>
                        <h2 className="text-xl font-bold text-slate-900">Mahsulot qo'shish</h2>
                        <p className="text-sm text-slate-500 mt-1">Yangi mahsulot parametrlarini va rasmini kiriting</p>
                    </div>
                    <button 
                        onClick={closeDrawer} 
                        className="text-slate-400 hover:bg-slate-100 p-2 rounded-xl transition-colors"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                <div className="flex-1 overflow-y-auto p-6">
                    <form id="createProductForm" onSubmit={handleSubmit} className="space-y-6">
                        
                        {/* Title */}
                        <div>
                            <label className="block text-sm font-semibold text-slate-700 mb-1.5">Mahsulot nomi</label>
                            <input 
                                name="title" required value={formData.title} onChange={handleChange} 
                                className="w-full h-12 px-4 border border-slate-200 rounded-xl focus:border-violet-500 focus:ring-4 focus:ring-violet-50 transition-all outline-none bg-white text-slate-800"
                                placeholder="..." 
                            />
                        </div>

                        {/* Image Uploader */}
                        <div>
                            <label className="block text-sm font-semibold text-slate-700 mb-1.5">Moddiy tasviri (Rasm)</label>
                            
                            {!previewUrl ? (
                                <div className="relative border-2 border-dashed border-slate-300 rounded-2xl bg-slate-50 hover:bg-slate-100 transition-colors cursor-pointer pt-6 pb-6 flex flex-col items-center justify-center text-center">
                                    <input 
                                        type="file" 
                                        accept="image/*"
                                        onChange={handleImageChange}
                                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                                    />
                                    <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-sm border border-slate-200 mb-3 text-slate-500">
                                        <ImageIcon className="w-6 h-6 text-violet-500" />
                                    </div>
                                    <p className="text-sm font-bold text-slate-700">Faylni tanlash uchun bosing</p>
                                    <p className="text-xs text-slate-500 mt-1">PNG, JPG qabul qilinadi (Max: 5MB)</p>
                                </div>
                            ) : (
                                <div className="relative border border-slate-200 rounded-2xl overflow-hidden group">
                                    <img src={previewUrl} alt="Preview" className="w-full h-48 object-cover" />
                                    <div className="absolute inset-0 bg-slate-900/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
                                        <button 
                                            type="button" 
                                            onClick={handleClearImage}
                                            className="px-4 py-2 bg-rose-500 text-white text-sm font-medium rounded-lg hover:bg-rose-600 transition-colors"
                                        >
                                            O'chirish
                                        </button>
                                        <div className="relative">
                                             <button type="button" className="px-4 py-2 bg-white text-slate-800 text-sm font-medium rounded-lg hover:bg-slate-100 transition-colors">Yangi tanlash</button>
                                             <input type="file" accept="image/*" onChange={handleImageChange} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" />
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                        
                        {/* Properties */}
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-semibold text-slate-700 mb-1.5">Coin narxi</label>
                                <input 
                                    type="number" name="price" required value={formData.price} onChange={handleChange} 
                                    className="w-full h-12 px-4 border border-slate-200 rounded-xl focus:border-violet-500 focus:ring-4 focus:ring-violet-50 transition-all outline-none bg-white font-bold text-amber-600 placeholder-slate-400"
                                    placeholder="Masalan, 50" 
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-semibold text-slate-700 mb-1.5">Ombordagi soni</label>
                                <input 
                                    type="number" name="stock" required value={formData.stock} onChange={handleChange} 
                                    className="w-full h-12 px-4 border border-slate-200 rounded-xl focus:border-violet-500 focus:ring-4 focus:ring-violet-50 transition-all outline-none bg-white text-slate-800"
                                    placeholder="..." 
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-semibold text-slate-700 mb-1.5">Kategoriya</label>
                            <select 
                                name="category" value={formData.category} onChange={handleChange} 
                                className="w-full h-12 px-4 border border-slate-200 rounded-xl focus:border-violet-500 focus:ring-4 focus:ring-violet-50 transition-all outline-none bg-white text-slate-800"
                            >
                                <option value="Aksessuar">Aksessuar</option>
                                <option value="Kitob">Kitoblar va qollanmalar</option>
                                <option value="Kurs">Qo'shimcha kurs</option>
                            </select>
                        </div>
                        
                        <div>
                            <label className="block text-sm font-semibold text-slate-700 mb-1.5">To'liq izoh</label>
                            <textarea 
                                name="description" required value={formData.description} onChange={handleChange} rows="4"
                                className="w-full p-4 border border-slate-200 rounded-xl focus:border-violet-500 focus:ring-4 focus:ring-violet-50 transition-all outline-none resize-none bg-white text-slate-800 text-sm leading-relaxed"
                                placeholder="Talabaga ko'rsatiladigan tushuntirish..." 
                            />
                        </div>

                    </form>
                </div>

                {/* Footer Action */}
                <div className="p-6 border-t border-slate-100 bg-slate-50 flex items-center justify-end gap-3 z-10 shrink-0">
                    <button 
                        type="button" 
                        onClick={closeDrawer} 
                        className="px-6 py-2.5 text-sm font-semibold text-slate-600 bg-white border border-slate-200 hover:bg-slate-50 rounded-xl transition-all shadow-sm"
                    >
                        Bekor qilish
                    </button>
                    <button 
                        type="submit" 
                        form="createProductForm"
                        className="px-8 py-2.5 text-sm font-semibold text-white bg-violet-600 hover:bg-violet-700 rounded-xl transition-all shadow-sm flex items-center gap-2"
                    >
                        <UploadCloud className="w-4 h-4" />
                        Saqlash
                    </button>
                </div>
            </div>

        </div>
    );
}
