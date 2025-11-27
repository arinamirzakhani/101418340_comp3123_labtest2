
function WeatherSearch({ value, onChange, onSearch }) {
  const handleSubmit = (e) => {
    e.preventDefault();
    onSearch();
  };

  return (
    <form className="weather-search" onSubmit={handleSubmit}>
      <input
        type="text"
        placeholder="Enter city name (e.g., Toronto)"
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
      <button type="submit">Search</button>
    </form>
  );
}

export default WeatherSearch;
