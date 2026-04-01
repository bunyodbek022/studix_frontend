import { api } from "./axios";

export const shopService = {
  // MAHSULOTLAR (PRODUCTS)
  
  // Barchasi olish (Talaba o'zi va Admin ko'rishi uchun)
  getProducts: () => api.get("/shop/products"),
  
  // 1 ta mahsulotni to'liq ko'rish
  getProductById: (id) => api.get(`/shop/products/${id}`),
  
  // Admin: yangi mahsulot qo'shish (File upload formData)
  createProduct: (data) => api.post("/shop/products", data, { headers: { "Content-Type": "multipart/form-data" } }),
  
  // Admin: mavjud mahsulotni tahrirlash
  updateProduct: (id, data) => api.put(`/shop/products/${id}`, data, { headers: { "Content-Type": "multipart/form-data" } }),
  
  // Admin: mahsulotni ochirib tashlash (yoki yashirish)
  deleteProduct: (id) => api.delete(`/shop/products/${id}`),

  // BUYURTMALAR (ORDERS)

  // Admin: Barcha buyurtmalarni olish
  getOrders: () => api.get("/shop/orders"),
  
  // Student: O'quvchi mahsulotni xarid qilishi (Tangasi yetganligini backend tekshiradi)
  buyProduct: (productId) => api.post("/shop/orders", { productId }),

  // Admin: Xaridni (buyurtmani) topshirilganligini tasdiqlash
  fulfillOrder: (orderId) => api.patch(`/shop/orders/${orderId}`, { status: "DELIVERED" })
};
