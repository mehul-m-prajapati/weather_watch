import React from 'react';
import { Search } from 'lucide-react';

interface SearchBarProps {
  location: string;
  setLocation: (location: string) => void;
  onSearch: (e: React.FormEvent) => void;
  isDark: boolean;
}

export function SearchBar({ location, setLocation, onSearch, isDark }: SearchBarProps) {
  return (
    <form onSubmit={onSearch} className="relative w-full max-w-md ml-4">
      <input
        type="text"
        value={location}
        onChange={(e) => setLocation(e.target.value)}
        className={`w-full px-4 py-3 pl-12 rounded-lg transition-colors duration-200 ${
          isDark 
            ? 'bg-slate-800/50 backdrop-blur-md text-slate-100 placeholder-slate-400 border border-slate-700 focus:ring-sky-500/50' 
            : 'bg-white text-slate-900 placeholder-slate-500 border border-slate-200 focus:ring-sky-500'
        } focus:outline-none focus:ring-2`}
        placeholder="Search location..."
      />
      <Search className={`absolute left-4 top-3.5 h-5 w-5 ${isDark ? 'text-slate-400' : 'text-slate-500'}`} />
    </form>
  );
}