import React, { useState, useEffect, useCallback } from 'react';

let listeners = [];
let memoryToasts = [];

export function dispatchToast(toastItem) {
  const id = Math.random().toString(36).substring(2, 9);
  // Handle string argument or object argument
  let toastObj = typeof toastItem === 'string' ? { title: toastItem } : { ...toastItem };
  const newToast = {
    id,
    title: toastObj.title || '',
    description: toastObj.description || '',
    variant: toastObj.variant || 'default',
    duration: toastObj.duration || 3500
  };

  memoryToasts = [...memoryToasts, newToast];
  listeners.forEach((listener) => listener([...memoryToasts]));

  setTimeout(() => {
    memoryToasts = memoryToasts.filter((t) => t.id !== id);
    listeners.forEach((listener) => listener([...memoryToasts]));
  }, newToast.duration);

  return id;
}

export function toast(optionsOrTitle, description) {
  if (typeof optionsOrTitle === 'string') {
    return dispatchToast({ title: optionsOrTitle, description });
  }
  return dispatchToast(optionsOrTitle || {});
}

export function useToast() {
  const [toasts, setToasts] = useState(memoryToasts);

  useEffect(() => {
    listeners.push(setToasts);
    return () => {
      listeners = listeners.filter((l) => l !== setToasts);
    };
  }, []);

  const toastFn = useCallback((optionsOrTitle, description) => {
    return toast(optionsOrTitle, description);
  }, []);

  return {
    toast: toastFn,
    toasts,
    dismiss: (id) => {
      memoryToasts = memoryToasts.filter((t) => t.id !== id);
      listeners.forEach((listener) => listener([...memoryToasts]));
    }
  };
}

export function ToastContainer() {
  const { toasts } = useToast();

  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-5 right-5 z-50 flex flex-col gap-2 max-w-sm w-full pointer-events-none">
      {toasts.map((t) => (
        <div
          key={t.id}
          className="pointer-events-auto bg-slate-900 text-white p-4 rounded-2xl border border-slate-800 shadow-2xl flex items-start gap-3 fade-in"
        >
          <div className="flex-1">
            {t.title && <div className="font-bold text-[14px] text-white">{t.title}</div>}
            {t.description && <div className="text-[12.5px] text-slate-300 mt-0.5">{t.description}</div>}
          </div>
        </div>
      ))}
    </div>
  );
}
