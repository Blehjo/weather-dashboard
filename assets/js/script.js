// These create the user interface
var inputField = document.getElementById("cityname");
var button = document.querySelector(".search");

// Api key and date.  These will make the website work and make it easy to understand
var apiKey = "d85c66df1c59659020eab5dbca7e04d8";
var date = moment().format('l');

// localstorage
var gettingItem = JSON.parse(localStorage.getItem('city')) || [];

// Targets the are under the search bar, so previous searches can be stored
var list = document.querySelector('.search-history');

// Stores information in local storage, so it can be accessed later
var set = function(){
    var city = inputField.value;
    gettingItem.push(city);
    console.log(gettingItem);
    localStorage.setItem('city', JSON.stringify(gettingItem));
}
  
// Displays local storage and limits the searches displayed to 5 on the page
var listing = function(){
    list.innerHTML = '';
    var searchLength = gettingItem.length;
    console.log(searchLength)
    if(searchLength >= 5){
        searchLength = 5;
    }
    for(var i = 0; i < searchLength; i++){
        var cityButton = document.createElement('button');
        cityButton.textContent = `${gettingItem[gettingItem.length - i - 1]}`;
        list.append(cityButton);
    }
}

// Listens for click event.  Once the click is noted it runs functions that are defined 
button.addEventListener("click", function(event){
    event.preventDefault();
    var keyword = inputField.value.trim();
    console.log(keyword)
    if (keyword) {
        fetchPrimaryInfo();
        fetchSecondaryInfo();
        set();
        listing();
    } else {
        inputField.setAttribute("placeholder", "Please enter a city")
    }
});

// Function that creates elements and displays information from our API to the targeted section of our page
function fetchPrimaryInfo() {
    var primaryData = document.createElement('h1');
    var infoText = document.querySelector(".current")
    var future = document.querySelector('.forecasts');
    var cityName = inputField.value;
    //This is our first Url that will return the current information about a city
    var requestUrl = "https://api.openweathermap.org/data/2.5/weather?q=" + cityName + "&appid=" + apiKey;
    infoText.innerHTML = "";
    future.innerHTML = "";
    
    // Fetches the url and takes the response and converts it into json, so it can be read easily
    fetch(requestUrl)
    .then(function (response) {
        return response.json()
    })

    // Tasks that we have our function do, so that the proper information is displayed in the correct section and element
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
            uvIndex.id = weatherData.current.uvi;
            inputField.value = "";
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

// Listen for any clicks within the img-container div
list.addEventListener("click", function(event) {
    var element = event.target;
    if (element.matches("button")) {
        console.log(element.innerHTML)
        var primaryData = document.createElement('h1');
        var infoText = document.querySelector(".current")
        var future = document.querySelector('.forecasts');
        var cityName = inputField.value;
        //This is our first Url that will return the current information about a city
        var requestUrl = "https://api.openweathermap.org/data/2.5/weather?q=" + element.innerHTML + "&appid=" + apiKey;
        infoText.innerHTML = "";
        future.innerHTML = "";
        
        // Fetches the url and takes the response and converts it into json, so it can be read easily
        fetch(requestUrl)
        .then(function (response) {
            return response.json()
        })
    
        // Tasks that we have our function do, so that the proper information is displayed in the correct section and element
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
                uvIndex.id = weatherData.current.uvi;
                inputField.value = "";
                if (uvIndex.id <= 2) {
                    console.log(uvIndex.id)
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
                var currentInfo = document.querySelector(".forecasts") 
    var cityName = inputField.value.trim();
    var requestUrl = "https://api.openweathermap.org/data/2.5/forecast?q=" + element.innerHTML + "&units=imperial&appid=" + apiKey;
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
            })
        })
    }
    //     fetchPrimaryInfo();
    //     fetchSecondaryInfo();
});
  


