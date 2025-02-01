import React, { useEffect, useRef } from 'react';
import { createChart, ColorType } from 'lightweight-charts';
import { format, fromUnixTime } from 'date-fns';
import { ForecastData } from '../types';
import { kelvinToCelsius } from '../utils';

interface WeatherChartProps {
  forecast: ForecastData;
  isDark: boolean;
}

export function WeatherChart({ forecast, isDark }: WeatherChartProps) {
  const chartContainerRef = useRef<HTMLDivElement>(null);
  const chartRef = useRef<any>(null);

  useEffect(() => {
    if (chartContainerRef.current && forecast) {
      const dailyData = forecast.list
        .filter((item, index) => index % 8 === 0)
        .map(item => ({
          time: format(fromUnixTime(item.dt), 'yyyy-MM-dd'),
          value: kelvinToCelsius(item.main.temp),
        }));

      const chart = createChart(chartContainerRef.current, {
        layout: {
          background: { type: ColorType.Solid, color: 'transparent' },
          textColor: isDark ? '#94a3b8' : '#475569',
        },
        grid: {
          vertLines: { color: isDark ? '#334155' : '#e2e8f0' },
          horzLines: { color: isDark ? '#334155' : '#e2e8f0' },
        },
        width: chartContainerRef.current.clientWidth,
        height: 300,
      });

      const lineSeries = chart.addLineSeries({
        color: '#38bdf8',
        lineWidth: 2,
      });

      lineSeries.setData(dailyData);
      chartRef.current = chart;

      const handleResize = () => {
        if (chartContainerRef.current) {
          chart.applyOptions({
            width: chartContainerRef.current.clientWidth,
          });
        }
      };

      window.addEventListener('resize', handleResize);

      return () => {
        window.removeEventListener('resize', handleResize);
        chart.remove();
      };
    }
  }, [isDark, forecast]);

  return <div ref={chartContainerRef} className="mb-6" />;
}