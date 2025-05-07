import { useState } from 'react';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { History, Calendar } from 'lucide-react';
import { format, fromUnixTime } from 'date-fns';
import { ForecastData } from '../types';
import { kelvinToCelsius } from '../utils';

interface WeatherTrendsProps {
  forecast: ForecastData;
  isDark: boolean;
}

const generateChartData = (forecastList: any[], timeframe: 'daily' | 'weekly') => {
  if (!forecastList) return [];
  
  if (timeframe === 'daily') {
    // Show next 5 3-hour intervals
    return forecastList.slice(0, 5).map(item => ({
      time: item.dt,
      temp: kelvinToCelsius(item.main.temp),
      precip: item.pop * 100,
      wind: item.wind.speed * 3.6,
      humidity: item.main.humidity,
    }));
  }

  // Weekly view: 5 daily points
  return forecastList
    .filter((_, index) => index % 8 === 0)
    .slice(0, 5)
    .map(item => ({
      date: item.dt,
      temp: kelvinToCelsius(item.main.temp),
      precip: item.pop * 100,
      wind: item.wind.speed * 3.6,
      humidity: item.main.humidity,
    }));
};

export function WeatherTrends({ forecast, isDark }: WeatherTrendsProps) {
  const [timeframe, setTimeframe] = useState<'daily' | 'weekly'>('daily');
  const chartData = generateChartData(forecast?.list || [], timeframe);

  const chartConfigs = [
    { id: 'temp', title: 'Temperature', unit: '°C', dataKey: 'temp', color: '#f59e0b' },
    { id: 'precip', title: 'Precipitation', unit: '%', dataKey: 'precip', color: '#3b82f6' },
    { id: 'wind', title: 'Wind Speed', unit: 'km/h', dataKey: 'wind', color: '#10b981' },
    { id: 'humidity', title: 'Humidity', unit: '%', dataKey: 'humidity', color: '#8b5cf6' }
  ];

  return (
    <div className={`transition-colors duration-200 rounded-xl p-6 mb-8 ${
      isDark
        ? 'bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-md border border-slate-700/50'
        : 'bg-white border border-slate-200 shadow-lg'
    }`}>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
        <div className="flex space-x-4">
          <button
            disabled
            className={`flex items-center px-4 py-2 rounded-lg transition-colors duration-200 ${
              isDark
                ? 'bg-slate-700/30 text-slate-500 border border-slate-600 cursor-not-allowed'
                : 'bg-slate-100 text-slate-400 border border-slate-200 cursor-not-allowed'
            }`}
          >
            <History className="h-4 w-4 mr-2" />
            Historical
          </button>
          <button
            className={`flex items-center px-4 py-2 rounded-lg transition-colors duration-200 ${
              isDark
                ? 'bg-sky-500/20 text-sky-400 border border-sky-500/30'
                : 'bg-sky-50 text-sky-600 border border-sky-200'
            }`}
          >
            <Calendar className="h-4 w-4 mr-2" />
            Forecast
          </button>
        </div>

        <div className="flex items-center gap-2">
          <select
            value={timeframe}
            onChange={(e) => setTimeframe(e.target.value as 'daily' | 'weekly')}
            className={`text-sm rounded-md px-3 py-1.5 ${
              isDark 
                ? 'bg-slate-700/50 border border-slate-600 text-slate-200'
                : 'bg-white border border-slate-200 text-slate-900'
            }`}
          >
            <option value="daily">Daily</option>
            <option value="weekly">Weekly</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {chartConfigs.map((config) => (
          <div key={config.id} className={`p-4 rounded-lg ${
            isDark ? 'bg-slate-800/30' : 'bg-slate-50'
          }`}>
            <div className="flex justify-between items-center mb-4">
              <h3 className={`font-semibold ${isDark ? 'text-slate-100' : 'text-slate-900'}`}>
                {config.title}
              </h3>
            </div>

            <ResponsiveContainer width="100%" height={200}>
              <LineChart data={chartData}>
                <XAxis
                  dataKey={timeframe === 'daily' ? 'time' : 'date'}
                  stroke={isDark ? '#94a3b8' : '#64748b'}
                  tickFormatter={(value) => timeframe === 'daily' 
                    ? format(fromUnixTime(value), 'HH:mm')
                    : format(fromUnixTime(value), 'EEE')}
                  tick={{ fontSize: 12 }}
                />
                <YAxis
                  stroke={isDark ? '#94a3b8' : '#64748b'}
                  tick={{ fontSize: 12 }}
                  unit={config.unit}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: isDark ? '#1e293b' : 'white',
                    border: isDark ? '1px solid #334155' : '1px solid #e2e8f0',
                    borderRadius: '8px',
                  }}
                  labelFormatter={(label) => 
                    timeframe === 'daily'
                      ? format(fromUnixTime(label), 'eee, MMM dd HH:mm')
                      : format(fromUnixTime(label), 'eee, MMM dd')
                  }
                  formatter={(value) => [`${Math.round(Number(value))}${config.unit}`, config.title]}
                />
                <Line
                  type="monotone"
                  dataKey={config.dataKey}
                  stroke={config.color}
                  strokeWidth={2}
                  dot={false}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        ))}
      </div>
    </div>
  );
}