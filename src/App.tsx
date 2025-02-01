import React, { useState, useEffect } from 'react';
import { useTheme } from './ThemeContext';
import { WeatherData, ForecastData } from './types';
import { SearchBar } from './components/SearchBar';
import { ThemeToggle } from './components/ThemeToggle';
import { CurrentWeather } from './components/CurrentWeather';
import { Forecast } from './components/Forecast';


const API_KEY = import.meta.env.VITE_OPENWEATHER_API_KEY;
const BASE_URL = 'https://api.openweathermap.org/data/2.5';

function App() {
  const [location, setLocation] = useState('Montreal');
  const [activeTab, setActiveTab] = useState<'hourly' | 'daily'>('hourly');
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [forecast, setForecast] = useState<ForecastData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === 'dark';

  const fetchWeatherData = async (searchLocation: string) => {
    try {
      setLoading(true);
      setError(null);

      const weatherResponse = await fetch(
        `${BASE_URL}/weather?q=${searchLocation}&appid=${API_KEY}`
      );
      if (!weatherResponse.ok) throw new Error('City not found');
      const weatherData = await weatherResponse.json();

      const forecastResponse = await fetch(
        `${BASE_URL}/forecast?q=${searchLocation}&appid=${API_KEY}`
      );
      if (!forecastResponse.ok) throw new Error('Forecast data not available');
      const forecastData = await forecastResponse.json();

      setWeather(weatherData);
      setForecast(forecastData);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch weather data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWeatherData(location);
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    fetchWeatherData(location);
  };

  if (error) {
    return (
      <div className={`min-h-screen flex items-center justify-center ${
        isDark ? 'bg-slate-900 text-slate-100' : 'bg-blue-50 text-slate-900'
      }`}>
        <div className="text-center">
          <p className="text-xl mb-4">{error}</p>
          <button
            onClick={() => fetchWeatherData('London')}
            className="px-4 py-2 bg-sky-500 text-white rounded-lg hover:bg-sky-600"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen transition-colors duration-200 ${
      isDark
        ? 'bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900'
        : 'bg-gradient-to-br from-blue-50 via-white to-blue-50'
    }`}>
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <ThemeToggle isDark={isDark} toggleTheme={toggleTheme} />
          <SearchBar
            location={location}
            setLocation={setLocation}
            onSearch={handleSearch}
            isDark={isDark}
          />
        </div>

        {loading ? (
          <div className="flex items-center justify-center h-[calc(100vh-200px)]">
            <div className={`animate-spin rounded-full h-12 w-12 border-4 ${
              isDark ? 'border-slate-600 border-t-sky-400' : 'border-slate-200 border-t-sky-500'
            }`} />
          </div>
        ) : weather && forecast && (
          <>
            <CurrentWeather weather={weather} isDark={isDark} />
            <Forecast
              forecast={forecast}
              activeTab={activeTab}
              setActiveTab={setActiveTab}
              isDark={isDark}
            />
          </>
        )}
      </div>
    </div>
  );
}

export default App;
