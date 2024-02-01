// Weather.js

import React, { useState } from 'react';
import axios from 'axios';
import { WiDaySunny, WiDayCloudy, WiCloud, WiCloudy, WiCloudyGusts } from 'react-icons/wi';
import './Weather.css';

const Weather = () => {
  const [city, setCity] = useState('');
  const [weather, setWeather] = useState(null);
  const [unit, setUnit] = useState('metric');
  const [error, setError] = useState(null);

  const getWeather = async () => {
    try {
      const response = await axios.get(`http://api.openweathermap.org/data/2.5/forecast?q=${city}&units=${unit}&appid=d577ef7a0e802247e20bc107189664bf`);
      setWeather(response.data);
      setError(null); // Reset error state if the request is successful
    } catch (error) {
      console.error(error);
      setError('City not found or an error occurred.'); // Set an error message
    }
  };

  const handleUnitToggle = () => {
    setUnit(unit === 'metric' ? 'imperial' : 'metric');
  };

  const getWindDirection = (degrees) => {
    const directions = ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW'];
    const index = Math.round(degrees / 45) % 8;
    return directions[index];
  };

  const getTemperatureCategory = (temp) => {
    if (temp > 30) {
      return 'hot';
    } else if (temp > 20) {
      return 'warm';
    } else if (temp > 10) {
      return 'moderate';
    } else if (temp > 0) {
      return 'cool';
    } else {
      return 'cold';
    }
  };

  const getWeatherIcon = (weatherDescription, cloudiness) => {
    if (weatherDescription.toLowerCase() === 'clear') {
      return <WiDaySunny className="sunny-icon sunny-color" />;
    } else if (weatherDescription.toLowerCase() === 'clouds') {
      if (cloudiness >= 75) {
        return <WiCloudyGusts className="cloudy-icon cloudy-color" />;
      } else if (cloudiness >= 50) {
        return <WiCloudy className="cloudy-icon cloudy-color" />;
      } else if (cloudiness >= 25) {
        return <WiCloud className="cloudy-icon cloudy-color" />;
      } else {
        return <WiDayCloudy className="cloudy-icon cloudy-color" />;
      }
    } else {
      return null;
    }
  };

  const handleChange = (e) => {
    const value = e.target.value;
    setCity(value);

    // Reset weather and error when the city input is cleared
    if (value === '') {
      setWeather(null);
      setError(null);
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (city.trim() === '') {
      setError('Please enter a city name.');
    } else {
      await getWeather();
    }
  };

  return (
    <div className="weather-container">
      <form onSubmit={handleSubmit} className="search-form">
        <input type="text" value={city} onChange={handleChange} placeholder="Enter City" />
        <button type="submit">Get Weather</button>
      </form>
      {error && (
        <div className="error-message">
          {error}
        </div>
      )}
      {weather && (
        <div className="weather-details">
          <h2>{weather.city.name}</h2>
          <button onClick={handleUnitToggle} className="unit-toggle">
            Toggle Unit ({unit === 'metric' ? 'Celsius' : 'Fahrenheit'})
          </button>
          {weather.list.map((forecast, index) => (
            <div key={index} className="weather-forecast">
              <p>Date: {forecast.dt_txt}</p>
              <p>Temperature: {forecast.main.temp}°{unit === 'metric' ? 'C' : 'F'}</p>
              <p>Min Temperature: {forecast.main.temp_min}°{unit === 'metric' ? 'C' : 'F'}</p>
              <p>Max Temperature: {forecast.main.temp_max}°{unit === 'metric' ? 'C' : 'F'}</p>
              <p>Humidity: {forecast.main.humidity}%</p>
              <p>Wind Speed: {forecast.wind.speed} m/s</p>
              <p>Wind Direction: {forecast.wind.deg}° ({getWindDirection(forecast.wind.deg)})</p>
              <p>Description: {forecast.weather[0].description}</p>
              <p className={`average-temp temp-${getTemperatureCategory(forecast.main.temp)}-${forecast.weather[0].main.toLowerCase()}`}>
                Average Temperature: {forecast.main.temp}°{unit === 'metric' ? 'C' : 'F'}
              </p>
              <div className="weather-icon">
                {getWeatherIcon(forecast.weather[0].main, forecast.clouds.all)}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Weather;
