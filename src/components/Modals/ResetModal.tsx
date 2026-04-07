import { motion } from 'motion/react';
import { X } from 'lucide-react';

interface ResetModalProps {
  onReset: () => void;
  onClose: () => void;
}

export function ResetModal({ onReset, onClose }: ResetModalProps) {
  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[110] flex items-center justify-center p-4" onClick={onClose}>
      <motion.div 
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        onClick={(e) => e.stopPropagation()}
        className="bg-white rounded-3xl shadow-2xl w-full max-w-md overflow-hidden"
      >
        <div className="p-8 text-center">
          <div className="w-20 h-20 bg-red-100 text-red-600 rounded-full flex items-center justify-center mx-auto mb-6">
            <X size={40} strokeWidth={3} />
          </div>
          <h3 className="text-2xl font-bold text-slate-900 mb-2">Reset All Data?</h3>
          <p className="text-slate-500 mb-8">
            This will permanently delete all matches, fund transactions, and reset member statistics. This action cannot be undone.
          </p>
          <div className="flex gap-4">
            <button 
              onClick={onClose}
              className="flex-1 py-3 rounded-xl font-bold text-slate-600 bg-slate-100 hover:bg-slate-200 transition-colors"
            >
              Cancel
            </button>
            <button 
              onClick={onReset}
              className="flex-1 py-3 rounded-xl font-bold text-white bg-red-600 hover:bg-red-700 transition-colors"
            >
              Yes, Reset
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
