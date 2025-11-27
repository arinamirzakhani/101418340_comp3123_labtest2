import { useEffect, useState } from "react";
import WeatherSearch from "./components/WeatherSearch.jsx";
import WeatherCard from "./components/WeatherCard.jsx";

const API_BASE_URL = "https://api.openweathermap.org/data/2.5/weather";

const USE_LOCAL_JSON = false;

function App() {
  const [searchTerm, setSearchTerm] = useState("Toronto");
  const [city, setCity] = useState("Toronto");
  const [weatherData, setWeatherData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const apiKey = import.meta.env.VITE_OPENWEATHER_API_KEY;


  useEffect(() => {
    if (!city) return;
    fetchWeather(city);
  }, [city]);

  const fetchWeather = async (cityName) => {
    try {
      setIsLoading(true);
      setError("");
      setWeatherData(null);

      let response;

      if (USE_LOCAL_JSON) {
        
        response = await fetch("/weather_api_output.json");
      } else {
       
        const url = `${API_BASE_URL}?q=${encodeURIComponent(
          cityName
        )}&appid=${apiKey}&units=metric`;

        response = await fetch(url);
      }

      if (!response.ok) {
        if (response.status === 404) {
          throw new Error("City not found. Please try again.");
        }
        throw new Error("Failed to fetch weather data.");
      }

      const data = await response.json();

  
      setWeatherData(data);

    
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
          <h1>Weather Now</h1>
          <p>Check current weather for any city</p>
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
            </a>{" "}
            {USE_LOCAL_JSON && " (using local sample JSON for this build)"}
          </small>
        </footer>
      </div>
    </div>
  );
}

export default App;
