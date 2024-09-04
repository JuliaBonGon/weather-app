// const apiKey = "" Not needed
const apiUrl = 'https://geocoding-api.open-meteo.com/v1/search';

const cityInput = document.getElementById('cityInput');
const searchButton = document.getElementById('searchButton');
// const city = document.getElementById('city');
const maxTemperaturePar = document.getElementById('max-temperature');
const minTemperaturePar = document.getElementById('min-temperature');
const descriptionDiv = document.getElementById('description');
const weatherIconElem = document.getElementById('weather-icon-element');
const hourlyForecastDiv = document.getElementById('hourly-forecast');
const fiveDayForecastDiv = document.getElementById("five-days-forecast");
const todaysInfoSection = document.querySelector(".today-weather-result-container");

//TODO: enter field for city location
//TODO: eventlistener on submit botton or ENTER



searchButton.addEventListener('click', () => {
    const city = cityInput.value;
    if (!city) {
        alert ('Please enter a city')
        return;
    }               
    else {
        fetchWeather(city);
    }
});

cityInput.addEventListener('keydown', (event) => {
    if (event.key === 'Enter') {
        const city = cityInput.value;
        if (!city) {
            alert ('Please enter a city')
            return;
        }
        else {
            fetchWeather(city);

        }
    }
    });

//TODO: Use API to get location

function fetchWeather(city) {
    const url = `${apiUrl}?name=${(city)}&count=10&language=en`;
    console.log(url);

    fetch(url)
        .then(response => response.json()) //The response needs to be transformed for JS to be able to read it
        .then(data => { //Put the response into the data variable. Data is our response already in teh format needed to work with it
            //TODO: getting result into website elements (title, city, country, temperature)
            console.log(data);

            //TODO: Store longitud and lat invariables
            const longitude = data.results[0].longitude;
            const latitude = data.results[0].latitude;
            const city = data.results[0].name;
            const country = data.results[0].country;
            console.log(`Coordinates: ${longitude}, ${latitude}`);
            console.log(country);

            fetchWeatherData(latitude, longitude, city, country);
        })
        .catch(error => {
            console.error('Error fetching location weather data:', error);
            alert ('Error fetching current location weather data. Please try again.');
        });
    
}
 //TODO:Create URL for weather API
function fetchWeatherData(latitude, longitude, name, country) {
    const weatherApiUrl = `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&hourly=temperature_2m&daily=temperature_2m_max,temperature_2m_min,weather_code&timezone=auto&forecast_days=5`;
    fetch(weatherApiUrl)
        .then(response => response.json())
        .then(data => {
            console.log(data);
            displayWeatherData(data);
            displayWeatherData(data, name, country);
        })
        .catch(error => {
            console.error('Error fetching weather data:', error);
            alert('Error fetching weather data. Please try again.');
        });
}

//TODO: Function to display weather icon
const weatherCodeToIcon = {
    0: 'clear_sky.png',
    1: 'mainly_clear.png',
    2: 'partly_cloudy.png',
    3: 'overcast.png',
    45: 'fog.png',
    48: 'rime_fog.png',
    51: 'light_drizzle.png',
    53: 'moderate_drizzle.png',
    55: 'dense_drizzle.png',
    56: 'light_freezing_drizzle.png',
    57: 'dense_freezing_drizzle.png',
    61: 'light_rain.png',
    63: 'moderate_rain_showers.png',
    65: 'heavy_rain.png',
    66: 'light_freezing_rain.png',
    67: 'heavy_freezing_rain.png',
    71: 'slight_snowfall.png',
    73: 'moderate_snowfall.png',
    75: 'heavy_snowfall.png',
    77: 'snow_grains.png',
    80: 'slight_rain_showers.png',
    81: 'moderate_rain_showers.png',
    82: 'violent_rain_showers.png',
    85: 'slight_snow_showers.png',
    86: 'heavy_snow_showers.png',
    95: 'thunderstorm.png',
    96: 'thunderstorm_with_slight_hail.png',
    99: 'thunderstorm_with_heavy_hail.png'
};

//TODO:Fetch weather API
function displayWeatherData(data, name, country) {
//Clear previous content
maxTemperaturePar.innerHTML = "";
minTemperaturePar.innerHTML = "";
hourlyForecastDiv.innerHTML = "";
fiveDayForecastDiv.innerHTML = "";
todaysInfoSection.innerHTML = "";

const todayMaxTemp = data.daily.temperature_2m_max[0];
maxTemperaturePar.innerHTML = `Max: ${todayMaxTemp}°C`;
const todayMinTemp = data.daily.temperature_2m_min[0];
minTemperaturePar.innerHTML = `Min: ${todayMinTemp}°C`;


const weatherCode = data.daily.weather_code[0];
console.log(`Today's weather code: ${weatherCode}`);

const icon = weatherCodeToIcon[weatherCode];
console.log(`Today's icon URL: icons/${icon}`);
if (icon) {
    const todayIconImg = document.createElement("img");
    todayIconImg.setAttribute("src", `icons/${icon}`);
    todayIconImg.setAttribute("alt", "Weather Icon");
    todaysInfoSection.appendChild(todayIconImg);
//     weatherIconElem.style.display = "block";
//     weatherIconElem.src = `icons/${icon}`;
//     weatherIconElem.alt = "Weather Icon";
// };

//TODO: Display city name

// const city = cityInput.value.charAt(0).toUpperCase() + cityInput.value.slice(1);
console.log (name, country);
const todaysInfo = document.createElement("p");
todaysInfo.textContent = `Weather for ${name}, ${country}`;
todaysInfoSection.appendChild(todaysInfo);


//TODO: 5 days forecast
fiveDayForecastDiv.innerHTML = "";


    for (let i = 0; i < data.daily.temperature_2m_max.length; i++) {
        const isoDate = data.daily.time[i];
        console.log(isoDate);
        console.log(`ISO Date: ${isoDate}`);

        const dateObject = new Date(isoDate);
        const adaptDate = dateObject.toLocaleDateString(undefined, {
            weekday: 'short',
            month: 'short',
            day: 'numeric'
        });
        console.log(`Adapted Date: ${adaptDate}`);
        


        const maxTemp = data.daily.temperature_2m_max[i];
        const minTemp = data.daily.temperature_2m_min[i];
        const dailyWeatherCode = data.daily.weather_code[i];
        const dailyIcon = weatherCodeToIcon[dailyWeatherCode] || 'default.png';
        // fiveDayForecastMes += `<p>${adaptDate}: Max ${maxTemp}°C, Min ${minTemp}°C <img src="icons/${dailyIcon}" alt="Weather Icon"></p>`;

        const fiveDayForecastSection = document.createElement("p");
        const eachDayforecastText = document.createTextNode(`${adaptDate}: Max ${maxTemp}°C, Min ${minTemp}°C `);
        const eachDayiconImg = document.createElement("img");
        eachDayiconImg.setAttribute("src", `icons/${dailyIcon}`);
        eachDayiconImg.setAttribute("alt", "Weather Icon");
    
    fiveDayForecastSection.appendChild(eachDayforecastText);
    fiveDayForecastSection.appendChild(eachDayiconImg);

    fiveDayForecastDiv.appendChild(fiveDayForecastSection);
    }
} ;

}
