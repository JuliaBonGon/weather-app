// const apiKey = "" Not needed
const apiUrl = 'https://geocoding-api.open-meteo.com/v1/search';
const unsplashAccessKey = 'LZwuz3lje8FCf4lp6UotirN8qvme7Z6tqjhpJjrFu_8';

const cityInput = document.getElementById('cityInput');
const searchButton = document.getElementById('searchButton');
// const city = document.getElementById('city');
// const maxTemperaturePar = document.getElementById('max-temperature');
// const minTemperaturePar = document.getElementById('min-temperature');
// const descriptionDiv = document.getElementById('description');
// const weatherIconElem = document.getElementById('weather-icon-element');

const fiveDayForecastDiv = document.getElementById("five-days-forecast");
const todaysInfoSection = document.querySelector(".today-weather-result-container");

//Get local.storage of previously inserted city
cityInput.value = localStorage.getItem('cityInput');


// Eventlistener on submit botton or ENTER
searchButton.addEventListener('click', () => {
    const city = cityInput.value;
    if (!city) {
        alert ('Please enter a city')
        return;
    }               
    else {
        localStorage.setItem('cityInput', city); // Store city in localStorage
        fetchInsertedCity(city);
        fetchCityImage(city); // Fetch and display city image from Unsplash
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
            localStorage.setItem('cityInput', city); // Store city in localStorage
            fetchInsertedCity(city);
            fetchCityImage(city); // Fetch and display city image from Unsplash
        }
    }
    });


//Use API to get photo
function fetchCityImage(city) {
    const unsplashUrl = `https://api.unsplash.com/search/photos?page=1&query=${city}&client_id=${unsplashAccessKey}&per_page=20`;

    fetch(unsplashUrl)
        .then(response => response.json())
        .then(data => {
            console.log('Unsplash data:', data);
            const photoUrls = data.results.map(photo => photo.urls.regular);
            displayRandomPhoto(photoUrls);
        })
        .catch(error => {
                console.error('Error fetching city images:', error);
            
});
}

//Create cityimg in teh DOM
function displayRandomPhoto(photoUrls) {
    const cityImageDiv = document.getElementById('city-image-container');
    cityImageDiv.innerHTML = ''; // Clear previous image

    if (photoUrls.length > 0) {
        const randomPhotoIndex = Math.floor(Math.random()* photoUrls.length);
        const randomUrl = photoUrls[randomPhotoIndex];

        const imgElement = document.createElement('img');
        imgElement.setAttribute('src', randomUrl);
        imgElement.setAttribute('alt', `City photo from Unsplash`);
        imgElement.classList.add('random-photo'); 

        cityImageDiv.appendChild(imgElement);
    }
}

    //Use API to get location

function fetchInsertedCity(city) {
    const url = `${apiUrl}?name=${(city)}&count=10&language=en`;
    console.log(url);

    fetch(url)
        .then(response => response.json()) //The response needs to be transformed for JS to be able to read it
        .then(data => { //Put the response into the data variable. Data is our response already in the format needed to work with it
            // getting result into website elements (title, city, country, temperature)
            console.log(data);

            // Store longitud and lat invariables
            const longitude = data.results[0].longitude;
            const latitude = data.results[0].latitude;
            const city = data.results[0].name;
            const country = data.results[0].country;
            console.log(`Coordinates: ${longitude}, ${latitude}`);
            console.log(country);

            fetchCityData(latitude, longitude, city, country);
        })
        .catch(error => {
            console.error('Error fetching location weather data:', error);
            alert ('Error fetching current location weather data. Please try again.');
        });
    
}
 //TODO:Create URL for weather API
function fetchCityData(latitude, longitude, name, country) {
    const weatherApiUrl = `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&hourly=temperature_2m&daily=temperature_2m_max,temperature_2m_min,weather_code&timezone=auto&forecast_days=5`;
    fetch(weatherApiUrl)
        .then(response => response.json())
        .then(data => {
            console.log(data);
            console.log(name, country);
           
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
todaysInfoSection.innerHTML = "";
fiveDayForecastDiv.innerHTML = "";



//TODO: Display todays info
const todaysInfo = document.createElement("p");
todaysInfo.classList.add("today-name-par");
todaysInfo.textContent = `Weather for ${name}, ${country}`;
todaysInfoSection.prepend(todaysInfo);

const weatherCode = data.daily.weather_code[0];
console.log(`Today's weather code: ${weatherCode}`);

const icon = weatherCodeToIcon[weatherCode];
console.log(`Today's icon URL: icons/${icon}`);

if (icon) {
    const todayIconImg = document.createElement("img");
    todayIconImg.setAttribute("src", `icons/${icon}`);
    todayIconImg.setAttribute("alt", "Weather Icon");
    todayIconImg.classList.add ("today-icon-img");
    todaysInfoSection.appendChild(todayIconImg);

};

// Create max min temp section
const maxTemperaturePar = document.createElement('p');
const minTemperaturePar = document.createElement('p');
const todayMaxTemp = data.daily.temperature_2m_max[0];
maxTemperaturePar.innerHTML = `Max: ${todayMaxTemp}°C`;
const todayMinTemp = data.daily.temperature_2m_min[0];
minTemperaturePar.innerHTML = `Min: ${todayMinTemp}°C`;

 // Append temperature paragraphs to the div
 const maxMinTempTodayDiv = document.createElement('div');
 maxMinTempTodayDiv.classList.add('max-min-temp');

 maxMinTempTodayDiv.appendChild(maxTemperaturePar);
 maxMinTempTodayDiv.appendChild(minTemperaturePar);
 todaysInfoSection.appendChild(maxMinTempTodayDiv);

// Create a parent container for all daily info boxes
const dailyInfoBoxesContainer = document.createElement("div");
dailyInfoBoxesContainer.classList.add("daily-info-boxes-container");


//5 days forecast

//Add title to 5days forecast
    const fiveDayTitle = document.createElement('p');
    fiveDayTitle.classList.add("five-days-title");
    fiveDayTitle.textContent = "Five days weather forecast";
    fiveDayForecastDiv.appendChild(fiveDayTitle);

 
// Iterate over each day and create daily info boxes
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

        

        const maxTemp = data.daily.temperature_2m_max[i];
        const minTemp = data.daily.temperature_2m_min[i];
        const dailyWeatherCode = data.daily.weather_code[i];
        const dailyIcon = weatherCodeToIcon[dailyWeatherCode] || 'default.png';
     
// Create daily info box
        const dailyInfoBox = document.createElement("section");
        dailyInfoBox.classList.add("daily-info-box");
        
        
       // Create and append elements
    const dateSpan = document.createElement("span");
    dateSpan.classList.add("date");
    dateSpan.textContent = adaptDate;

    const maxTempSpan = document.createElement("span");
    maxTempSpan.classList.add("max-temp");
    maxTempSpan.textContent = `Max: ${maxTemp}°C`;

    const minTempSpan = document.createElement("span");
    minTempSpan.classList.add("min-temp");
    minTempSpan.textContent = `Min: ${minTemp}°C`;

    const dailyIconImg = document.createElement("img");
    dailyIconImg.classList.add("daily-icon")
    dailyIconImg.setAttribute("src", `icons/${dailyIcon}`);
    dailyIconImg.setAttribute("alt", "Weather Icon");

    // Append elements to the forecast section
    dailyInfoBox.appendChild(dateSpan);
    dailyInfoBox.appendChild(maxTempSpan);
    dailyInfoBox.appendChild(minTempSpan);
    dailyInfoBox.appendChild(dailyIconImg);

    dailyInfoBoxesContainer.appendChild(dailyInfoBox);
   // Append the parent container to the five-day forecast div
    fiveDayForecastDiv.appendChild(dailyInfoBoxesContainer);
    }
} ;

