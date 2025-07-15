import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Loader2, X } from 'lucide-react';

export default function AISuggestionsModal({ open, onClose, suggestions, onSelect, loading, section }) {
  const [editingIndex, setEditingIndex] = useState(null);
  const [editValue, setEditValue] = useState('');

  const handleEdit = (idx, value) => {
    setEditingIndex(idx);
    setEditValue(value);
  };
  const handleCancel = () => {
    setEditingIndex(null);
    setEditValue('');
  };
  const handleSave = () => {
    if (editValue.trim()) {
      onSelect(editValue);
      setEditingIndex(null);
      setEditValue('');
    }
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        >
          <motion.div
            className="relative bg-white dark:bg-zinc-900 rounded-2xl shadow-2xl max-w-lg w-full mx-4 p-6 flex flex-col gap-4 overflow-y-auto max-h-[80vh] scrollbar-thin scrollbar-thumb-cyan-400 scrollbar-track-cyan-100/30 dark:scrollbar-track-zinc-800/40"
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            onClick={e => e.stopPropagation()}
          >
            <button className="absolute top-3 right-3 text-gray-400 hover:text-red-500" onClick={onClose}>
              <X className="w-5 h-5" />
            </button>
            <h2 className="text-xl font-bold text-cyan-600 mb-2 text-center">
              AI Suggestions for {section.charAt(0).toUpperCase() + section.slice(1)}
            </h2>
            {loading ? (
              <div className="flex flex-col items-center justify-center py-12">
                <Loader2 className="w-8 h-8 animate-spin text-cyan-500 mb-2" />
                <span className="text-gray-500 dark:text-gray-300">Generating suggestions...</span>
              </div>
            ) : (
              <div className="flex flex-col gap-4">
                {suggestions && suggestions.length > 0 ? suggestions.map((s, i) => (
                  <div key={i} className="rounded-xl border border-cyan-200 dark:border-cyan-800 bg-cyan-50/60 dark:bg-zinc-800/60 p-4 flex flex-col gap-2 shadow">
                    {editingIndex === i ? (
                      <>
                        <textarea
                          className="w-full min-h-[80px] rounded-lg border border-cyan-300 dark:border-cyan-700 bg-white dark:bg-zinc-900 p-2 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-cyan-400 focus:outline-none resize-vertical mb-2"
                          value={editValue}
                          onChange={e => setEditValue(e.target.value)}
                          autoFocus
                        />
                        <div className="flex gap-2 justify-end">
                          <button
                            className="px-4 py-1 rounded-lg bg-cyan-600 text-white font-semibold hover:bg-cyan-700 focus:ring-2 focus:ring-cyan-400 focus:outline-none transition-all"
                            onClick={handleSave}
                          >
                            Save & Use
                          </button>
                          <button
                            className="px-3 py-1 rounded-lg bg-gray-200 dark:bg-zinc-700 text-gray-700 dark:text-gray-200 font-semibold hover:bg-gray-300 dark:hover:bg-zinc-600 focus:ring-2 focus:ring-cyan-400 focus:outline-none transition-all"
                            onClick={handleCancel}
                          >
                            Cancel
                          </button>
                        </div>
                      </>
                    ) : (
                      <>
                        <div className="text-gray-800 dark:text-gray-100 whitespace-pre-line text-sm">{s}</div>
                        <div className="flex gap-2 justify-end mt-2">
                          <button
                            className="px-4 py-1 rounded-lg bg-cyan-600 text-white font-semibold hover:bg-cyan-700 focus:ring-2 focus:ring-cyan-400 focus:outline-none transition-all"
                            onClick={() => onSelect(s)}
                          >
                            Use this
                          </button>
                          <button
                            className="px-3 py-1 rounded-lg bg-cyan-100 text-cyan-700 font-semibold hover:bg-cyan-200 focus:ring-2 focus:ring-cyan-400 focus:outline-none transition-all"
                            onClick={() => handleEdit(i, s)}
                          >
                            Edit
                          </button>
                        </div>
                      </>
                    )}
                  </div>
                )) : (
                  <div className="text-gray-500 text-center">No suggestions available.</div>
                )}
              </div>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
} 