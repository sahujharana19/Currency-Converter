const BASE_URL = "https://api.exchangerate-api.com/v4/latest/";

const dropdowns = document.querySelectorAll(".dropdown select");
const btn = document.querySelector("form button");
const fromCurr = document.querySelector(".from select");
const toCurr = document.querySelector(".to select");
const msg = document.querySelector(".msg");
const amountInput = document.querySelector(".amount input");

// Populate dropdowns with currency codes
for (let select of dropdowns) {
  for (let currCode in countryList) {
    let newOption = document.createElement("option");
    newOption.innerText = currCode;
    newOption.value = currCode;

    if (select.name === "from" && currCode === "USD") {
      newOption.selected = "selected";
    } else if (select.name === "to" && currCode === "INR") {
      newOption.selected = "selected";
    }
    select.append(newOption);
  }
  select.addEventListener("change", (evt) => updateFlag(evt.target));
}

// Function to update exchange rate on button click only
const updateExchangeRate = async () => {
  let amtVal = amountInput.value.trim();

  // Check if amount is valid
  if (amtVal === "" || isNaN(amtVal) || amtVal <= 0) {
    msg.innerText = "Please enter a valid amount!";
    return;
  }

  const URL = `${BASE_URL}${fromCurr.value}`;

  try {
    let response = await fetch(URL);
    if (!response.ok) throw new Error("API Fetch Failed");

    let data = await response.json();
    console.log("API Response:", data);

    let rate = data.rates[toCurr.value];
    if (!rate) throw new Error("Exchange rate not found");

    let finalAmount = (amtVal * rate).toFixed(2);
    msg.innerText = `${amtVal} ${fromCurr.value} = ${finalAmount} ${toCurr.value}`;
  } catch (error) {
    console.error(error);
    msg.innerText = "Error fetching exchange rate";
  }
};

// Function to update flag images
const updateFlag = (element) => {
  let currCode = element.value;
  let countryCode = countryList[currCode];
  let newSrc = `https://flagsapi.com/${countryCode}/flat/64.png`;
  let img = element.parentElement.querySelector("img");
  img.src = newSrc;
};

// Run exchange rate update only on button click
btn.addEventListener("click", (evt) => {
  evt.preventDefault();
  updateExchangeRate();
});

// Clear input field when user starts typing
amountInput.addEventListener("focus", () => {
  amountInput.value = "";
});
