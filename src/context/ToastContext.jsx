import { createContext, useContext, useState, useCallback } from "react";
import { CheckCircle2, XCircle, X } from "lucide-react";

const ToastContext = createContext(null);

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  const showToast = useCallback((message, type = "success") => {
    const id = Math.random().toString(36).slice(2);
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4000);
  }, []);

  const dismiss = (id) => setToasts((prev) => prev.filter((t) => t.id !== id));

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      <div className="fixed bottom-4 right-4 z-50 space-y-2 w-full max-w-sm">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className={`flex items-start gap-2.5 rounded-md shadow-lg border px-4 py-3 bg-white ${
              toast.type === "error" ? "border-red-200" : "border-emerald-200"
            }`}
          >
            {toast.type === "error" ? (
              <XCircle size={18} className="text-red-500 flex-shrink-0 mt-0.5" />
            ) : (
              <CheckCircle2 size={18} className="text-emerald-500 flex-shrink-0 mt-0.5" />
            )}
            <p className="text-sm text-slate-700 flex-1">{toast.message}</p>
            <button onClick={() => dismiss(toast.id)} className="text-slate-300 hover:text-slate-500">
              <X size={16} />
            </button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error("useToast must be used inside a ToastProvider");
  return ctx;
}
