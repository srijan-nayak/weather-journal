const API_KEY = "ffa855ec803fab1b9cefafc7e6a9f4a4";
const API_ROOT = "https://api.openweathermap.org/data/2.5/weather?";

const fetchCurrentTemp = async () => {
  const zipInput = document.querySelector("#zip");
  const countryCodeInput = document.querySelector("#country");
  const zipCode = zipInput.value;
  const countryCode = countryCodeInput.value;

  const apiURL = `${API_ROOT}zip=${zipCode},${countryCode}&units=metric&appid=${API_KEY}`;
  const response = await fetch(apiURL);
  if (!response.ok) {
    // add red outlines to indicate incorrect inputs
    zipInput.classList.add("incorrect-input");
    countryCodeInput.classList.add("incorrect-input");
  } else {
    // remove any previous red outlines from the inputs
    zipInput.classList.remove("incorrect-input");
    countryCodeInput.classList.remove("incorrect-input");

    const weatherData = await response.json();
    return weatherData.main.temp;
  }
};

const updateEntries = async () => {
  const currentTemp = await fetchCurrentTemp();
  if (!currentTemp) {
    alert(
      "Couldn't fetch weather data for the given country code and ZIP code combination!"
    );
  } else {
    console.log(currentTemp);
  }
};

const addEntryButton = document.querySelector("#generate");
addEntryButton.addEventListener("click", updateEntries);
