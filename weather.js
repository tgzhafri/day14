var apiKey = "524464bee91626f57dd5a3f9a6942c4a";
var tempEle = document.getElementById("temp");
var iconEle = document.getElementById("icon");
var humidityEle = document.getElementById("humidity");
var windEle = document.getElementById("wind");
var kelvin = 273.15;
var locationEle = document.getElementById("location");

var inputVal = document.getElementById("input");
var btn = document.getElementById("btn");
var searching = false;

input.addEventListener("keyup", enter);
function enter(evt) {
  if (evt.keyCode === 13) {
    evt.preventDefault();
    btn.click();
  }
}

function searchCity() {
  var searched = inputVal.value;

  console.log("search initiated:", searched);
  searching = true;
  currentApi(searched);
}

if (navigator.geolocation) {
  navigator.geolocation.getCurrentPosition(showPosition);
} else {
  alert("Your browser does not support Geolocation!");
}

function showPosition(position) {
  console.log("my current location is:", position);

  var location = {
    lon: position.coords.longitude,
    lat: position.coords.latitude,
  };
  callWeatherApi(location);
  searching = false;
}

function currentApi(city) {
  fetch(
    `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}`
  )
    .then((res) => res.json())
    .then((data) => {
      console.log("current city:", data);

      var location = {
        lon: data.coord.lon,
        lat: data.coord.lat,
      };
      console.log("currentAPI location:", location);

      var timezone = data.name;
      locationEle.innerHTML = timezone;

      if (searching == false) {
        return;
      }
      callWeatherApi(location);
    });
}
currentApi("Kuala Lumpur");

function callWeatherApi(pos) {
  fetch(
    `https://api.openweathermap.org/data/2.5/onecall?lat=${pos.lat}&lon=${pos.lon}&appid=${apiKey}`
  )
    .then((res) => res.json()) //promise for method
    .then((data) => {
      console.log("daily data: ", data.daily);

      var daily = data.daily;

      daily.forEach((day, index) => {
        if (index === 0 || index === daily.length - 1) {
          return;
        }
        dailyWeatherEl(day, index);
      });
    });
}

function dailyWeatherEl(day, index) {
  console.log("daily weather el function called");
  // for dateTime

  var dateTime = moment().utc(day.dt);
  var fullDateTime = moment().utc(day.dt).format("MMMM Do YYYY, h:mm:ss a");
  var topDayVal = moment().utc(day.dt).format("dddd");
  var dayDate = moment(dateTime).add(index, "day").format("MMM Do YY");
  var dayVal = moment(dateTime).add(index, "day").format("dddd");

  var dayEle = document.createElement("h4");
  dayEle.innerHTML = dayVal;
  var dateVal = document.createElement("h4");
  dateVal.innerHTML = dayDate;

  // for current day top section
  tempEle.innerHTML = (day.temp.day - kelvin).toFixed(1);
  iconEle.src = `https://openweathermap.org/img/w/${day.weather[0].icon}.png`;
  humidityEle.innerHTML = `<i class="fa fa-tint"></i>${day.humidity} %`;
  windEle.innerHTML = `<i class="fa fa-wind"></i>${day.wind_speed} km/h`;

  var dateTimeCurr = document.getElementById("currentDt");
  dateTimeCurr.innerHTML = fullDateTime;

  var dayEleCurr = document.getElementById("current-day");
  dayEleCurr.innerHTML = topDayVal;

  // for daily update bottom section

  var weatherHolder = document.getElementById("weather-holder");

  var weatherCard = document.createElement("div");
  weatherCard.classList.add("weather-card");

  var cardHeader = document.createElement("div");
  cardHeader.classList.add("card-header");

  var cardLocation = document.createElement("div");
  cardLocation.classList.add("card-location");

  var temp = document.createElement("h2");
  temp.setAttribute("id", "temp");
  temp.innerHTML = (day.temp.day - kelvin).toFixed(1);

  var icon = document.createElement("img");
  icon.classList.add("icon");
  icon.setAttribute(
    "src",
    `https://openweathermap.org/img/w/${day.weather[0].icon}.png`
  );

  var humidity = document.createElement("h5");
  humidity.innerHTML = `<i class="fa fa-tint"></i>${day.humidity} %`;

  var wind = document.createElement("h5");
  wind.innerHTML = `<i class="fa fa-wind"></i>${day.wind_speed} km/h`;

  

  weatherHolder.appendChild(weatherCard);
  weatherCard.appendChild(dayEle);
  weatherCard.appendChild(dateVal);
  weatherCard.appendChild(temp);
  weatherCard.appendChild(icon);
  weatherCard.appendChild(humidity);
  weatherCard.appendChild(wind);

}
