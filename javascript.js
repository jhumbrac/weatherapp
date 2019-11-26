

// weather condition variables
var city;
var date;
var iconImg;
var temperature;
var humidity;
var windSpeed;
var uvIndex;
var currentWeatherPanel = $('<div>').attr('id', 'currentWeatherPanel');

var weatherStorage;
var recentArray = [];
var searchHistory;
var fiveDayForecast;

var fiveDayDate;
var fiveDayIcon;
var fiveDayTemp;
var fiveDayHumidity;
var fiveDayArray = [];
var fiveDayHeader = $('<h3>').text('Five day forecast');
var fiveDayPlot = $('<div>').attr('id', 'fiveDayPlot');
var fiveDayPanel = $('<div>').attr('id', 'fiveDayPanel');

var apiKey = 'ec1796913324d783d602ea29df8ec9d9';
//search bar and search history
var searchBar = $('<form>').attr('id', 'searchBar');
var citySearch = $('<input>').attr('type', 'search').attr('id', 'citySearch').attr('required', 'required');
var citySearchLabel = $('<label>').attr('for', 'citySearch').text('Search for a city');
var searchBtn = $('<button>').attr('id', 'searchBtn').html($('<img>').attr('src', 'images/magnifying-glass.svg'));
var clearHistoryBtn = $('<button>').attr('id', 'clearHistoryBtn').text('Clear history');
searchBar.append(citySearch, citySearchLabel, searchBtn);

var recentHistoryPanel = $('<div>').attr('id', 'recentHistoryPanel');
var recentHeader = $('<h2>').text('Recent Searches');
var recentUl = $('<ul>');
recentHistoryPanel.append(recentHeader, clearHistoryBtn, recentUl);

$('body').append(searchBar, recentHistoryPanel, currentWeatherPanel, fiveDayPanel);


function uvIndex() {
    $.ajax({
        url: uvIndUrl,
        method: 'GET'
    }).then(function(response) {
        // console.log('uvInd: ', response);
    });
}
function currentWeather(weatherLocation) {
    var currentWeather = `https://api.openweathermap.org/data/2.5/weather?q=${weatherLocation}&APPID=${apiKey}`;
    $.ajax({
        url: currentWeather,
        method: 'GET'
    }).then(function(response) {
        // console.log('current weather: ', response);
        lat = response.coord.lat;
        lon = response.coord.lon;
        uvIndUrl= `https://api.openweathermap.org/data/2.5/uvi?appid=${apiKey}&lat=${lat}&lon=${lon}`;
        uvIndex();
        populateCurrentWeather(response);
        console.log(response);
    });
}
function fiveDay(weatherLocation) {
    var fiveDay = `https://api.openweathermap.org/data/2.5/forecast?q=${weatherLocation}&APPID=${apiKey}`;
    $.ajax({
        url: fiveDay,
        method: 'GET'
    }).then(function(response) {
        console.log('five day: ', response);
        populateFiveDay(response);
    });
}
function storage(storageItem) {
    if (localStorage.weather) {
        recentArray = JSON.parse(localStorage.weather);
    }
    if (recentArray.indexOf(storageItem) === -1 ) {
        recentArray.push(storageItem);
        localStorage.setItem('weather', JSON.stringify(recentArray));
    } else ('already in array')
}
function clearHistory() {
    weatherStorage = JSON.parse(localStorage.weather);
    recentArray = [];
    localStorage.setItem('weather', JSON.stringify(recentArray));
    populateHistory();
}
function populateHistory() {
    recentUl.html('');
    if(localStorage.weather) {
        weatherStorage = JSON.parse(localStorage.weather);
        weatherStorage.forEach( function(item) {
            recentUl.prepend($('<li>').attr('class', 'searchResult').text(item));
        });
    }
}
populateHistory();
function toF(kelvin) {
    return (((kelvin - 273.15) * (9/5)) + 32).toFixed(0);
}
function populateCurrentWeather(response) {
    currentWeatherPanel.html('');
    var iconPath = `images/icons/${response.weather[0].icon}.svg`;
    city = $('<h2>').text(response.name);
    date = $('<p>').text(`Need variable for today's date`);
    iconImg = $('<img>').attr('src', iconPath).attr('alt', response.weather[0].description);
    //iconImg = $('<div>').load(iconPath);
    temperature = $('<h3>').attr('class', 'currentTemp').html('&deg;F').prepend($('<span>').text(toF(response.main.temp)));
    maxTemp = $('<p>').text(`hi: ${toF(response.main.temp_max)}`);
    minTemp = $('<p>').text(`lo: ${toF(response.main.temp_min)}`);
    humidity = $('<p>').text(`humidity: ${response.main.humidity}%`);
    // need variable to convert degree to direction
    windSpeed = $('<p>').text(`wind: ${response.wind.speed}`);

    currentWeatherPanel.append(city, date, iconImg, temperature, maxTemp, minTemp, humidity, windSpeed);
    
}
function populateUvIndex() {
    // uvIndex;
}
function populateFiveDay(response) {
    //fiveDayPanel.html('');
    fiveDayArray = response.list;
    var trace1 = {
        x: [],
        y: [],
        type: 'scatter',
    };
    var data = [trace1];
    console.log(fiveDayArray);
    fiveDayArray.forEach(function(item){
        trace1.y.push(toF(item.main.temp));
        trace1.x.push(item.dt_txt);
    })
    fiveDayPanel.append(fiveDayHeader, fiveDayPlot);
    Plotly.newPlot('fiveDayPlot', data);
    


    fiveDayDate;
    fiveDayIcon;
    fiveDayTemp;
    fiveDayHumidity;
}
function doItAll(weatherLocation) {
    currentWeather(weatherLocation);
    fiveDay(weatherLocation);
    storage(weatherLocation);
    populateHistory();
    citySearch.val('');
}
//buttons

$(document).on('click', '#searchBtn', function(event){
    event.preventDefault();
    var weatherLocation = citySearch.val().toLowerCase();
    doItAll(weatherLocation);
})
$(document).on('click', '.searchResult', function(event){
    var weatherLocation = $(this).text();
    doItAll(weatherLocation);
})
$(document).on('click', '#clearHistoryBtn', function(event){
    event.preventDefault();
    clearHistory();
})

