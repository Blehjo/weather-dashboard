//Link js file to html 
//Get access to the input field
//Get access to button
//create function to fetch api

var inputField = document.querySelector("#cityname");
var button = document.querySelector(".search");

var date = moment().format('l');

function fetchInfo() {
    var primaryData = document.createElement('h1');
    var infoText = document.querySelector(".current")
    var cityName = inputField.value;
    var apiKey = "d85c66df1c59659020eab5dbca7e04d8";
    var requestUrl = "https://api.openweathermap.org/data/2.5/weather?q=" + cityName + "&appid=" + apiKey;
    
    fetch(requestUrl)
    .then(function (response) {
        return response.json()
    })
    .then(function(weatherData) {
        var icon = document.createElement('img');
        icon.src = "http://openweathermap.org/img/wn/" + weatherData.weather[0].icon + "@2x.png";
        primaryData.textContent = weatherData.name + " " + date; 
        infoText.append(primaryData);
        infoText.append(icon);
        primaryData.setAttribute('style', "padding-bottom: 1rem; padding-left: .5rem");
        
        var lat = weatherData.coord.lat;
        var lon = weatherData.coord.lon;
        var latLonUrl = "https://api.openweathermap.org/data/2.5/onecall?lat=" + lat + "&lon=" + lon + "&units=imperial&appid=" + apiKey;
        fetch(latLonUrl)
        .then(function (response) {
            return response.json()
        })
        .then(function(weatherData) {
            var temperature = document.createElement('h3');                
            var windSpeed = document.createElement('h3');                
            var humidity = document.createElement('h3');                
            var uvIndex = document.createElement('h3');                
            temperature.textContent = "Temp: " + weatherData.current.temp + "°F";  
            windSpeed.textContent = "Wind: " + weatherData.current.wind_speed + " MPH ";
            humidity.textContent = "Humidity: " + weatherData.current.humidity + " % ";
            uvIndex.textContent = "UV Index: " + weatherData.current.uvi;
            infoText.append(temperature);
            infoText.append(windSpeed);
            infoText.append(humidity);
            infoText.append(uvIndex);
            temperature.setAttribute('style', "padding-bottom: 1rem; padding-left: 1rem; font-weight: 60");
            windSpeed.setAttribute('style', "padding-bottom: 1rem; padding-left: 1rem; font-weight: 60");
            humidity.setAttribute('style', "padding-bottom: 1rem; padding-left: 1rem; font-weight: 60");
            uvIndex.setAttribute('style', "padding-bottom: 1rem; padding-left: 1rem; font-weight: 60");
        })
    })
}

button.addEventListener("click", fetchInfo);

// for (i = 0; i < 5; i++) {
//     function fetchInfo() {
//         var futureForecasts = document.createElement('h1');
//         var forecastsEl = document.querySelector(".forecasts")
//         var cityName = inputField.value;
//         var apiKey = "d85c66df1c59659020eab5dbca7e04d8";
//         var forecastUrl = "https://api.openweathermap.org/data/2.5/forecast?q=" + cityName + "&mode=xml&appid=" + apiKey;
//     fetch(forecastUrl)
//     .then(function(response) {
//         return response.json()
//     })
//     .then(function(forecastData) {

//     })
//    futureForecasts.textContent = date + "Temp: " + weatherData.

// }

// "<h3>Description: <img src='http://openweathermap.org/img/w/" + data.weather[0].icon+ ".png'> " + data.weather.description + "</h3>"


// if (uvi <= 2) {
//     classList.add('green');
// } else if (uvi > 2 && uvi <= 5) {
//     classList.add('yellow');
// } else if (uvi > 5 && uvi <= 7) {
//     classList.add('orange');
// } else if (uvi > 7 && uvi <= 10) {
//     classList.add('red');
// } else if (uvi > 10) {
//     classList.add('purple');
// };