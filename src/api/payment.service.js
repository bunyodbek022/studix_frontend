import { api } from "./axios";

export const paymentService = {
    async getPayments(params) {
        // Hozirgi kunda backend tayyor bo'lmagani uchun feyk ma'lumot jo'natamiz
        // const { data } = await api.get("/payments", { params });
        // return data;
        
        return new Promise((resolve) => {
            setTimeout(() => {
                resolve({
                    data: [
                        { id: 1, studentName: "Ali Valiyev", groupName: "Frontend React (Oflayn)", amount: 450000, date: "2026-04-01T10:30:00", method: "NAQD", status: "PAID" },
                        { id: 2, studentName: "Sardor Anvarov", groupName: "Python Backend", amount: 500000, date: "2026-04-01T11:15:00", method: "PAYME", status: "PAID" },
                        { id: 3, studentName: "Nodira Karimova", groupName: "IELTS 7.0+", amount: 350000, date: "2026-03-31T14:20:00", method: "CLICK", status: "PAID" },
                        { id: 4, studentName: "Aziz Rahmonov", groupName: "Frontend React (Oflayn)", amount: 450000, date: "2026-03-30T09:45:00", method: "NAQD", status: "PENDING" },
                    ]
                });
            }, 800);
        });
    },

    async createPayment(payload) {
        // const { data } = await api.post("/payments", payload);
        // return data;
        return new Promise((resolve) => setTimeout(() => resolve({ success: true }), 1000));
    },
    
    async getDebtors(params) {
        // const { data } = await api.get("/payments/debtors", { params });
        // return data;
        return new Promise((resolve) => {
            setTimeout(() => {
                resolve({
                    data: [
                        { id: 101, studentName: "Rustam Qobulov", groupName: "Node.js Advance", debtAmount: 600000, dueDate: "2026-03-15", phone: "+998 90 123 45 67" },
                        { id: 102, studentName: "Ma'mura To'rayeva", groupName: "SMM Pro", debtAmount: 300000, dueDate: "2026-03-25", phone: "+998 99 987 65 43" },
                    ]
                });
            }, 800);
        });
    }
};
