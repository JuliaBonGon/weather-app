// const apiKey = "" Not needed
const apiUrl = 'https://geocoding-api.open-meteo.com/v1/search';

const locationInput = document.getElementById('locationInput');
const searchButton = document.getElementById('searchButton');
const locationElement = document.getElementById('location');
const countryElement = document.getElementById('country');
const temperatureElement = document.getElementById('temperature');
const descriptionElement = document.getElementById('description');



https://geocoding-api.open-meteo.com/v1/search

//TODO: enter field for city location
//TODO: eventlistener on submit botton or ENTER

searchButton.addEventListener('click', () => {
    const location = locationInput.value;
    if (location) {
        fetchWeather(location);
    }
});



//TODO: Use API to get location

function fetchWeather(location) {
    const url = `${apiUrl}?name=${(location)}&count=10&language=en`;
    console.log(url);

   
    fetch(url)
  
        .then(response => response.json()) //The response needs to be transformed for JS to be able to read it
        .then(data => { //Put the response into the data variable. Data is our response already in teh format needed to work with it
            //TODO: getting result into website elements (title, city, country, temperature)
            console.log(data);

            //TODO: Store longitud and lat invariables
            const longitude = 
            const latitude = 

            //TODO:Create URL for weather API

            //TODO:Fetch weather API

        })
        .catch(error => {
            console.error('Error fetching weather data:', error);
        });
    
}



//TODO: Use API for 5 days weather

//TODO: DOM manipulation to show 5 days
