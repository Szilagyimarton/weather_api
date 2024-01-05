const urlAddress =
  "https://api.open-meteo.com/v1/forecast?latitude=47.4984&longitude=19.0404&daily=weather_code,temperature_2m_max,temperature_2m_min,sunrise,sunset&timezone=Europe%2FLondon";

const fetchURL = async (url) => {
  const response = await fetch(url);
  return response.json();
};

const skeleton = () => `
  <div id="todayWeather"></div>
  <div id="weatherForecast"></div>
`;
const getDay = (date) => {
  const newDate = new Date(date);
  const numberOfWeek = newDate.getDay();
  return numberOfWeek === 0
    ? "Sunday"
    : numberOfWeek === 1
    ? "Monday"
    : numberOfWeek === 2
    ? "Tuesday"
    : numberOfWeek === 3
    ? "Wednesday"
    : numberOfWeek === 4
    ? "Thursday"
    : numberOfWeek === 5
    ? "Friday"
    : "Saturday";
};
const insertDataComponent = (date, weather_code, maxTemperature,minTemperature,weatherSymbol) => `
  <div id="${getDay(date)}">
    <h1 class="day">${getDay(date)}</h1>
    <h2>${weatherSymbol}</h2
    <h3 class="weatherCode">${translateWeatherCode(weather_code)}</h3>
    <p class="maxTemp">Max Temp.: <span class="celsiusOrFahrenheit">${maxTemperature} °C</span></p>
    <p class="minTemp">Min Temp.: <span class="celsiusOrFahrenheit">${minTemperature} °C</span></p>
  </div>
`;
const translateWeatherCode = (code) => {
  return code === 0
    ? "Clear sky"
    : (code === 1 ||code === 2 ||code ===  3)
    ? "Mainly clear, partly cloudy, and overcast"
    : (code === 45||code === 48)
    ? "Fog and depositing rime fog"
    : (code === 51||code ===  53 ||code ===  55)
    ? "Drizzle: Light, moderate, and dense intensity"
    : (code === 56 ||code ===  57)
    ? "Freezing Drizzle: Light and dense intensity"
    : (code === 61 ||code ===  63 ||code ===  65)
    ? "Rain: Slight, moderate and heavy intensity"
    : (code === 66||code ===  67)
    ? "Freezing Rain: Light and heavy intensity"
    : (code === 71 ||code ===  73 ||code ===  75)
    ? "Snow fall: Slight, moderate, and heavy intensity"
    : code === 77
    ? "Snow grains"
    : (code === 80||code ===  81 ||code ===  82)
    ? "Rain showers: Slight, moderate, and violent"
    : (code === 85 ||code ===  86)
    ? "Snow showers slight and heavy"
    : code === 95
    ? "Thunderstorm: Slight or moderate"
    : (code === 96 ||code ===  99)
    ? "Thunderstorm with slight and heavy hail"
    : null;
};

const makeSymbolsFromWeatherCode = (weatherCode) => {
  return weatherCode === 0
    ? `<span class="material-symbols-outlined" style="color:orange">
  clear_day
  </span>`
    : (weatherCode === 1 || weatherCode === 2 ||weatherCode === 3)
    ? `<span class="material-symbols-outlined" style="color:orange">
  partly_cloudy_day
  </span>`
    : (weatherCode === 45 || weatherCode === 48)
    ? `<span class="material-symbols-outlined" style="color:grey">
  foggy
  </span>`
    : (weatherCode === 51 || weatherCode === 53 || weatherCode === 55)
    ? `<span class="material-symbols-outlined" style="color:grey">
  rainy_light
  </span>`
    : (weatherCode === 56 || weatherCode === 57 )
    ? `<span class="material-symbols-outlined" style="color:grey">
  rainy_snow
  </span>`
    : (weatherCode === 61 ||weatherCode === 63 || weatherCode === 65 )
    ? `<span class="material-symbols-outlined" style="color:grey">
  rainy
  </span>`
    : (weatherCode === 66 || weatherCode=== 67)
    ? `<span class="material-symbols-outlined" style="color:grey">
  weather_mix
  </span>`
    : (weatherCode === 71 || 73 || 75)
    ? `<span class="material-symbols-outlined" style="color:darkgrey">
  cloudy_snowing
  </span>`
    : weatherCode === 77
    ? `<span class="material-symbols-outlined" style="color: darkgrey">
  snowing
  </span>`
    : (weatherCode === 80 || weatherCode=== 81 || weatherCode===82)
    ? `<span class="material-symbols-outlined" style="color: grey">
  rainy_heavy
  </span>`
    : (weatherCode === 85 || weatherCode===86)
    ? `<span class="material-symbols-outlined" style="color:darkgrey">
  snowing_heavy
  </span>`
    : (weatherCode === 95)
    ? `<span class="material-symbols-outlined"  style="color:grey">
  thunderstorm
  </span>`
    : (weatherCode === 96 || weatherCode===99)
    ? `<span class="material-symbols-outlined" style="color:yellow">
  electric_bolt
  </span> `
    : null;
};

const handlehangeDegreeType = (e) => {
  if(e.target.id === "changeDegreeType"){
    const spanElements = document.querySelectorAll("span[class='celsiusOrFahrenheit']")
    spanElements.forEach(element => {
      const value = element.innerHTML.split(" ")[0]
      const degree = element.innerHTML.split(" ")[1]
   
      console.log(element.innerHTML.split(" "))
    
      if(degree === "°C"){
       element.innerHTML = (Number(value) * (9/5) + 32).toFixed(1) + " °F"
      }
      if(degree === "°F"){
        element.innerHTML =  ((Number(value)- 32) * 5/9).toFixed(1) + " °C"
        
      }
    })
  }
}

const makeData = (data, weatherForecastElement) => {
  for (let i = 1; i < 7; i++) {
    const date = data.daily.time[i];
    const weatherCode = data.daily.weather_code[i];
    const weatherSymbol = makeSymbolsFromWeatherCode(weatherCode)
    const maxTemperature = data.daily.temperature_2m_max[i];
    const minTemperature = data.daily.temperature_2m_min[i];
    weatherForecastElement.insertAdjacentHTML( "beforeend",
      insertDataComponent(date, weatherCode, maxTemperature, minTemperature,weatherSymbol)
    );
  }
};

const todayDataComponent = (data,num) => `
  <p>Click to change:<span id="changeDegreeType"> °C | °F </span></p>
  <h1>${getDay(data.daily.time[num])}</h1>
  <h2>${makeSymbolsFromWeatherCode(data.daily["weather_code"][num])}
  <h3>${translateWeatherCode(data.daily["weather_code"][num])} </h3>

  <h4>Max Temp.: <span class="celsiusOrFahrenheit">${data.daily["temperature_2m_max"][num]} °C</span> </h4>
  <h5>Min Temp.: <span class="celsiusOrFahrenheit">${data.daily["temperature_2m_min"][num]} °C</span></h5>
  <p>Sunrise: ${data.daily.sunrise[num].split("T")[1]}</p>
  <p>Sunset: ${data.daily.sunset[num].split("T")[1]}</p>
`;

async function init() {
  const rootElement = document.querySelector("#root");
  rootElement.innerHTML = skeleton();
  const todayWeatherelement = document.querySelector("#todayWeather");
  const weatherForecastElement = document.querySelector("#weatherForecast");
  const data = await fetchURL(urlAddress);
  todayWeatherelement.insertAdjacentHTML("beforeend", todayDataComponent(data,0));
  makeData(data, weatherForecastElement);

  window.addEventListener("click", (e) =>{
    handlehangeDegreeType(e)
  })
}
init();
