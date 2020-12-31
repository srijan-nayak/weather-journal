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

const getFeelings = () => {
  const feelingsInput = document.querySelector("#feelings");
  const feelings = feelingsInput.value;

  if (!feelings) {
    // add red outline to indicate empty textarea
    feelingsInput.classList.add("incorrect-input");
  } else {
    // remove red outline if content is present
    feelingsInput.classList.remove("incorrect-input");
    return feelings;
  }
};

const addEntry = async (temp, feelings, date) => {
  const response = await fetch("/entries/post", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ temp, feelings, date }),
  });
  return response;
};

const getEntries = async () => {
  const response = await fetch("/entries");
  return response.json();
};

const updateUI = (entries) => {
  const noDataPlaceholder = document.querySelector(".no-data");
  const entriesSection = document.querySelector(".entries");
  // hide the no-data placeholder
  noDataPlaceholder.classList.add("no-data--hidden");
  // make the entries section visible
  entriesSection.classList.remove("entries--hidden");

  const mostRecentEntry = entries[0];

  const getFormattedDate = (date) => {
    // extract 'Month DD YYYY' from the date string representation
    const [month, day, year] = date.toString().split(" ").slice(1, 4);
    return `${day} ${month}, ${year}`;
  };
  const getFormattedTemp = (temp) => `${Math.round(temp)}℃`;

  const formattedDate = getFormattedDate(new Date(mostRecentEntry.date));
  const formattedTemp = getFormattedTemp(mostRecentEntry.temp);

  // update the divs in #entryHolder which displays the most recent entry
  document.querySelector("#date").innerText = formattedDate;
  document.querySelector("#temp").innerText = formattedTemp;
  document.querySelector("#content").innerText = mostRecentEntry.feelings;

  const entryRows = document.createDocumentFragment();
  // create a row for each entry and then append it to the document fragment
  entries.forEach((entry) => {
    const row = document.createElement("tr");

    const dateData = document.createElement("td");
    const tempData = document.createElement("td");
    const contentData = document.createElement("td");

    dateData.innerText = getFormattedDate(new Date(entry.date));
    tempData.innerText = getFormattedTemp(entry.temp);
    contentData.innerText = entry.feelings;

    row.appendChild(dateData);
    row.appendChild(tempData);
    row.appendChild(contentData);

    entryRows.appendChild(row);
  });
  // clear the content in the table body, then append the document fragment containing the rows
  const entriesTableBody = document.querySelector(".entries__table tbody");
  entriesTableBody.innerHTML = "";
  entriesTableBody.appendChild(entryRows);
};

const updateEntries = async () => {
  const currentTemp = await fetchCurrentTemp();
  const feelings = getFeelings();
  const today = new Date(Date.now());

  if (!currentTemp) {
    alert(
      "Couldn't fetch weather data for the given country code and ZIP code combination!"
    );
  } else if (!feelings) {
    alert("No thoughts found to enter in journal!");
  } else {
    await addEntry(currentTemp, feelings, today);
    const entries = await getEntries();
    updateUI(entries);
  }
};

const addEntryButton = document.querySelector("#generate");
addEntryButton.addEventListener("click", updateEntries);
