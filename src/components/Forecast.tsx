import { Clock, Calendar } from 'lucide-react';
import { format, fromUnixTime } from 'date-fns';
import { ForecastData } from '../types';
import { WeatherIcon } from './WeatherIcon';
// Remove unused import since WeatherChart component is commented out
import { kelvinToCelsius } from '../utils';
import useAnimatedValue from '../hooks/useAnimatedValue';

interface ForecastProps {
  forecast: ForecastData;
  activeTab: 'hourly' | 'daily';
  setActiveTab: (tab: 'hourly' | 'daily') => void;
  isDark: boolean;
}

export function Forecast({ forecast, activeTab, setActiveTab, isDark }: ForecastProps) {
  // Extract hourly forecast items for animation
  const hourlyItems = forecast.list.map(item => {
    const temp = kelvinToCelsius(item.main.temp);
    return {
      ...item,
      animatedTemp: useAnimatedValue(temp, 1000, 1)
    };
  });
  
  // Extract daily forecast items for animation
  const dailyItems = forecast.list
    .filter((_, index) => index % 8 === 0)
    .map(item => {
      const tempMax = kelvinToCelsius(item.main.temp_max);
      const tempMin = kelvinToCelsius(item.main.temp_min);
      return {
        ...item,
        animatedTempMax: useAnimatedValue(tempMax, 1000, 1),
        animatedTempMin: useAnimatedValue(tempMin, 1000, 1)
      };
    });
  return (
    <div className={`transition-colors duration-200 rounded-xl p-6 mb-8 ${
      isDark
        ? 'bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-md border border-slate-700/50'
        : 'bg-white border border-slate-200 shadow-lg'
    }`}>
      <div className="flex space-x-4 mb-6">
        {[
          { id: 'hourly', icon: Clock, label: 'Hourly' },
          { id: 'daily', icon: Calendar, label: 'Daily' },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as 'hourly' | 'daily')}
            className={`flex items-center px-4 py-2 rounded-lg transition-colors duration-200 ${
              activeTab === tab.id
                ? isDark
                  ? 'bg-sky-500/20 text-sky-400 border border-sky-500/30'
                  : 'bg-sky-50 text-sky-600 border border-sky-200'
                : isDark
                  ? 'text-slate-400 hover:text-slate-300'
                  : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <tab.icon className="h-4 w-4 mr-2" />
            {tab.label}
          </button>
        ))}
      </div>

      {activeTab === 'hourly' ? (
        <div className="flex space-x-6 overflow-x-auto pb-4">
          {hourlyItems.map((item, index) => (
            <div key={index} className="flex flex-col items-center min-w-[80px]">
              <p className={isDark ? 'text-slate-400' : 'text-slate-600'}>
                {index === 0 ? 'Now' : format(fromUnixTime(item.dt), 'HH:mm')}
              </p>
              <WeatherIcon
                condition={item.weather[0].main}
                className={`h-8 w-8 my-2 ${isDark ? 'text-sky-400' : 'text-sky-500'}`}
              />
              <p className={`font-semibold ${isDark ? 'text-slate-100' : 'text-slate-900'} transition-all duration-700 ease-out transform hover:scale-110`}>
                {item.animatedTemp}°
              </p>
            </div>
          ))}
        </div>
      ) : (
        <div>
         {/* <WeatherChart forecast={forecast} isDark={isDark} /> */}
          <div className="space-y-4">
            {dailyItems.map((item, index) => (
                <div key={index} className={`flex items-center justify-between py-2 border-b ${
                  isDark ? 'border-slate-700/50' : 'border-slate-200'
                } last:border-0`}>
                  <p className={`w-48 ${isDark ? 'text-slate-100' : 'text-slate-900'}`}>
                    {format(fromUnixTime(item.dt), 'EEE, M/dd')}
                  </p>
                  <WeatherIcon
                    condition={item.weather[0].main}
                    className={`h-6 w-6 ${isDark ? 'text-sky-400' : 'text-sky-500'}`}
                  />
                  <div className="flex space-x-4">
                    <span className={`font-semibold ${isDark ? 'text-slate-100' : 'text-slate-900'} transition-all duration-700 ease-out transform hover:scale-110`}>
                      {item.animatedTempMax}°
                    </span>
                    <span className={`${isDark ? 'text-slate-400' : 'text-slate-600'} transition-all duration-700 ease-out`}>
                      {item.animatedTempMin}°
                    </span>
                  </div>
                </div>
              ))}
          </div>
        </div>
      )}
    </div>
  );
}
