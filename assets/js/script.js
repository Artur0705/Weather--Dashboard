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

const fetchRequestObject = {
    method: "GET",
    headers: {
        Accept: "application/json",
    },
    mode: "cors",
}

//Getting data from API

function getCityData(cityName) {
    fetch(
        `http://api.openweathermap.org/data/2.5/weather?q=${cityName}&appid=${apiKey}`,
        fetchRequestObject
    )
    .then(function (response) {
        if (response.status === 200) {
            return response.json();
        } else {
            $("#errorMessage").text("no existing city found!");
        }
       
    })
    .then(function (response) {
        if (response) {
            localStorage.setItem("currentCity", response.name);
            var citiesState = localStorage.getItem("cities");
            citiesState = citiesState ? JSON.parse(citiesState) : null;

            if(citiesState && !citiesState.includes(response.name)) {
                localStorage.setItem(
                    "cities",
                    JSON.stringify([response.name, ...citiesState])
                );

                $("#cityList").prepend(`
                <li>
                    <button onclick="getCityData('${response.name.toLowerCase()}')">${response.name}</button>
                </li>     
                `)
            }

            $("viewCityName").text(response.name);
            const date = moment(new Date().getTime() + response.timezone).format("MM/DD/YYYY");

            $("#viewDate").text("(" + date + ")");
            $("#viewIcon").attr("src",
            `http://openweathermap.org/img/wn/${response.weather[0].icon}@2x.png`);

            $("#viewTempValue").text(response.main.temp);
            $("#viewWindValue").text(response.wind.deg);
            $("#viewHumidityValue").text(response.main.humidity);
            $("#viewHumidityValue").text(response.main.humidity);
            $("#errorMessage").text("");

            getFiveDaysInfo(response);
            }
        })
        .catch(function() {
            $("#errorMessage").text("No existing city found !");
        });
}