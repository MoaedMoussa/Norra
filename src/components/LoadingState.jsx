import React from 'react';
import { motion } from 'framer-motion';
import { Bot } from 'lucide-react';

export default function LoadingState({ message = 'Loading...', fullScreen = false }) {
  const content = (
    <div className="flex flex-col items-center justify-center space-y-4 p-8">
      <div className="relative flex items-center justify-center w-16 h-16">
        {/* Outer pulsing ring */}
        <motion.div
          className="absolute inset-0 rounded-full border border-blue-500/30 bg-blue-50/50"
          animate={{ scale: [1, 1.2, 1], opacity: [0.5, 0, 0.5] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
        />
        {/* Inner bouncing icon */}
        <motion.div
          className="relative z-10 w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center text-sports-text shadow-lg shadow-blue-900/20"
          animate={{ y: [0, -5, 0] }}
          transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
        >
          <Bot size={20} />
        </motion.div>
      </div>
      <motion.p
        className="text-xs font-semibold text-slate-500 tracking-wider uppercase font-mono"
        animate={{ opacity: [0.5, 1, 0.5] }}
        transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
      >
        {message}
      </motion.p>
    </div>
  );

  if (fullScreen) {
    return (
      <div className="flex-1 flex items-center justify-center w-full min-h-[60vh]">
        {content}
      </div>
    );
  }

  return content;
}
