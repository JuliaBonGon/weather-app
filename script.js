// const apiKey = "" Not needed
const apiUrl = 'https://geocoding-api.open-meteo.com/v1/search';

const cityInput = document.getElementById('cityInput');
const searchButton = document.getElementById('searchButton');
// const city = document.getElementById('city');
const temperatureDiv = document.getElementById('temperature');
const descriptionDiv = document.getElementById('description');
const weatherIcon = document.getElementById('weather-icon');
const hourlyForecastDiv = document.getElementById('hourly-forecast');


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
            console.log(`Coordinates: ${longitude}, ${latitude}`);

            fetchWeatherData(latitude,longitude);
            //TODO:Create URL for weather API


            //TODO:Fetch weather API

        })
        .catch(error => {
            console.error('Error fetching weather data:', error);
            alert ('Error fetching current weather data. Please try again.');
        });
    
}

function fetchWeatherData(latitude,longitude) {
    const weatherApiUrl = `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&hourly=temperature_2m&daily=temperature_2m_max,temperature_2m_min&timezone=auto`;
    fetch(weatherApiUrl)
        .then(response => response.json())
        .then(data => {
            console.log(data);
            displayWeatherData(data);
        })
        .catch(error => {
            console.error('Error fetching weather data:', error);
            alert('Error fetching weather data. Please try again.');
        });
}


function displayWeatherData(data) {
// //Clear previous content
// temperatureDiv.innerHTML = "";
// hourlyForecastDiv.innerHTML = "";
// descriptionDiv.innerHTML = "";

const todayTemp = data.daily.temperature_2m_max[0];
temperatureDiv.innerHTML = `Max temp todays is: ${todayTem}°C`;

}
//TODO: Use API for 5 days weather

//TODO: DOM manipulation to show 5 days
