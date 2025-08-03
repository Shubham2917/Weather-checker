import { useState } from "react";
import axios from "axios";
import "./App.css";

const API_KEY = "d9f92c6256de31c681157f9f0d2837a6";

function App() {
  const [city, setCity] = useState("");
  const [weather, setWeather] = useState(null);
  const [forecast, setForecast] = useState([]);

  const getWeather = async () => {
    try {
      const currentRes = await axios.get(
        `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${API_KEY}`
      );
      setWeather(currentRes.data);

      const forecastRes = await axios.get(
        `https://api.openweathermap.org/data/2.5/forecast?q=${city}&units=metric&appid=${API_KEY}`
      );
      const dailyData = forecastRes.data.list.filter((item, index) => index % 8 === 0);
      setForecast(dailyData);
    } catch (error) {
      alert("Error fetching weather");
    }
  };

  // Detect weather type for animation
  const weatherType = weather?.weather[0]?.main.toLowerCase();

  return (
    <div className={`app ${weatherType}`}>
      {/* ☀️ Sun (Clear weather only) */}
      {weatherType === "clear" && <div className="sun"></div>}

      {/* ☁️ Clouds (Cloudy / Rainy / Thunderstorm) */}
      {(weatherType === "clouds" || weatherType === "rain" || weatherType === "thunderstorm") && (
        <>
          <div className="cloud cloud1"></div>
          <div className="cloud cloud2"></div>
          <div className="cloud cloud3"></div>
        </>
      )}

      {/* ⚡ Lightning (Thunderstorm only) */}
      {weatherType === "thunderstorm" && <div className="lightning"></div>}

      {/* Main Panel */}
      <div className="left-panel">
        <h1>🌤 Weather App</h1>
        <input
          type="text"
          value={city}
          onChange={(e) => setCity(e.target.value)}
          placeholder="Enter city"
        />
        <button onClick={getWeather}>Get Weather</button>

        {weather && (
          <div className="weather-card">
            <h2>{weather.name}, {weather.sys.country}</h2>
            <p>🌡 Temp: {weather.main.temp}°C</p>
            <p>💨 Wind: {weather.wind.speed} m/s</p>
            <p>💧 Humidity: {weather.main.humidity}%</p>
            <p>{weather.weather[0].description}</p>
          </div>
        )}

        {forecast.length > 0 && (
          <>
            <h2>5-Day Forecast</h2>
            <div className="forecast">
              {forecast.map((day, index) => (
                <div key={index} className="forecast-day">
                  <p><b>{new Date(day.dt_txt).toLocaleDateString()}</b></p>
                  <p>🌡 {day.main.temp}°C</p>
                  <p>{day.weather[0].main}</p>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default App;
