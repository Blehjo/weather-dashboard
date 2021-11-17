//Link js file to html 
//Get access to the input field
//Get access to button
//create function to fetch api

var inputField = document.querySelector("#cityname");
var button = document.querySelector(".search");
var savedSearches = document.querySelector('.search-history');
var apiKey = "d85c66df1c59659020eab5dbca7e04d8";
var date = moment().format('l');

// localstorage
var gettingItem = JSON.parse(localStorage.getItem('city')) || [];


var list = document.querySelector('.search-history');

inputField.value = '';

var set = function(){
    //inputField.value = " ";
    var city = inputField.value;
    gettingItem.push(city);
    console.log(gettingItem);
    localStorage.setItem('city', JSON.stringify(gettingItem));
}
  
//Display local storage
var listing = function(){
    inputField.innerHTML = '';
    var searchLength = gettingItem.length;
    console.log(searchLength)
    if(searchLength.length >= 3){
        searchLength = 3;
    }
    for(var i = 0; i < searchLength; i++){
        var cityButton = document.createElement('button');
        cityButton.textContent = `${gettingItem[gettingItem.length - i - 1]}`;
        list.append(cityButton);

    //     list.innerHTML = `<ol>${gettingItem[gettingItem.length - i - 1]}</ol>`;
    //   historyEl.append(list);

    }
}

button.addEventListener("click", function(event){
    event.preventDefault();
    var keyword = inputField.value.trim();
    console.log(keyword)
    if (keyword) {
        keyword.textContent = "Thanks!";
        fetchPrimaryInfo();
        fetchSecondaryInfo();
        set();
        listing();
    } else {
        inputField.setAttribute("placeholder", "Please enter a city")
    }
});

function fetchPrimaryInfo() {
    var primaryData = document.createElement('h1');
    var infoText = document.querySelector(".current")
    var cityName = inputField.value;
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
        infoText.setAttribute('style', "border: 1px solid black; padding: 5px;")
        
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
            uvIndex.setAttribute('data-id', weatherData.current.uvi);
            if (uvIndex.id <= 2) {
                uvIndex.classList.add('green');
            } else if (uvIndex.id > 2 && uvIndex.id <= 5) {
                uvIndex.classList.add('yellow');
            } else if (uvIndex.id > 5 && uvIndex.id <= 7) {
                uvIndex.classList.add('orange');
            } else if (uvIndex.id > 7 && uvIndex.id <= 10) {
                uvIndex.classList.add('red');
            } else if (uvIndex.id > 10) {
                uvIndex.classList.add('purple');
            };
        })
    })
}

function fetchSecondaryInfo() {
    //event.preventDefault();   
    var currentInfo = document.querySelector(".forecasts") 
    var cityName = inputField.value.trim();
    var requestUrl = "https://api.openweathermap.org/data/2.5/forecast?q=" + cityName + "&units=imperial&appid=" + apiKey;
    fetch(requestUrl)
        .then(function (response) {
            return response.json();
        })
        .then(function (weatherData) {
            var forecast = weatherData.list;
            // for loop going through the 5 days and putting them in divs
            for (i = 5; i < forecast.length; i = i + 8) {
                var forecastCards = forecast[i];
                var secondaryData = document.createElement('h1');
                var dayForecaster = document.querySelector('.dayforecast');
                dayForecaster.classList.remove("hidden");
                var iconImage = document.createElement('img')
                secondaryData.classList="days"
                var iconID = forecastCards.weather[0].icon;
                secondaryData.setAttribute("data-id", iconID)
                iconImage.src = "http://openweathermap.org/img/wn/" + iconID + "@2x.png"
                var forecastDate = document.createElement("h5");
                forecastDate.textContent = moment.unix(forecastCards.dt).format("l");
                secondaryData.appendChild(forecastDate);
                secondaryData.setAttribute("style", "text-align: center; padding: 1rem");
                currentInfo.append(secondaryData);
                secondaryData.append(iconImage);
                secondaryData.append("\nTemp: " + forecastCards.main.temp + "°F")
                secondaryData.append("\nWind: " + (forecastCards.wind.speed).toFixed() + " MPH")
                secondaryData.append("\nHumidity: " + (forecastCards.main.humidity) + " %")
            }
        });
}

listing();
