import { useEffect, useState } from 'react';

const fetch_URI = "https://api.weather.gov/gridpoints/SGX/53,20/forecast/hourly";

const Weather = () => {
  const [weatherData, setWeatherData] = useState(null);

  useEffect(() => {
    fetch(fetch_URI)
      .then((res) => res.json())
      .then((body) => 
        setWeatherData(body.properties.periods[0])
      )
      .catch(() => null);
  }, []);

  if (weatherData == null) return null;

  const {
    temperature,
    temperatureUnit,
    isDaytime,
    shortForecast,
    windSpeed,
    windDirection,
    relativeHumidity,
    probabilityOfPrecipitation,
    icon
  } = weatherData;

  const colorTheme = isDaytime ? 'bright' : 'dark';
  let timeEl = isDaytime ? 'It is Daytime' : 'It is Night time'; 
  return (
    <section data-theme={ colorTheme }>
      <ul>
        <li>{ temperature }°{ temperatureUnit }</li>
        <li>{ shortForecast }</li>
        <li>Wind speed: { windSpeed } { windDirection }</li>
        <li>Humidity: { relativeHumidity.value }%</li>
        <li>Chance of rain: { probabilityOfPrecipitation.value }%</li>
        <li>{ timeEl }</li>
      </ul>
      {icon && <img src={icon.split(",")[0]} alt="Weather condition icon" style={{ width: '100px', height: '100px', borderRadius: '1rem' }} />}
    </section>
  );
};

export default Weather;