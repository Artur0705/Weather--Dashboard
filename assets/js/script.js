//Variables

var apiKey = "f236dc5006827e270df2416f6fb1c7c5";
var initialCities = [
  "Austin",
  "Chicago",
  "New York",
  "Orlando",
  "San Francisco",
  "Seattle",
  "Denver",
  "Atlanta",
];

// Fetch request

const fetchRequestObject = {
  method: "GET",
  headers: {
    Accept: "application/json",
  },
  mode: "cors",
};

//Getting data from API

function getCityData(cityName) {
  fetch(
    `https://api.openweathermap.org/data/2.5/weather?q=${cityName}&appid=${apiKey}`,
    fetchRequestObject
  )
    .then(function (response) {
      if (response.status === 200) {
        return response.json();
      } else {
        $("#errorMessage").text("No existing city found !");
      }
    })
    .then(function (response) {
      if (response) {
        localStorage.setItem("currentCity", response.name);
        var citiesState = localStorage.getItem("cities");
        citiesState = citiesState ? JSON.parse(citiesState) : null;

        if (citiesState && !citiesState.includes(response.name)) {
          localStorage.setItem(
            "cities",
            JSON.stringify([response.name, ...citiesState])
          );

          $("#cityList").prepend(`
            <li>
              <button onclick="getCityData('${response.name.toLowerCase()}')">${
            response.name
          }</button>
            </li>
          `);
        }

        $("#viewCityName").text(response.name);
        const date = moment(new Date().getTime() + response.timezone).format(
          "MM/DD/YYYY"
        );

        $("#viewDate").text("(" + date + ")");
        $("#viewIcon").attr(
          "src",
          `https://openweathermap.org/img/wn/${response.weather[0].icon}@2x.png`
        );

        $("#viewTempValue").text(response.main.temp);
        $("#viewWindValue").text(response.wind.deg);
        $("#viewHumidityValue").text(response.main.humidity);
        $("#viewHumidityValue").text(response.main.humidity);
        $("#errorMessage").text("");

        getFiveDaysInfo(response);
      }
    })
    .catch(function () {
      $("#errorMessage").text("No existing city found !");
    });
}

// Function to get 5 days forecast
function getFiveDaysInfo(response) {
  fetch(
    `https://api.openweathermap.org/data/2.5/onecall?lat=${response.coord.lat}&lon=${response.coord.lon}&exclude=minutely,hourly,alerts&units=metric&appid=${apiKey}`
  )
    .then(function (response) {
      if (response.status === 200) {
        return response.json();
      }
    })
    .then(function (response) {
      if (response) {
        var daily = response.daily.slice(1, 6);

        daily.forEach(({ dt, weather, temp, wind_speed, humidity }, index) => {
          $(`#${index + 1}cardDate`).text(moment(dt, "X").format("DD/MM/YYYY"));
          $(`#${index + 1}cardIcon`).attr(
            "src",
            `https://openweathermap.org/img/wn/${weather[0].icon}@2x.png`
          );
          $(`#${index + 1}cardTempValue`).text(temp.day);
          $(`#${index + 1}cardWindValue`).text(wind_speed);
          $(`#${index + 1}cardHumidityValue`).text(humidity);
        });

        var uvIndex = response.current.uvi;
        $("#viewUVIndexValue").text(uvIndex);
        $("#viewUVIndexValue").attr(
          "style",
          `background-color: ${
            uvIndex <= 2
              ? "#4fb400"
              : uvIndex <= 5
              ? "#f7e401"
              : uvIndex <= 7
              ? "#fb8603"
              : uvIndex <= 10
              ? "#d9001d"
              : "#b74cfe"
          }`
        );
      }
    });
}

//Function to search cities,displaying initial cities and storing data to local storage, displaying error messages
function onSearch() {
  var value = $("#searchInput").val();

  if (value.trim() === "") {
    $("#errorMessage").text("Please type the city name!");
  } else {
    getCityData(value.trim());
  }
}

var currentCity = localStorage.getItem("currentCity");
var citiesState = localStorage.getItem("cities");
citiesState = citiesState ? JSON.parse(citiesState) : null;

if (currentCity) {
  var value = $("#searchInput").val(currentCity);
  getCityData(currentCity);
} else {
  getCityData("austin");
}

if (citiesState) {
  citiesState.forEach((cityName) => {
    $("#cityList").append(`
        <li>
          <button onclick="getCityData('${cityName.toLowerCase()}')">${cityName}</button>
        </li>
      `);
  });
} else {
  localStorage.setItem("cities", JSON.stringify(initialCities));
  initialCities.forEach((cityName) => {
    $("#cityList").append(`
        <li>
          <button onclick="getCityData('${cityName.toLowerCase()}')">${cityName}</button>
        </li>
      `);
  });
}
