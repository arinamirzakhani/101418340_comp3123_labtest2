
/* eslint-disable react/prop-types */

function WeatherCard({
  cityName,
  country,
  temperature,
  feelsLike,
  description,
  iconCode,
  humidity,
  windSpeed,
  forecastDays = [],
}) {
  const iconUrl = iconCode
    ? `http://openweathermap.org/img/wn/${iconCode}@4x.png`
    : null;

  const prettyDescription = description
    ? description.charAt(0).toUpperCase() + description.slice(1)
    : "";

  const now = new Date();
  const weekday = now.toLocaleDateString(undefined, { weekday: "long" });
  const day = now.getDate();
  const month = now.toLocaleDateString(undefined, { month: "long" });

  return (
    <div className="weather-card fancy">
      {/* TOP: Today block + stats */}
      <div className="weather-top">
        {/* LEFT: Today info */}
        <div className="weather-left">
          <div className="weather-date">
            <span className="weekday">{weekday}</span>
            <span className="day">{day}</span>
            <span className="month">{month}</span>
          </div>

          <div className="weather-location">
            <h2>
              {cityName}, {country}
            </h2>
            <p className="weather-description-main">{prettyDescription}</p>
          </div>

          <div className="weather-temp-main">
            <span className="temp-big">{Math.round(temperature)}°C</span>
            <span className="temp-feels">
              Feels like {Math.round(feelsLike)}°C
            </span>
          </div>
        </div>

        {/* RIGHT: Icon + stats */}
        <div className="weather-right">
          <div className="weather-icon-large">
            {iconUrl && (
              <img src={iconUrl} alt={prettyDescription || "Weather"} />
            )}
          </div>

          <div className="weather-stats">
            <div className="stat-row">
              <span className="label">Humidity</span>
              <span className="value">{humidity}%</span>
            </div>
            <div className="stat-row">
              <span className="label">Wind</span>
              <span className="value">{windSpeed} m/s</span>
            </div>
            <div className="stat-row">
              <span className="label">Condition</span>
              <span className="value">{prettyDescription}</span>
            </div>
          </div>
        </div>
      </div>

      {/* BOTTOM: Next 5 days */}
      {forecastDays && forecastDays.length > 0 && (
        <div className="forecast-row">
          {forecastDays.map((day) => {
            const iconSmall = day.iconCode
              ? `http://openweathermap.org/img/wn/${day.iconCode}@2x.png`
              : null;

            return (
              <div className="forecast-day" key={day.date}>
                <span className="forecast-weekday">{day.weekdayShort}</span>
                {iconSmall && (
                  <img
                    src={iconSmall}
                    alt={day.description || "Forecast"}
                    className="forecast-icon"
                  />
                )}
                <span className="forecast-temp">
                  {Math.round(day.temp)}°C
                </span>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default WeatherCard;
