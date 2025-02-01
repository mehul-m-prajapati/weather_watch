import React from 'react';
import { MapPin, Wind, Droplets, Thermometer } from 'lucide-react';
import { format, fromUnixTime } from 'date-fns';
import { WeatherData } from '../types';
import { kelvinToCelsius } from '../utils';

interface CurrentWeatherProps {
  weather: WeatherData;
  isDark: boolean;
}

export function CurrentWeather({ weather, isDark }: CurrentWeatherProps) {
  return (
    <div className={`transition-colors duration-200 rounded-xl p-8 mb-8 ${
      isDark 
        ? 'bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-md border border-slate-700/50' 
        : 'bg-white border border-slate-200 shadow-lg'
    }`}>
      <div className="flex items-center justify-between mb-6">
        <div>
          <div className="flex items-center">
            <MapPin className={`h-5 w-5 mr-2 ${isDark ? 'text-sky-400' : 'text-sky-500'}`} />
            <h2 className={`text-2xl font-bold ${isDark ? 'text-slate-100' : 'text-slate-900'}`}>
              {weather.name}
            </h2>
          </div>
          <p className={isDark ? 'text-slate-400' : 'text-slate-600'}>
            {format(fromUnixTime(weather.dt), 'EEEE, MMMM d')}
          </p>
        </div>
        <div className="text-right">
          <div className={`text-5xl font-bold ${isDark ? 'text-slate-100' : 'text-slate-900'}`}>
            {kelvinToCelsius(weather.main.temp)}°C
          </div>
          <p className={isDark ? 'text-slate-400' : 'text-slate-600'}>
            {weather.weather[0].description}
          </p>
        </div>
      </div>
      <div className="grid grid-cols-3 gap-4">
        {[
          { icon: Wind, label: 'Wind', value: `${Math.round(weather.wind.speed * 3.6)} km/h` },
          { icon: Droplets, label: 'Humidity', value: `${weather.main.humidity}%` },
          { icon: Thermometer, label: 'Feels like', value: `${kelvinToCelsius(weather.main.feels_like)}°C` },
        ].map((item, index) => (
          <div key={index} className={`flex items-center rounded-lg p-4 transition-colors duration-200 ${
            isDark 
              ? 'bg-slate-800/30 border border-slate-700/50' 
              : 'bg-slate-50 border border-slate-200'
          }`}>
            <item.icon className={`h-6 w-6 mr-3 ${isDark ? 'text-sky-400' : 'text-sky-500'}`} />
            <div>
              <p className={isDark ? 'text-slate-400' : 'text-slate-600'}>{item.label}</p>
              <p className={`font-semibold ${isDark ? 'text-slate-100' : 'text-slate-900'}`}>{item.value}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}