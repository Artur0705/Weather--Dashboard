var apiKey = "f236dc5006827e270df2416f6fb1c7c5";

const fetchRequestObject = {
    method: "GET",
    headers: {
        Accept: "application/json",
    },
    mode: "cors",
}

function getCityData(cityname) {
    fetch(
        `http://api.openweathermap.org/data/2.5/weather?q=${cityName}&appid=${apiKey}`,
        fetchRequestObject
    )
    .then(function (response) {
        return response.json();
    })
    .then(function (response) {
        localStorage.setItem("currentCity", cityName);
        $("viewCityName").text(response.name);
        const date = moment(new Date().getTime() + response.timezone).format("MM/DD/YYYY");
    })
}