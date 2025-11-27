import { useEffect, useState } from "react";
import WeatherSearch from "./components/WeatherSearch.jsx";
import WeatherCard from "./components/WeatherCard.jsx";

const API_BASE_URL = "https://api.openweathermap.org/data/2.5/weather";
const FORECAST_URL = "https://api.openweathermap.org/data/2.5/forecast";

const USE_LOCAL_JSON = false;

function App() {
  const [searchTerm, setSearchTerm] = useState("Toronto");
  const [city, setCity] = useState("Toronto");
  const [weatherData, setWeatherData] = useState(null);
  const [forecastDays, setForecastDays] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const apiKey = import.meta.env.VITE_OPENWEATHER_API_KEY;

  useEffect(() => {
    if (!city) return;
    fetchWeather(city);
  }, [city]);

  const processForecast = (forecastJson) => {
    
    const byDate = {};
    forecastJson.list.forEach((item) => {
      const date = item.dt_txt.split(" ")[0]; 
      if (!byDate[date]) byDate[date] = [];
      byDate[date].push(item);
    });

    const dates = Object.keys(byDate).sort();
    if (dates.length === 0) return [];

    
    const nextDates = dates.slice(1, 6);

    return nextDates.map((date) => {
      const bucket = byDate[date];
      const mid = Math.floor(bucket.length / 2);
      const sample = bucket[mid];

      const d = new Date(date);
      const weekdayShort = d.toLocaleDateString(undefined, {
        weekday: "short",
      });

      return {
        date,
        weekdayShort,
        temp: sample.main.temp,
        iconCode: sample.weather?.[0]?.icon,
        description: sample.weather?.[0]?.description,
      };
    });
  };

  const fetchWeather = async (cityName) => {
    try {
      setIsLoading(true);
      setError("");
      setWeatherData(null);
      setForecastDays([]);

      if (USE_LOCAL_JSON) {
       
        const response = await fetch("/weather_api_output.json");
        if (!response.ok) {
          throw new Error("Failed to load local weather data.");
        }
        const data = await response.json();
        setWeatherData(data);
        setForecastDays([]); 
        return;
      }

      const currentUrl = `${API_BASE_URL}?q=${encodeURIComponent(
        cityName
      )}&appid=${apiKey}&units=metric`;

      const forecastUrl = `${FORECAST_URL}?q=${encodeURIComponent(
        cityName
      )}&appid=${apiKey}&units=metric`;

      const [currentRes, forecastRes] = await Promise.all([
        fetch(currentUrl),
        fetch(forecastUrl),
      ]);

      if (!currentRes.ok) {
        if (currentRes.status === 404) {
          throw new Error("City not found. Please try again.");
        }
        throw new Error("Failed to fetch current weather.");
      }

      if (!forecastRes.ok) {
        throw new Error("Failed to fetch forecast data.");
      }

      const currentData = await currentRes.json();
      const forecastJson = await forecastRes.json();

      setWeatherData(currentData);
      setForecastDays(processForecast(forecastJson));
    } catch (err) {
      setError(err.message || "Something went wrong.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearchSubmit = () => {
    if (!searchTerm.trim()) return;
    setCity(searchTerm.trim());
  };

  return (
    <div className="app">
      <div className="app-container">
        <header className="app-header">
          <h1>Weather Forecast</h1>
          <p>Today&apos;s weather and the next 5 days</p>
        </header>

        <WeatherSearch
          value={searchTerm}
          onChange={setSearchTerm}
          onSearch={handleSearchSubmit}
        />

        {isLoading && <p className="status-message">Loading...</p>}

        {error && <p className="status-message error">{error}</p>}

        {!isLoading && !error && weatherData && (
          <WeatherCard
            cityName={weatherData.name}
            country={weatherData.sys?.country}
            temperature={weatherData.main?.temp}
            feelsLike={weatherData.main?.feels_like}
            description={weatherData.weather?.[0]?.description}
            iconCode={weatherData.weather?.[0]?.icon}
            humidity={weatherData.main?.humidity}
            windSpeed={weatherData.wind?.speed}
            forecastDays={forecastDays}
          />
        )}

        {!isLoading && !error && !weatherData && (
          <p className="status-message">Search for a city to see the weather.</p>
        )}

        <footer className="app-footer">
          <small>
            Data from{" "}
            <a
              href="https://openweathermap.org"
              target="_blank"
              rel="noreferrer"
            >
              OpenWeatherMap
            </a>
            {USE_LOCAL_JSON && " (using local sample JSON for this build)"}
          </small>
        </footer>
      </div>
    </div>
  );
}

export default App;
