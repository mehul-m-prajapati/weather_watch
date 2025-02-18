import React from "react";

interface WeatherCardProps {
  city: string;
  temperature: number;
  description: string;
  icon: string;
}

const WeatherCard: React.FC<WeatherCardProps> = ({
  city,
  temperature,
  description,
  icon,
}) => {
  return (
    <div className="bg-blue-100 p-6 rounded-lg shadow-lg text-center max-w-sm mx-auto">
      <h2 className="text-2xl font-bold">{city}</h2>
      <img
        src={`http://openweathermap.org/img/wn/${icon}@2x.png`}
        alt={description}
        className="mx-auto my-4"
      />
      <p className="text-xl">{temperature}°C</p>
      <p className="text-md text-gray-700">{description}</p>
    </div>
  );
};

export default WeatherCard;
