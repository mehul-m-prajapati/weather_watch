import React, { useState } from "react";
import { fetchWeather } from "./utils/weatherAPI";
import WeatherCard from "./components/WeatherCard";

function App() {
  const [city, setCity] = useState("");
  const [weatherData, setWeatherData] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSearch = async () => {
    if (!city) return;
    setLoading(true);
    setError("");
    try {
      const data = await fetchWeather(city);
      setWeatherData(data);
    } catch (err) {
      setError("City not found or API issue");
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-blue-50 flex flex-col items-center justify-center p-4">
      <h1 className="text-3xl font-bold mb-4">Weather Prediction</h1>
      <div className="mb-4">
        <input
          type="text"
          placeholder="Enter city"
          value={city}
          onChange={(e) => setCity(e.target.value)}
          className="border p-2 rounded-lg text-black"
        />
        <button
          onClick={handleSearch}
          className="ml-2 p-2 bg-blue-500 text-white rounded-lg"
        >
          Search
        </button>
      </div>
      {loading && <p>Loading...</p>}
      {error && <p className="text-red-500">{error}</p>}
      {weatherData && !loading && (
        <WeatherCard
          city={weatherData.name}
          temperature={weatherData.main.temp}
          description={weatherData.weather[0].description}
          icon={weatherData.weather[0].icon}
        />
      )}
    </div>
  );
}

export default App;
