import { Cloud, Sun, CloudRain, CloudDrizzle, CloudLightning, CloudSnow } from 'lucide-react';

export function getWeatherIcon(condition: string) {
  switch (condition.toLowerCase()) {
    case 'clear':
      return Sun;
    case 'clouds':
      return Cloud;
    case 'rain':
      return CloudRain;
    case 'drizzle':
      return CloudDrizzle;
    case 'thunderstorm':
      return CloudLightning;
    case 'snow':
      return CloudSnow;
    default:
      return Cloud;
  }
}

interface WeatherIconProps {
  condition: string;
  className?: string;
}

export function WeatherIcon({ condition, className = '' }: WeatherIconProps) {
  const Icon = getWeatherIcon(condition);
  return <Icon className={className} />;
}