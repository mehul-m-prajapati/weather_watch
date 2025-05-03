import React, { useState, useEffect, useRef } from 'react';
import { Search } from 'lucide-react';
import { CityData } from '../types';
import { debounce } from '../utils';

interface SearchBarProps {
  location: string;
  setLocation: (location: string) => void;
  onSearch: (e: React.FormEvent) => void;
  isDark: boolean;
}

export function SearchBar({ location, setLocation, onSearch, isDark }: SearchBarProps) {
  const [suggestions, setSuggestions] = useState<CityData[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [inputValue, setInputValue] = useState(location);
  const suggestionsRef = useRef<HTMLDivElement>(null);

  // API endpoint for fetching city suggestions
  const GEOCODING_API_URL = "https://api.openweathermap.org/geo/1.0/direct";
  const API_KEY = import.meta.env.VITE_OPENWEATHER_API_KEY;

  // Function to fetch city suggestions
  const fetchCitySuggestions = async (query: string) => {
    if (query.trim().length < 2) {
      setSuggestions([]);
      return;
    }

    try {
      const response = await fetch(
        `${GEOCODING_API_URL}?q=${query}&limit=5&appid=${API_KEY}`
      );
      
      if (!response.ok) {
        throw new Error('Failed to fetch suggestions');
      }
      
      const data = await response.json();
      setSuggestions(data);
    } catch (error) {
      console.error('Error fetching suggestions:', error);
      setSuggestions([]);
    }
  };

  // Create a debounced version of the fetch function (300ms delay)
  const debouncedFetchSuggestions = debounce(fetchCitySuggestions, 300);

  // Handle input change
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setInputValue(value);
    
    if (value.trim()) {
      debouncedFetchSuggestions(value);
      setShowSuggestions(true);
    } else {
      setSuggestions([]);
      setShowSuggestions(false);
    }
  };

  // Handle suggestion selection
  const handleSuggestionClick = (city: CityData) => {
    const cityName = city.name;
    setInputValue(cityName);
    setLocation(cityName);
    setSuggestions([]);
    setShowSuggestions(false);
    
    // Trigger search with the selected city
    const formEvent = new Event('submit') as unknown as React.FormEvent;
    onSearch(formEvent);
  };

  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLocation(inputValue);
    setShowSuggestions(false);
    onSearch(e);
  };

  // Close suggestions when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (suggestionsRef.current && !suggestionsRef.current.contains(event.target as Node)) {
        setShowSuggestions(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Update input value when location prop changes
  useEffect(() => {
    setInputValue(location);
  }, [location]);

  return (
    <div className="relative w-full max-w-md ml-4" ref={suggestionsRef}>
      <form onSubmit={handleSubmit} className="relative w-full">
        <input
          type="text"
          value={inputValue}
          onChange={handleInputChange}
          className={`w-full px-4 py-3 pl-12 rounded-lg transition-colors duration-200 ${
            isDark 
              ? 'bg-slate-800/50 backdrop-blur-md text-slate-100 placeholder-slate-400 border border-slate-700 focus:ring-sky-500/50' 
              : 'bg-white text-slate-900 placeholder-slate-500 border border-slate-200 focus:ring-sky-500'
          } focus:outline-none focus:ring-2`}
          placeholder="Search location..."
        />
        <Search className={`absolute left-4 top-3.5 h-5 w-5 ${isDark ? 'text-slate-400' : 'text-slate-500'}`} />
      </form>

      {/* City suggestions dropdown */}
      {showSuggestions && suggestions.length > 0 && (
        <div className={`absolute z-10 w-full mt-1 overflow-hidden rounded-lg shadow-lg ${
          isDark ? 'bg-slate-800 border border-slate-700' : 'bg-white border border-slate-200'
        }`}>
          <ul>
            {suggestions.map((city, index) => (
              <li 
                key={`${city.name}-${city.country}-${index}`}
                onClick={() => handleSuggestionClick(city)}
                className={`px-4 py-2 cursor-pointer ${
                  isDark 
                    ? 'hover:bg-slate-700 text-slate-100' 
                    : 'hover:bg-slate-100 text-slate-900'
                }`}
              >
                {city.name}{city.state ? `, ${city.state}` : ''}, {city.country}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}