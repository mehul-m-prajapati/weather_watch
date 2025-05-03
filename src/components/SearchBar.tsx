import debounce from 'lodash.debounce';
import { Search } from 'lucide-react';
import React, { useEffect, useMemo, useRef, useState } from 'react';

interface Suggestion {
  name: string;
  country: string;
  state?: string;
}

interface SearchBarProps {
  onSearch: (location: string) => void;
  isDark: boolean;
}

export function SearchBar({ onSearch, isDark }: SearchBarProps) {
  const [input, setInput] = useState('');
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const containerRef = useRef<HTMLDivElement>(null);

  const fetchSuggestions = async (query: string) => {
    const encodedQuery = encodeURIComponent(query.trim());

    try {
      const res = await fetch(
        `https://api.openweathermap.org/geo/1.0/direct?q=${encodedQuery}&limit=5&appid=${import.meta.env.VITE_OPENWEATHER_API_KEY}`
      );

      if (!res.ok) throw new Error(`API Error: ${res.status}`);
      const data = await res.json();
      setSuggestions(data);
    } catch (error) {
      console.error('Failed to fetch suggestions:', error);
      setSuggestions([]);
    }
  };

  // Stable debounced function (created only once)
  const debouncedFetch = useMemo(() => debounce(fetchSuggestions, 300), []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setInput(value);

    if (!value.trim()) {
      setSuggestions([]);
      debouncedFetch.cancel();
      return;
    }

    debouncedFetch(value);
  };

  const handleSuggestionClick = (s: Suggestion) => {
    const formatted = `${s.name}${s.state ? `, ${s.state}` : ''}, ${s.country}`;
    setInput(formatted);
    setSuggestions([]);
    onSearch(formatted);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = input.trim();
    if (!trimmed) return;
    setSuggestions([]);
    onSearch(trimmed);
  };

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setSuggestions([]);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      debouncedFetch.cancel(); // cancel on unmount
    };
  }, [debouncedFetch]);

  return (
    <div ref={containerRef} className="relative w-full max-w-md ml-4">
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={input}
          onChange={handleInputChange}
          placeholder="Search location..."
          className={`w-full px-4 py-3 pl-12 rounded-lg transition-colors duration-200 ${
            isDark
              ? 'bg-slate-800/50 backdrop-blur-md text-slate-100 placeholder-slate-400 border border-slate-700 focus:ring-sky-500/50'
              : 'bg-white text-slate-900 placeholder-slate-500 border border-slate-200 focus:ring-sky-500'
          } focus:outline-none focus:ring-2`}
          aria-label="Search location"
          autoComplete="off"
        />
        <Search className={`absolute left-4 top-3.5 h-5 w-5 ${isDark ? 'text-slate-400' : 'text-slate-500'}`} />
      </form>

      {suggestions.length > 0 && (
        <ul
          className={`absolute z-10 w-full mt-2 rounded-lg shadow-lg max-h-64 overflow-y-auto ${
            isDark ? 'bg-slate-700 text-white' : 'bg-white text-black'
          }`}
          role="listbox"
        >
          {suggestions.map((s, i) => (
            <li
              key={`${s.name}-${s.state ?? ''}-${s.country}-${i}`}
              onClick={() => handleSuggestionClick(s)}
              className="px-4 py-2 cursor-pointer hover:bg-sky-500 hover:text-white"
              role="option"
            >
              {s.name}{s.state ? `, ${s.state}` : ''}, {s.country}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
