'use client';

import { AnimatePresence, motion } from 'framer-motion';
import { Check, Info, X, AlertTriangle } from 'lucide-react';
import { createContext, useCallback, useContext, useMemo, useState } from 'react';
import { cn } from '@/lib/utils';

type ToastVariant = 'success' | 'error' | 'info';

type Toast = {
  id: number;
  title: string;
  description?: string;
  variant: ToastVariant;
};

type ToastContextValue = {
  toast: (input: { title: string; description?: string; variant?: ToastVariant }) => void;
};

const ToastContext = createContext<ToastContextValue | null>(null);

const icons = {
  success: Check,
  error: AlertTriangle,
  info: Info,
};

const accents: Record<ToastVariant, string> = {
  success: 'bg-gold-400 text-white',
  error: 'bg-rose-500 text-white',
  info: 'bg-charcoal-800 text-cream',
};

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const dismiss = useCallback((id: number) => {
    setToasts((current) => current.filter((t) => t.id !== id));
  }, []);

  const toast = useCallback<ToastContextValue['toast']>(
    ({ title, description, variant = 'success' }) => {
      const id = Date.now() + Math.random();
      setToasts((current) => [...current.slice(-2), { id, title, description, variant }]);
      setTimeout(() => dismiss(id), 3600);
    },
    [dismiss],
  );

  const value = useMemo(() => ({ toast }), [toast]);

  return (
    <ToastContext.Provider value={value}>
      {children}
      <div className="pointer-events-none fixed inset-x-0 bottom-5 z-[100] flex flex-col items-center gap-2 px-4 sm:bottom-auto sm:right-6 sm:top-24 sm:items-end sm:px-0">
        <AnimatePresence initial={false}>
          {toasts.map((item) => {
            const Icon = icons[item.variant];
            return (
              <motion.div
                key={item.id}
                layout
                initial={{ opacity: 0, y: 14, scale: 0.97 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -8, scale: 0.97 }}
                transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                className="pointer-events-auto flex w-full max-w-sm items-start gap-3 rounded-2xl border border-sand bg-white/95 p-4 shadow-lift backdrop-blur"
              >
                <span
                  className={cn(
                    'mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full',
                    accents[item.variant],
                  )}
                >
                  <Icon className="h-4 w-4" strokeWidth={2.5} />
                </span>
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium text-charcoal-900">{item.title}</p>
                  {item.description ? (
                    <p className="mt-0.5 truncate text-xs text-charcoal-400">{item.description}</p>
                  ) : null}
                </div>
                <button
                  type="button"
                  onClick={() => dismiss(item.id)}
                  aria-label="Dismiss notification"
                  className="text-charcoal-400 transition hover:text-charcoal-900"
                >
                  <X className="h-4 w-4" />
                </button>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) throw new Error('useToast must be used inside <ToastProvider>');
  return context;
}
