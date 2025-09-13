// ?----HTML ELEMENTS ----
const forecastContainer = document.querySelector(".forecast-cards");
const searchBox = document.getElementById("searchBox");
const locationElement = document.querySelector(".userlocation");
const allBars = document.querySelectorAll(".clock");
const cityContainer = document.querySelector(".city-items");
console.log(allBars);
// *----Global Variables ----
const apiKey = "ccfb4b43ed9148a3ab2230152240601";
const baseUrl = "http://api.weatherapi.com/v1/forecast.json";
("http://api.weatherapi.com/v1/forecast.json?key=ccfb4b43ed9148a3ab2230152240601&q=London&days=3");
let myLocation = "cairo";
let allDaysArr = [];
let imgsresultsobj = {};
let allImgs = [];
// &----Functions ----
async function getWeather(location) {
  let response = await fetch(`${baseUrl}?key=${apiKey}&q=${location}&days=7`);
  let data = await response.json();
  console.log(data);
  allDaysArr = data.forecast.forecastday;

  locationElement.innerHTML = `${data.location.name}, ${data.location.country}`;
  displayWeather();
  getCityImage(data.location.name);
}
function getuserLocation(currentLocation) {
  myLocation = `${currentLocation.coords.latitude},${currentLocation.coords.longitude}`;
  getWeather(myLocation);
}
function displayWeather() {
  let timeNow = new Date();
  let cardsHtml = "";
  for (let [index, day] of allDaysArr.entries()) {
    // console.log(index, day);
    console.log(day);
    let myDate = new Date(day.date);
    cardsHtml += `
      <div class= "cardd ${index == 0 ? "active" : ""}" >
      <div class="card-header d-flex justify-content-between">
        <div class="day">${myDate.toLocaleDateString("en-US", {
          weekday: "long",
        })}</div>
        <div class="time">${timeNow.getHours()}:${timeNow.getMinutes()} ${
      timeNow.getHours() > 11 ? "PM" : "AM"
    }</div>
      </div>
      <div class="card-body">
        <img src="${day.day.condition.icon}" />
        <div class="degree">${day.hour[timeNow.getHours()].temp_c}°C</div>
      </div>
      <div class="card-data">
        <ul class="left-column ">
          <li>Real Feel: <span class="real-feel">${
            day.hour[timeNow.getHours()].feelslike_c
          }°C</span></li>
          <li>Wind: <span class="wind">${
            day.hour[timeNow.getHours()].wind_mph
          } K/h</span></li>
          <li>Pressure: <span class="pressure">${
            day.hour[timeNow.getHours()].pressure_mb
          }Mb</span></li>
          <li>Humidity: <span class="humidity">${
            day.hour[timeNow.getHours()].humidity
          }%</span></li>
        </ul>
        <ul class="right-column d-flex justify-content-between flex-column">
          <li>Sunrise: <span class="sunrise">${day.astro.sunrise}</span></li>
          <li>Sunset: <span class="sunset">${day.astro.sunset}</span></li>
        </ul>
      </div>
    </div>
    `;
  }
  forecastContainer.innerHTML = cardsHtml;
  const allCards = document.querySelectorAll(".cardd");
  let activeCard = document.querySelector(".active");
  for (let [index, cardobj] of allCards.entries()) {
    cardobj.addEventListener("click", () => {
      cardobj.classList.add("active");
      activeCard.classList.remove("active");
      activeCard = cardobj;
      displayRainInfo(allDaysArr[index]);
    });
  }
}
function displayRainInfo(cardRainInfo) {
  console.log(cardRainInfo);
  for (let [index, card] of allBars.entries()) {
    console.log(card.getAttribute("data-clock"));
    const dayHour = parseInt(card.getAttribute("data-clock"));

    card.querySelector(
      ".percent"
    ).style.width = `${cardRainInfo.hour[dayHour].chance_of_rain}%`;
  }
}
async function getCityImage(city) {
  let response = await fetch(
    `https://api.unsplash.com/search/photos?page=1&query=${city}&client_id=maVgNo3IKVd7Pw7-_q4fywxtQCACntlNXKBBsFdrBzI&per_page=1&orientation=landscape`
  );
  imgsresultsobj = await response.json();
  console.log(imgsresultsobj);
  allImgs = imgsresultsobj.results;
  console.log(allImgs);

  let itemContent = `
  <div class="city-item ">
    <div class="city-image">
      <img src="${allImgs[0].urls.regular}" alt="Image for ${city} city" />
    </div>
    <div class="city-name"><span class="city-name">${city}</span></div>
  </div>
`;
  cityContainer.innerHTML += itemContent;
}
// !----Events ----
window.addEventListener("load", () => {
  navigator.geolocation.getCurrentPosition(getuserLocation);
});
// searchBox.addEventListener("blur", () => {
//   getWeather(searchBox.value);
// });
document.addEventListener("keyup", (e) => {
  if (e.key === "Enter") {
    getWeather(searchBox.value);
  }
});
