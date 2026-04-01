import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Search, Eraser, Coins, ShoppingBag, Plus, X, UploadCloud, Image as ImageIcon, MoreVertical, Edit, Trash2 } from "lucide-react";
import { shopService } from "../../api/shop.service";
import { toast } from "../../components/ui/Toast";

export default function ShoppingPage() {
    const navigate = useNavigate();
    const studentBalance = 900; 

    const [activeTab, setActiveTab] = useState("SOTUVDA"); 
    
    // API Data
    const [shopItems, setShopItems] = useState([]);
    const [loading, setLoading] = useState(false);

    // Filters state
    const [category, setCategory] = useState("Barchasi");
    const [minPrice, setMinPrice] = useState("");
    const [maxPrice, setMaxPrice] = useState("");
    const [search, setSearch] = useState("");
    const [affordableOnly, setAffordableOnly] = useState(false);

    // Dropdown state for card menu
    const [openDropdown, setOpenDropdown] = useState(null);

    // --- DRAWER FOR ADDING/EDITING PRODUCT (Admin Feature) ---
    const [isDrawerOpen, setIsDrawerOpen] = useState(false);
    const [editingId, setEditingId] = useState(null);

    const [formData, setFormData] = useState({
        title: "",
        description: "",
        price: "",
        stock: "",
        category: "Aksessuar",
    });
    const [selectedImage, setSelectedImage] = useState(null); 
    const [previewUrl, setPreviewUrl] = useState(null);       

    // Fetch from API
    const fetchShopItems = async () => {
        try {
            setLoading(true);
            const res = await shopService.getProducts();
            setShopItems(res?.data?.data || res?.data || []);
        } catch (error) {
            console.error("Yuklashda xato:", error);
            // BACKEND ISHLAMAYOTGAN BO'LSA (404), LOCALSTORAGE DAN OLAMIZ
            let localSaved = JSON.parse(localStorage.getItem("_mockShopItems")) || [];
            // Eski 'blob:' URLlar o'lgan bo'lsa o'rniga oddiy rasm qo'yamiz
            localSaved = localSaved.map(i => ({
                ...i,
                image: (i.image && i.image.startsWith("blob:")) ? "https://placehold.co/400x400/ffffff/64748b?text=Rasm+yoq" : i.image
            }));
            setShopItems(localSaved);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchShopItems();
        
        // Modal tashqarisiga bossa dropdown yopilishi uchun
        const handleClickOutside = () => setOpenDropdown(null);
        window.addEventListener('click', handleClickOutside);
        return () => window.removeEventListener('click', handleClickOutside);
    }, []);

    const handleClearFilters = () => {
        setCategory("Barchasi");
        setMinPrice("");
        setMaxPrice("");
        setSearch("");
        setAffordableOnly(false);
    };

    // FORM HANDLERS
    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
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

    const closeDrawer = () => {
        setIsDrawerOpen(false);
        setEditingId(null);
        setFormData({ title: "", description: "", price: "", stock: "", category: "Aksessuar" });
        setSelectedImage(null);
        setPreviewUrl(null);
    }

    const handleEditClick = (e, item) => {
        e.stopPropagation();
        setEditingId(item._id || item.id);
        setFormData({
            title: item.title || "",
            description: item.description || "",
            price: item.price || "",
            stock: item.stock || "",
            category: item.category || "Aksessuar",
        });
        setPreviewUrl(item.image || null);
        setSelectedImage(null);
        setIsDrawerOpen(true);
        setOpenDropdown(null);
    }

    const handleDeleteClick = async (e, id) => {
        e.stopPropagation();
        setOpenDropdown(null);
        // User xohishiga ko'ra confirm qilsangiz bo'ladi, men hozircha to'g'ridan to'g'ri o'chiraman
        try {
            await shopService.deleteProduct(id);
            toast.success("Mahsulot muvaffaqiyatli o'chirildi!");
            fetchShopItems();
        } catch (error) {
            toast.error(error.response?.data?.message || "Backend ulanmagan: faqat UI dan vizual o'chirildi.");
            
            const localSaved = JSON.parse(localStorage.getItem("_mockShopItems")) || [];
            const updatedItems = localSaved.filter(i => (i._id || i.id) !== id);
            localStorage.setItem("_mockShopItems", JSON.stringify(updatedItems));
            setShopItems(updatedItems);
        }
    }

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

            if (editingId) {
                await shopService.updateProduct(editingId, data);
                toast.success("Mahsulot muvaffaqiyatli tahrirlandi!");
            } else {
                await shopService.createProduct(data);
                toast.success("Mahsulot muvaffaqiyatli saqlandi!");
            }
            
            closeDrawer();
            fetchShopItems();
        } catch (error) {
           toast.error(error.response?.data?.message || "Hozircha Backend server topilmadi (404). Vizual amaliyot bajarildi!");
           
           const saveMock = (base64Img) => {
               const localSaved = JSON.parse(localStorage.getItem("_mockShopItems")) || [];
               let updatedItems = [];

               if (editingId) {
                   const index = localSaved.findIndex(i => (i._id || i.id) === editingId);
                   if (index !== -1) {
                       localSaved[index] = {
                           ...localSaved[index],
                           title: formData.title,
                           description: formData.description,
                           price: formData.price,
                           category: formData.category,
                           stock: formData.stock,
                           image: base64Img || localSaved[index].image
                       };
                   }
                   updatedItems = [...localSaved];
               } else {
                   const newMockItem = {
                       _id: Date.now().toString(),
                       title: formData.title,
                       description: formData.description,
                       price: formData.price,
                       category: formData.category,
                       stock: formData.stock,
                       image: base64Img || "https://placehold.co/400x400/ffffff/64748b?text=Yangi+Mahsulot",
                   };
                   updatedItems = [newMockItem, ...localSaved];
               }

               setShopItems(updatedItems);
               localStorage.setItem("_mockShopItems", JSON.stringify(updatedItems));
               closeDrawer();
           };

           // Rasmni string base64 qilib xotirada eslab qolish
           if (selectedImage) {
               const reader = new FileReader();
               reader.onloadend = () => saveMock(reader.result);
               reader.readAsDataURL(selectedImage);
           } else {
               saveMock(previewUrl);
           }
        }
    };

    // Apply filters
    const filteredItems = shopItems.filter(item => {
        if (category !== "Barchasi" && item.category !== category) return false;
        if (minPrice && item.price < Number(minPrice)) return false;
        if (maxPrice && item.price > Number(maxPrice)) return false;
        if (search && !item.title.toLowerCase().includes(search.toLowerCase())) return false;
        if (affordableOnly && studentBalance < item.price) return false;
        return true;
    });

    return (
        <div className="space-y-6 max-w-[1200px] mx-auto pb-10">
            {/* Action Bar / Title with Admin Add Button */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mt-2 mb-4">
                <div>
                    <h1 className="text-3xl font-extrabold text-[#334155] tracking-tight">Studix Do'kon</h1>
                    <p className="mt-1 text-sm text-slate-500">Tangalar evaziga xarid qilinadigan mahsulotlar</p>
                </div>
                <div className="flex items-center gap-3">
                    <button 
                        onClick={() => setIsDrawerOpen(true)}
                        className="inline-flex h-10 items-center justify-center gap-2 rounded-xl bg-slate-800 px-5 text-sm font-semibold text-white shadow-sm transition-all hover:bg-slate-700 active:scale-95 border border-slate-900"
                    >
                        <Plus className="h-4 w-4" />
                        Mahsulot qo'shish
                    </button>
                </div>
            </div>

            {/* Tabs */}
            <div className="flex items-center gap-8 border-b border-slate-200">
                <button
                    onClick={() => setActiveTab("SOTUVDA")}
                    className={`pb-3 text-sm font-medium transition-colors relative ${
                        activeTab === "SOTUVDA" 
                            ? "text-[#cfa16a]" 
                            : "text-slate-500 hover:text-slate-800"
                    }`}
                >
                    Sotuvda
                    {activeTab === "SOTUVDA" && (
                        <div className="absolute bottom-0 left-0 w-full h-[2px] bg-[#cfa16a]"></div>
                    )}
                </button>
                <button
                    onClick={() => setActiveTab("XARIDLAR")}
                    className={`pb-3 text-sm font-medium transition-colors relative ${
                        activeTab === "XARIDLAR" 
                            ? "text-[#cfa16a]" 
                            : "text-slate-500 hover:text-slate-800"
                    }`}
                >
                    Sotib olganlarim
                    {activeTab === "XARIDLAR" && (
                        <div className="absolute bottom-0 left-0 w-full h-[2px] bg-[#cfa16a]"></div>
                    )}
                </button>
            </div>

            {/* Filter Section */}
            {activeTab === "SOTUVDA" && (
                <div className="flex flex-wrap items-end gap-5 py-2">
                    {/* Category */}
                    <div className="flex flex-col gap-1.5 min-w-[140px]">
                        <label className="text-xs text-slate-500 font-medium font-sans">Kategoriya</label>
                        <select 
                            value={category}
                            onChange={(e) => setCategory(e.target.value)}
                            className="h-10 px-3 w-full rounded-lg border border-slate-200 bg-white text-sm outline-none focus:border-[#cfa16a]"
                        >
                            <option value="Barchasi">Barchasi</option>
                            <option value="Aksessuar">Aksessuar</option>
                            <option value="Kitob">Kitoblar va qollanmalar</option>
                            <option value="Kurs">Kurslar</option>
                        </select>
                    </div>

                    {/* Price Range */}
                    <div className="flex flex-col gap-1.5">
                        <label className="text-xs text-slate-500 font-medium">Aksessuar qiymati</label>
                        <div className="flex items-center gap-2">
                            <input
                                type="number"
                                placeholder=""
                                value={minPrice}
                                onChange={(e) => setMinPrice(e.target.value)}
                                className="h-10 w-20 px-3 rounded-lg border border-slate-200 bg-white text-sm text-center outline-none focus:border-[#cfa16a]"
                            />
                            <span className="text-sm text-slate-500">dan</span>
                            <input
                                type="number"
                                placeholder=""
                                value={maxPrice}
                                onChange={(e) => setMaxPrice(e.target.value)}
                                className="h-10 w-20 px-3 rounded-lg border border-slate-200 bg-white text-sm text-center outline-none focus:border-[#cfa16a]"
                            />
                            <span className="text-sm text-slate-500">gacha</span>
                        </div>
                    </div>

                    {/* Search */}
                    <div className="flex flex-col gap-1.5 flex-1 min-w-[200px]">
                        <label className="text-xs text-slate-500 font-medium">Akssessuar nomi</label>
                        <div className="relative">
                            <input
                                type="text"
                                placeholder="Qidirish..."
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                className="h-10 w-full rounded-lg border border-slate-200 bg-white pl-3 pr-10 text-sm outline-none focus:border-[#cfa16a]"
                            />
                            <Search className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                        </div>
                    </div>

                    {/* Toggle Affordable Only */}
                    <div className="flex flex-col gap-2.5 items-center justify-center">
                        <label className="text-xs text-slate-500 font-medium">Kumushlarim yetadi</label>
                        <button 
                            type="button"
                            onClick={() => setAffordableOnly(!affordableOnly)}
                            className="relative inline-flex h-5 w-10 items-center rounded-full transition-colors border shadow-inner"
                            style={{ backgroundColor: affordableOnly ? '#cfa16a' : '#f1f5f9', borderColor: affordableOnly ? '#cfa16a' : '#cbd5e1' }}
                        >
                            <span 
                                className={`inline-block h-4 w-4 transform rounded-full bg-white shadow-sm transition-transform ${affordableOnly ? 'translate-x-[20px] bg-white' : 'translate-x-[2px]'}`} 
                            />
                        </button>
                    </div>

                    {/* Clear filter button */}
                    <div className="ml-auto flex items-end">
                        <button 
                            onClick={handleClearFilters}
                            className="h-10 w-12 flex items-center justify-center border border-slate-200 rounded-lg text-slate-500 hover:bg-slate-50 hover:text-rose-500 transition-colors"
                        >
                            <Eraser className="h-4 w-4" />
                        </button>
                    </div>
                </div>
            )}

            {/* Content Area */}
            {activeTab === "SOTUVDA" ? (
                loading ? (
                    <div className="py-20 flex justify-center text-slate-500">Mahsulotlar API dan yuklanmoqda...</div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6 mt-6">
                        {filteredItems.map((item) => {
                            const canAfford = studentBalance >= item.price;
                            const itemId = item._id || item.id;
                            
                            return (
                                <div 
                                    key={itemId} 
                                    onClick={() => navigate((itemId).toString())}
                                    className="bg-white rounded-2xl p-4 flex flex-col min-h-[360px] shadow-sm border border-slate-100 hover:shadow-md transition-all cursor-pointer relative group"
                                >
                                    {/* --- 3-DOT MENU FOR ADMIN Tahrirlash/O'chirish --- */}
                                    <div className="absolute top-2 right-2 z-10" onClick={(e) => e.stopPropagation()}>
                                        <button 
                                            onClick={() => setOpenDropdown(openDropdown === itemId ? null : itemId)}
                                            className="w-8 h-8 flex items-center justify-center bg-white/80 hover:bg-white backdrop-blur-sm rounded-full text-slate-400 hover:text-slate-800 shadow-sm transition-colors border border-slate-100/50"
                                        >
                                            <MoreVertical className="w-4 h-4" />
                                        </button>
                                        
                                        {/* Dropdown Menu */}
                                        {openDropdown === itemId && (
                                            <div className="absolute right-0 top-full mt-1 w-32 bg-white rounded-xl shadow-lg border border-slate-100 py-1 overflow-hidden origin-top-right animate-in fade-in zoom-in-95 duration-100">
                                                <button 
                                                    onClick={(e) => handleEditClick(e, item)}
                                                    className="w-full px-4 py-2 text-left text-sm font-medium text-slate-600 hover:bg-slate-50 hover:text-violet-600 flex items-center gap-2 transition-colors"
                                                >
                                                    <Edit className="w-3.5 h-3.5" /> Tahrirlash
                                                </button>
                                                <button 
                                                    onClick={(e) => handleDeleteClick(e, itemId)}
                                                    className="w-full px-4 py-2 text-left text-sm font-medium text-slate-600 hover:bg-rose-50 hover:text-rose-600 flex items-center gap-2 transition-colors"
                                                >
                                                    <Trash2 className="w-3.5 h-3.5" /> O'chirish
                                                </button>
                                            </div>
                                        )}
                                    </div>

                                    {/* Image Box */}
                                    <div className="h-44 w-full mb-4 flex items-center justify-center overflow-hidden rounded-xl bg-white relative">
                                        <img 
                                            src={item.image || "https://placehold.co/400x400/ffffff/64748b?text=Rasm+yoq"} 
                                            alt={item.title} 
                                            className="h-full w-full object-contain object-center group-hover:scale-105 transition-transform duration-300 drop-shadow-sm"
                                        />
                                    </div>
                                    
                                    {/* Title & Description */}
                                    <div className="flex-1 flex flex-col pt-1">
                                        <h3 className="font-bold text-slate-800 text-[15px] leading-snug line-clamp-2 mb-1 pr-6">
                                            {item.title}
                                        </h3>
                                        {item.description && (
                                            <p className="text-[13px] text-slate-500 line-clamp-2 leading-relaxed pr-2">
                                                {item.description}
                                            </p>
                                        )}
                                    </div>
                                    
                                    <div className="mt-5 flex items-end justify-between">
                                        {/* Price */}
                                        <div className="flex items-center gap-1.5">
                                            <span className="font-medium text-slate-600 text-[15px]">{item.price}</span>
                                            {/* Golden coin icon representation */}
                                            <div className="flex items-center justify-center bg-yellow-100 rounded-full p-1 text-yellow-600 h-5 w-5 border border-yellow-200">
                                                <Coins className="h-[10px] w-[10px]" />
                                            </div>
                                        </div>

                                        {/* Button */}
                                        {canAfford ? (
                                            <button className="bg-[#cfa16a] text-white text-xs font-semibold px-4 py-2 flex items-center justify-center rounded-lg hover:bg-[#b88c5a] transition-colors shadow-sm whitespace-nowrap">
                                                Sotib olish
                                            </button>
                                        ) : (
                                            <button disabled className="bg-[#6b7280] text-white text-[11px] font-medium px-2 py-1.5 rounded-md leading-snug flex flex-col items-center justify-center opacity-90 cursor-not-allowed shrink-0">
                                                <span>Kumushingiz</span>
                                                <span>yetarli emas</span>
                                            </button>
                                        )}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )
            ) : (
                <div className="flex flex-col items-center justify-center py-20 text-slate-500">
                    <ShoppingBag className="h-16 w-16 mb-4 text-slate-300" />
                    <p>Siz hali hech narsa sotib olmagansiz.</p>
                </div>
            )}
            
            {activeTab === "SOTUVDA" && !loading && filteredItems.length === 0 && (
                 <div className="py-20 text-center text-slate-500 font-medium">Bizning Do'konda hozircha mahsulot yo'q.</div>
            )}

            {/* --- RIGHT SIDE DRAWER FOR CREATING PRODUCT --- */}
            
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
                        <h2 className="text-xl font-bold text-slate-900">{editingId ? "Tahrirlash" : "Mahsulot qo'shish"}</h2>
                        <p className="text-sm text-slate-500 mt-1">{editingId ? "Mahsulot ma'lumotlarini o'zgartiring" : "Yangi mahsulot parametrlarini va rasmini kiriting"}</p>
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
                                className="w-full h-12 px-4 border border-slate-200 rounded-xl focus:border-[#cfa16a] focus:ring-4 focus:ring-amber-50 transition-all outline-none bg-white text-slate-800"
                                placeholder="Masalan: Maxsus stakan" 
                            />
                        </div>

                        {/* Image Uploader */}
                        <div>
                            <label className="block text-sm font-semibold text-slate-700 mb-1.5">Tovar Rasmini (File) yuklang</label>
                            
                            {!previewUrl ? (
                                <div className="relative border-2 border-dashed border-slate-300 rounded-2xl bg-slate-50 hover:bg-slate-100 transition-colors cursor-pointer pt-6 pb-6 flex flex-col items-center justify-center text-center group">
                                    <input 
                                        type="file" 
                                        accept="image/*"
                                        onChange={handleImageChange}
                                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                                    />
                                    <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-sm border border-slate-200 mb-3 text-slate-500 group-hover:text-[#cfa16a] transition-colors">
                                        <ImageIcon className="w-6 h-6" />
                                    </div>
                                    <p className="text-sm font-bold text-slate-700">Faylni tanlash uchun bosing</p>
                                    <p className="text-xs text-slate-500 mt-1">PNG, JPG, JPEG (Max: 5MB)</p>
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
                                <label className="block text-sm font-semibold text-slate-700 mb-1.5">Kumush (Coin) narxi</label>
                                <input 
                                    type="number" name="price" required value={formData.price} onChange={handleChange} 
                                    className="w-full h-12 px-4 border border-slate-200 rounded-xl focus:border-[#cfa16a] focus:ring-4 focus:ring-amber-50 transition-all outline-none bg-white font-bold text-[#cfa16a] placeholder-slate-400"
                                    placeholder="Aytaylik, 500" 
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-semibold text-slate-700 mb-1.5">Zaxirada donasi</label>
                                <input 
                                    type="number" name="stock" required value={formData.stock} onChange={handleChange} 
                                    className="w-full h-12 px-4 border border-slate-200 rounded-xl focus:border-[#cfa16a] focus:ring-4 focus:ring-amber-50 transition-all outline-none bg-white text-slate-800"
                                    placeholder="Masalan: 100" 
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-semibold text-slate-700 mb-1.5">Kategoriya</label>
                            <select 
                                name="category" value={formData.category} onChange={handleChange} 
                                className="w-full h-12 px-4 border border-slate-200 rounded-xl focus:border-[#cfa16a] focus:ring-4 focus:ring-amber-50 transition-all outline-none bg-white text-slate-800"
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
                                className="w-full p-4 border border-slate-200 rounded-xl focus:border-[#cfa16a] focus:ring-4 focus:ring-amber-50 transition-all outline-none resize-none bg-white text-slate-800 text-sm leading-relaxed"
                                placeholder="..." 
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
                        className="px-8 py-2.5 text-sm font-semibold text-white bg-slate-800 hover:bg-slate-900 rounded-xl transition-all shadow-sm flex items-center gap-2"
                    >
                        <UploadCloud className="w-4 h-4" />
                        Saqlash
                    </button>
                </div>
            </div>

        </div>
    );
}
