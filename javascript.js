

// weather condition variables
var city;
var date;
var iconImg;
var temperature;
var humidity;
var windSpeed;
var uvIndex;
var apiKey = 'ec1796913324d783d602ea29df8ec9d9';
//search bar and search history
var searchForm = $('<form>').attr('id', 'searchForm');
var citySearch = $('<input>').attr('type', 'text').attr('id', 'citySearch');
var citySearchLabel = $('<label>').attr('for', 'citySearch').text('Search for a city');
var searchBtn = $('<button>').attr('id', 'searchBtn').text('search');
$('body').append(searchForm);
searchForm.append(citySearch, citySearchLabel, searchBtn);

// clicking on history item executes new search

// 5 day forecast function

// search history function

// current conditions function

// uv index function

// multiple ajax calls

// local storage

// Get an API Key from OpenWeatherMap API
function uvIndex() {
    $.ajax({
        url: uvIndUrl,
        method: 'GET'
    }).then(function(response) {
        console.log('uvInd: ', response);
    });
}
function currentWeather(weatherLocation) {
    var currentWeather = `https://api.openweathermap.org/data/2.5/weather?q=${weatherLocation}&APPID=${apiKey}`;
    $.ajax({
        url: currentWeather,
        method: 'GET'
    }).then(function(response) {
        console.log('current weather: ', response);
        lat = response.coord.lat;
        lon = response.coord.lon;
        uvIndUrl= `http://api.openweathermap.org/data/2.5/uvi?appid=${apiKey}&lat=${lat}&lon=${lon}`;
        uvIndex();
    });
}
function fiveDay(weatherLocation) {
    var fiveDay = `https://api.openweathermap.org/data/2.5/forecast?q=${weatherLocation}&APPID=${apiKey}`;
    $.ajax({
        url: fiveDay,
        method: 'GET'
    }).then(function(response) {
        console.log('five day: ', response);
    });
}

searchBtn.on('click', event=>{
    event.preventDefault();
    var weatherLocation = citySearch.val();
    currentWeather(weatherLocation);
    fiveDay(weatherLocation);
})
