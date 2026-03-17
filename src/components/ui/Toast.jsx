// src/components/ui/Toast.jsx
import { useEffect, useState } from "react";
import { CheckCircle2, XCircle, X } from "lucide-react";

let toastListeners = [];
let toastId = 0;

export const toast = {
    success: (message) => {
        const id = ++toastId;
        toastListeners.forEach((fn) => fn({ id, type: 'success', message }));
    },
    error: (message) => {
        const id = ++toastId;
        toastListeners.forEach((fn) => fn({ id, type: 'error', message }));
    },
};

export function ToastContainer() {
    const [toasts, setToasts] = useState([]);

    useEffect(() => {
        const handler = (t) => {
            setToasts((prev) => [...prev, t]);
            setTimeout(() => {
                setToasts((prev) => prev.filter((item) => item.id !== t.id));
            }, 4000);
        };
        toastListeners.push(handler);
        return () => { toastListeners = toastListeners.filter((fn) => fn !== handler); };
    }, []);

    const remove = (id) => setToasts((prev) => prev.filter((t) => t.id !== id));

    return (
        <div className="fixed top-5 right-5 z-9999 flex flex-col gap-2 pointer-events-none">
            {toasts.map((t) => (
                <div
                    key={t.id}
                    style={{ animation: 'slideIn 0.25s ease-out' }}
                    className={`pointer-events-auto flex items-center gap-3 rounded-2xl px-4 py-3 shadow-xl text-sm min-w-70 max-w-90 bg-white border ${
                        t.type === 'success' ? 'border-emerald-100' : 'border-rose-100'
                    }`}
                >
                    <div className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-xl ${
                        t.type === 'success' ? 'bg-emerald-50' : 'bg-rose-50'
                    }`}>
                        {t.type === 'success'
                            ? <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                            : <XCircle className="h-4 w-4 text-rose-500" />
                        }
                    </div>
                    <span className="flex-1 text-xs font-medium text-slate-700">{t.message}</span>
                    <button onClick={() => remove(t.id)} className="text-slate-300 hover:text-slate-500 transition shrink-0">
                        <X className="h-4 w-4" />
                    </button>
                </div>
            ))}
        </div>
    );
}