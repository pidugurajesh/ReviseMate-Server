import { createContext, useContext, useState, useCallback } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { CheckCircle, AlertCircle, Info, X } from "lucide-react";

const ToastContext = createContext(null);

export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);

  const addToast = useCallback((message, type = "success") => {
    const id = Math.random().toString(36).substring(2, 9);
    setToasts((prev) => [...prev, { id, message, type }]);

    // Auto dismiss after 3 seconds
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 3000);
  }, []);

  const removeToast = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  return (
    <ToastContext.Provider value={{ addToast, removeToast }}>
      {children}
      {/* Toast Portal Container */}
      <div className="fixed top-4 right-4 z-[9999] flex flex-col gap-2 w-full max-w-sm pointer-events-none">
        <AnimatePresence>
          {toasts.map((toast) => {
            const isSuccess = toast.type === "success";
            const isError = toast.type === "error";
            const isWarning = toast.type === "warning";

            let icon = <Info className="text-blue-500" size={18} />;
            let borderColor = "border-blue-500/50";
            let glowColor = "shadow-blue-500/10";
            if (isSuccess) {
              icon = <CheckCircle className="text-emerald-500" size={18} />;
              borderColor = "border-emerald-500/50";
              glowColor = "shadow-emerald-500/10";
            } else if (isError) {
              icon = <AlertCircle className="text-rose-500" size={18} />;
              borderColor = "border-rose-500/50";
              glowColor = "shadow-rose-500/10";
            } else if (isWarning) {
              icon = <AlertCircle className="text-amber-500" size={18} />;
              borderColor = "border-amber-500/50";
              glowColor = "shadow-amber-500/10";
            }

            return (
              <motion.div
                key={toast.id}
                layout
                initial={{ opacity: 0, x: 50, scale: 0.9 }}
                animate={{ opacity: 1, x: 0, scale: 1 }}
                exit={{ opacity: 0, x: 50, scale: 0.95 }}
                transition={{ type: "spring", stiffness: 350, damping: 25 }}
                className={`pointer-events-auto flex items-center justify-between gap-3 p-4 rounded-2xl border bg-white/95 dark:bg-slate-900/95 backdrop-blur-md shadow-lg ${glowColor} ${borderColor} border-l-4 border-l-current`}
              >
                <div className="flex items-center gap-2.5">
                  <div className="shrink-0">{icon}</div>
                  <p className="text-xs sm:text-sm font-semibold text-slate-800 dark:text-slate-100">
                    {toast.message}
                  </p>
                </div>
                <button
                  onClick={() => removeToast(toast.id)}
                  className="p-1 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors"
                >
                  <X size={14} />
                </button>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>
    </ToastContext.Provider>
  );
};

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error("useToast must be used within a ToastProvider");
  }
  return context;
};
