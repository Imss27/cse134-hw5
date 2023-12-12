const gridpointUrl = "https://api.weather.gov/gridpoints/SGX/53,20/forecast/hourly";

class WeatherWidget extends HTMLElement {
  weather_data;
  component;

  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
  }

  async connectedCallback() {
    const weatherWidgetStyleSheet = new CSSStyleSheet();
    weatherWidgetStyleSheet.replaceSync(`
      div {
        border-radius: 2.5rem;
        display: flex;
        width: 25rem;
        height: 15rem;
        padding: 1rem;
        background: var(--bg-color);
        --bg-color: gray;
        justify-content: center;
        align-items: center;
        position: relative;
        overflow: hidden;
        
      
        &[data-theme] {
            justify-content: flex-start;
            align-items: stretch;
          }
        
          &[data-theme="bright"] {
            --bg-color: blue; 
          }
        
          &[data-theme="dark"] {
            --bg-color: black; 
          }
                        
          & ul {
            list-style-type: none;
            display: flex;
            flex-direction: column;
            justify-content: space-between;
            border-radius: 1rem;
            padding: 1rem;
            margin: 1rem;
            color: white;
            background-color: black;        
          }
        } 
    }
    `);
    this.shadowRoot.adoptedStyleSheets = [weatherWidgetStyleSheet];

    const loadingMsgEl = document.createElement('p');
    loadingMsgEl.innerText = 'Loading weather data';
    this.component = document.createElement('div');
    this.component.append(loadingMsgEl);
    this.shadowRoot.replaceChildren(this.component);

    try {
      const weatherResponse = await fetch(gridpointUrl);
      const weatherData = await weatherResponse.json();
      this.weather_data = weatherData.properties.periods[0];
    } catch (error) {
      console.error('Error fetching weather data:', error);
      loadingMsgEl.innerText = 'Weather data failed to load';
      return;
    }

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
    } = this.weather_data;

    const weatherIconEl = document.createElement('img');
    const dataListWrapperEl = document.createElement('ul');
    const temperatureItemEl = document.createElement('li');
    const summaryItemEl = document.createElement('li');
    const windItemEl = document.createElement('li');
    const humidityItemEl = document.createElement('li');
    const rainItemEl = document.createElement('li');
    const timeEl = document.createElement('li');


    /* Assign stats to corresponding elements */
    temperatureItemEl.innerText = `${temperature}°${temperatureUnit}`;
    summaryItemEl.innerText = shortForecast;
    windItemEl.innerText = `Wind speed: ${windSpeed} ${windDirection}`;
    humidityItemEl.innerText = `Humidity: ${relativeHumidity.value}%`;
    rainItemEl.innerText = `Chance of rain: ${probabilityOfPrecipitation.value}%`;
    timeEl.innerText = isDaytime ? 'It is Daytime' : 'It is Night time';
    weatherIconEl.src = icon.split(",")[0];
    weatherIconEl.alt = 'Weather condition icon';
    weatherIconEl.style = 'width: 100px; height: 100px; border-radius: 1rem;';

    this.component.dataset.theme = isDaytime ? 'bright' : 'dark';

    dataListWrapperEl.replaceChildren(
      temperatureItemEl,
      summaryItemEl,
      windItemEl,
      humidityItemEl,
      rainItemEl,
      timeEl
    );
    this.component.replaceChildren(dataListWrapperEl);
    this.component.append(weatherIconEl);

  }
}

window.customElements.define('weather-widget', WeatherWidget);
