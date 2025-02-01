import React from 'react';
import { Sun, Moon } from 'lucide-react';

interface ThemeToggleProps {
  isDark: boolean;
  toggleTheme: () => void;
}

export function ThemeToggle({ isDark, toggleTheme }: ThemeToggleProps) {
  return (
    <button
      onClick={toggleTheme}
      className={`p-2 rounded-lg ${
        isDark 
          ? 'bg-slate-800/50 text-yellow-400 hover:bg-slate-700/50' 
          : 'bg-white text-slate-700 hover:bg-slate-100'
      } transition-colors duration-200`}
    >
      {isDark ? <Sun className="h-6 w-6" /> : <Moon className="h-6 w-6" />}
    </button>
  );
}