'use client';

import { X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function Modal({
  open,
  onClose,
  title,
  children,
}: {
  open: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4"
          onClick={onClose}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.96, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: 10 }}
            onClick={(e) => e.stopPropagation()}
            className="glass-panel max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-2xl p-6"
          >
            <div className="flex items-center justify-between">
              <h3 className="font-display text-lg font-semibold text-ink-100">{title}</h3>
              <button onClick={onClose} className="text-ink-500 hover:text-ink-100">
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="mt-5">{children}</div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
