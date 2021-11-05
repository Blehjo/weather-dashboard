//Link js file to html 
//Get access to the input field
//Get access to button
//create function to fetch api

var inputField = document.querySelector("#cityname");
var button = document.querySelector(".search");


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

button.addEventListener("click", fetchTemp);

function convertToFahrenheit(weatherData) {
    return ((weatherData - 273.15) * 9 / 5 + 32).toFixed(2)
}

function fetchTemp() {
    var infoText = document.querySelector(".current")
    var cityName = inputField.value;
    var apiKey = "d85c66df1c59659020eab5dbca7e04d8";
    var requestUrl = "https://api.openweathermap.org/data/2.5/weather?q=" + cityName + "&appid=" + apiKey;

    fetch(requestUrl)
        .then(function (response) {
            return response.json()
        })
        .then(function(weatherData) {
            console.log(weatherData.main)
            var cityName = document.createElement('h2');
            var highTemp = document.createElement('h3');
            var lowTemp = document.createElement('h3');
            var baroMet = document.createElement('h3');
            var description = document.createElement('h3');
            cityName.textContent = "City: " + inputField.value;
            highTemp.textContent = "High: " +  + " Fahrenheit";
            lowTemp.textContent = "Low: " + " Fahrenheit";
            baroMet.textContent = "Pressure: " + (weatherData.main.pressure * .0295301).toFixed();
            description.textContent = "Description: " + weatherData.weather[0].description;
            infoText.append(cityName);
            infoText.append(highTemp);
            infoText.append(lowTemp);
            infoText.append(baroMet);
            infoText.append(description);
            cityName.setAttribute('style', "text-align: center; color: red; font-weight: 60");
            highTemp.setAttribute('style', "text-align: center")
        })

}