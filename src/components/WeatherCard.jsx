
function WeatherCard({
  cityName,
  country,
  temperature,
  feelsLike,
  description,
  iconCode,
  humidity,
  windSpeed,
}) {
  const iconUrl = iconCode
    ? `http://openweathermap.org/img/wn/${iconCode}@2x.png`
    : null;

  const prettyDescription = description
    ? description.charAt(0).toUpperCase() + description.slice(1)
    : "";

  return (
    <div className="weather-card">
      <div className="weather-main">
        <div>
          <h2>
            {cityName}, {country}
          </h2>
          <p className="weather-description">{prettyDescription}</p>
        </div>

        {iconUrl && (
          <div className="weather-icon-wrapper">
            <img src={iconUrl} alt={description || "Weather icon"} />
          </div>
        )}
      </div>

      <div className="weather-details">
        <div className="weather-temp">
          <span className="temp-value">
            {Math.round(temperature)}°C
          </span>
          <span className="temp-feels">
            Feels like {Math.round(feelsLike)}°C
          </span>
        </div>

        <div className="weather-extra">
          <div>
            <span className="label">Humidity</span>
            <span className="value">{humidity}%</span>
          </div>
          <div>
            <span className="label">Wind</span>
            <span className="value">{windSpeed} m/s</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default WeatherCard;
