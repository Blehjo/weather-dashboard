//Link js file to html 
//Get access to the input field
//Get access to button
//create function to fetch api

var inputField = document.querySelector("#cityname");
var button = document.querySelector(".search");
var currentDayEl = document.getElementById('currentDay');


function fetchData() {
    var cityName = inputField.value;
    var apiKey = "d85c66df1c59659020eab5dbca7e04d8";
    var requestUrl = "https://api.openweathermap.org/data/2.5/weather?q=" + cityName + "&appid=" + apiKey;

    fetch(requestUrl)
        .then(function (response) {
            return response.json()
        })
        .then(function(weatherData) {
            console.log(weatherData)
        })
}



button.addEventListener("click", fetchInfo);

// function convertToFahrenheit(weatherData) {
//     return ((weatherData.main[3] - 273.15) * 9 / 5 + 32).toFixed(2)
// }

function fetchTemp() {
    var infoText = document.querySelector(".current")
    var cityName = inputField.value;


    var apiKey = "d85c66df1c59659020eab5dbca7e04d8";
    var requestUrl = "https://api.openweathermap.org/data/2.5/weather?q=" + cityName + "&appid=" + apiKey;
    //var iconCode = weatherData.weather[3];
    //var iconUrl = "http://openweathermap.org/img/wn/" + iconCode + "@2x.png"
    fetch(requestUrl)
        .then(function (response) {
            return response.json()
        })
        .then(function(weatherData) {
            console.log(weatherData)
            console.log(weatherData.main)
            console.log(weatherData.weather[0].icon)
            var cityName = document.createElement('h1');
            var temperature = document.createElement('h3');
            var baroMet = document.createElement('h3');
            var iconCode = document.createElement('h3');
            //var high = convertToFahrenheit();
            cityName.textContent = weatherData.name;
            //temperature.textContent = high
            infoText.append(weatherData.name + date);
        })

}

var date = moment().format('l');

function getCurrentDate() {
    currentDayEl.textContent = date;
} 

$('document').ready(getCurrentDate);


// console.log(weatherData.main[1]);
// console.log(weatherData.main[0]);
//weatherData.name; - Name
//weatherData.wind[1]; - Windspeed
//weatherData.main[3]; - 

//https://api.openweathermap.org/data/2.5/onecall?lat=-0.13&lon=51.51&appid=d85c66df1c59659020eab5dbca7e04d8

//current.uvi
//For temperature in Fahrenheit and wind speed in miles/hour, use units=imperial
//current.humidity
//current.wind_speed
//current.weather.icon
//http://openweathermap.org/img/wn/10d@2x.png

function fetchInfo() {
    var primaryData = document.createElement('h1');
    var infoText = document.querySelector(".current")
    var cityDate = inputField.value;
    var apiKey = "d85c66df1c59659020eab5dbca7e04d8";
    var requestUrl = "https://api.openweathermap.org/data/2.5/weather?q=" + cityDate + "&appid=" + apiKey;
    
    fetch(requestUrl)
        .then(function (response) {
            return response.json()
        })
        .then(function(weatherData) {
            primaryData.textContent = weatherData.name + " " + date; //+ weatherData.current.weather.icon;

            
            var lat = weatherData.coord.lat;
            var lon = weatherData.coord.lon;
            var latLonUrl = "https://api.openweathermap.org/data/2.5/onecall?lat=" + lat + "&lon=" + lon + "&appid=" + apiKey;
            fetch(latLonUrl)
            .then(function (response) {
                return response.json()
            })
            .then(function(weatherData) {
                var secondaryData = document.createElement('h3');
                // var windSpeed = document.createElement('h3');
                // var humidity = document.createElement('h3');
                // var uvIndex = document.createElement('h3');
                
                secondaryData.textContent = weatherData.current.temp.units=imperial + "\n" + weatherData.current.wind_speed + "\n" + weatherData.current.uvi + "\n" + weatherData.current.humidity;
                // windSpeed.textContent = weatherData.current.wind_speed;
                // uvIndex.textContent = weatherData.current.uvi;
                // humidity.textContent = weatherData.current.humidity;
                infoText.append(primaryData);
                infoText.append(secondaryData);
                // infoText.append(windSpeed);
                // infoText.append(humidity);
                // infoText.append(uvIndex);
                
            })
        })
        }
        