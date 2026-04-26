"use client";

import { useEffect, useState } from "react";
import { Check, X, AlertCircle, Info } from "lucide-react";

export type ToastType = "success" | "error" | "info" | "warning";

interface ToastProps {
  message: string;
  type?: ToastType;
  duration?: number;
  onClose: () => void;
}

export function Toast({ message, type = "success", duration = 4000, onClose }: ToastProps) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    setTimeout(() => setVisible(true), 10);
    const timer = setTimeout(() => {
      setVisible(false);
      setTimeout(onClose, 300);
    }, duration);
    return () => clearTimeout(timer);
  }, []);

  const colors = {
    success: { bg: "#0a7070", icon: "#2dd4bf", border: "rgba(45,212,191,0.3)" },
    error: { bg: "#7f1d1d", icon: "#fca5a5", border: "rgba(239,68,68,0.3)" },
    info: { bg: "#021a1a", icon: "#2dd4bf", border: "rgba(45,212,191,0.2)" },
    warning: { bg: "#78350f", icon: "#fcd34d", border: "rgba(201,168,76,0.3)" },
  };

  const icons = {
    success: <Check size={16} color={colors[type].icon} />,
    error: <X size={16} color={colors[type].icon} />,
    info: <Info size={16} color={colors[type].icon} />,
    warning: <AlertCircle size={16} color={colors[type].icon} />,
  };

  return (
    <div style={{
      position: "fixed", bottom: 90, left: "50%",
      transform: `translateX(-50%) translateY(${visible ? 0 : 20}px)`,
      opacity: visible ? 1 : 0,
      transition: "all 0.3s ease",
      zIndex: 9999,
      background: colors[type].bg,
      border: `1px solid ${colors[type].border}`,
      borderRadius: 14,
      padding: "12px 20px",
      display: "flex", alignItems: "center", gap: 10,
      boxShadow: "0 8px 32px rgba(0,0,0,0.3)",
      maxWidth: "90vw",
      fontFamily: "DM Sans, sans-serif",
    }}>
      <div style={{ width: 28, height: 28, borderRadius: "50%", background: `${colors[type].border}`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
        {icons[type]}
      </div>
      <p style={{ color: "white", fontSize: 14, fontWeight: 500 }}>{message}</p>
      <button onClick={() => { setVisible(false); setTimeout(onClose, 300); }}
        style={{ background: "none", border: "none", cursor: "pointer", color: "rgba(255,255,255,0.5)", display: "flex", alignItems: "center", marginLeft: 4 }}>
        <X size={14} />
      </button>
    </div>
  );
}

// Toast Manager — добавь в layout или конкретные страницы
interface ToastItem {
  id: string;
  message: string;
  type: ToastType;
}

let addToastFn: ((msg: string, type?: ToastType) => void) | null = null;

export function showToast(message: string, type: ToastType = "success") {
  if (addToastFn) addToastFn(message, type);
}

export function ToastContainer() {
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  useEffect(() => {
    addToastFn = (message, type = "success") => {
      const id = Math.random().toString(36).slice(2);
      setToasts(prev => [...prev, { id, message, type }]);
    };
    return () => { addToastFn = null; };
  }, []);

  return (
    <div style={{ position: "fixed", bottom: 90, left: "50%", transform: "translateX(-50%)", zIndex: 9999, display: "flex", flexDirection: "column", gap: 8, alignItems: "center" }}>
      {toasts.map(toast => (
        <Toast key={toast.id} message={toast.message} type={toast.type}
          onClose={() => setToasts(prev => prev.filter(t => t.id !== toast.id))} />
      ))}
    </div>
  );
}