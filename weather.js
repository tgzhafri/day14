var apiKey = "524464bee91626f57dd5a3f9a6942c4a";
var tempEle = document.getElementById("temp");
var iconEle = document.getElementById("icon");
var humidityEle = document.getElementById("humidity");
var windEle = document.getElementById("wind");
var kelvin = 273.15;
var locationEle = document.getElementById("location");

if (navigator.geolocation) {
  navigator.geolocation.getCurrentPosition(showPosition);
} else {
  alert("Your browser does not support Geolocation!");
}

function showPosition(position) {
  console.log("my location is:", position);
  callWeatherApi(position);
}




function callWeatherApi(pos) {
  fetch(
    `https://api.openweathermap.org/data/2.5/onecall?lat=${pos.coords.latitude}&lon=${pos.coords.longitude}&appid=${apiKey}`
  )
    .then((res) => res.json()) //promise for method
    .then((data) => {
      console.log("daily data: ",data.daily);

        var daily = data.daily;

        daily.forEach((day, index) => {
            if(index === 0 || index === (daily.length - 1)) {
                return;
            }
            dailyWeatherEl(day, index);
        });

    });
}

function dailyWeatherEl (day, index) {
    var weatherHolder = document.getElementById('weather-holder');

    var weatherCard = document.createElement('div');
    weatherCard.classList.add('weather-card');

    var cardHeader = document.createElement('div');
    cardHeader.classList.add('card-header');

    var cardLocation = document.createElement('div');
    cardLocation.classList.add('card-location');

    var temp = document.createElement('h2');
    temp.setAttribute('id', 'temp');
    temp.innerHTML = (day.temp.day - kelvin).toFixed(1);

    var location = document.createElement('h4');
    
    location.innerHTML = `Location`;

    var icon = document.createElement('img');
    icon.classList.add('icon');
    icon.setAttribute('src',`https://openweathermap.org/img/w/${day.weather[0].icon}.png`)

    var humidity = document.createElement('h5');
    humidity.innerHTML = `<i class="fa fa-tint"></i>${day.humidity} %`;

    var wind = document.createElement('h5');
    wind.innerHTML = `<i class="fa fa-wind"></i>${day.wind_speed} km/h`;

    var dateTime = moment().utc(day.dt);
    var dayDate = moment(dateTime).add(index, 'day').format('dddd');

    var day = document.createElement('h4');
    day.innerHTML = dayDate;



    weatherHolder.append(weatherCard);
    weatherCard.append(day);
    weatherCard.append(cardHeader);
    weatherCard.append(humidity);
    weatherCard.append(wind);
    cardHeader.append(cardLocation);
    cardHeader.append(icon);
    cardLocation.appendChild(temp);
    cardLocation.appendChild(location);

}


function currentApi(city) {
  fetch(
    `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}`
  )
    .then((res) => res.json())
    .then((data) => {
      console.log("current city:", data);

      var timezone = data.name;
      var humidity = data.main.humidity;
      var weatherMain = data.weather[0].main;
      var weatherIcon = data.weather[0].icon;
      var temp = (data.main.temp - kelvin).toFixed(1);
      var wind = data.wind.speed;

      // to use date time template from moment website
      var dateTime = moment().utc(data.dt).format("MMMM Do YYYY, h:mm:ss a");

      console.log("current date time is: ", dateTime);

      tempEle.innerHTML = temp;
      iconEle.src = `https://openweathermap.org/img/w/${weatherIcon}.png`;
      humidityEle.innerHTML = `<i class="fa fa-tint"></i>${humidity} %`;
      windEle.innerHTML = `<i class="fa fa-wind"></i>${wind} km/h`;
      locationEle.innerHTML = timezone;

      var dateTimeEle = document.getElementById('currentDt');
      dateTimeEle.innerHTML = dateTime;
    });
}
currentApi("Kuala Lumpur");



