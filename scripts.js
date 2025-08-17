const calculateButton = document.getElementById("calculate-button");
const addTripButton = document.getElementById("add-trip-button");
const resetButton = document.getElementById("reset-button");
const grandTotalSubheading = document.getElementById("grand-total-subheading");
const baseTotalSubheading = document.getElementById("base-total-subheading");
const prop22TotalSubheading = document.getElementById("prop22-total-subheading");
const trips = document.querySelector(".trips");
const results = document.querySelector(".results");

function calculateAllTrips() {
  const trip = document.querySelectorAll(".trip");

  let grandBaseTotal = 0;
  let grandProp22Total = 0;
  let grandTotal = 0;

  trip.forEach((trip) => {
    const basePay = parseFloat(trip.querySelector(".base-pay")?.value) || 0;
    const customerTip = parseFloat(trip.querySelector(".customer-tip")?.value) || 0;
    const hours = parseFloat(trip.querySelector(".hours")?.value) || 0;
    const minutes = parseFloat(trip.querySelector(".minutes")?.value) || 0;
    const seconds = parseFloat(trip.querySelector(".seconds")?.value) || 0;
    const miles = parseFloat(trip.querySelector(".miles-driven")?.value) || 0;

    if (minutes > 59 || seconds > 59) {
      alert("Minutes and seconds need to be between 0 and 59. (The incorrect trip(s) will not be added to the total.");
      return;
    }

    const decimalMinutes = minutes / 60;
    const decimalSeconds = seconds / 3600;
    const decimalTime = hours + decimalMinutes + decimalSeconds;
    const moneyByTime = decimalTime * 19.8;
    const prop22MoneyByMiles = miles * 0.36;
    const timePay = basePay > moneyByTime ? basePay : moneyByTime;
    const tripTotal = timePay + prop22MoneyByMiles + customerTip;
    const baseTotal = basePay + customerTip;
    const moneyByTimeDifference = moneyByTime - basePay;
    const prop22ActiveTime = moneyByTimeDifference > 0 ? moneyByTimeDifference : 0;
    const prop22Total = prop22ActiveTime + prop22MoneyByMiles;

    grandBaseTotal += baseTotal;
    grandProp22Total += prop22Total;
    grandTotal += tripTotal;
  });

  baseTotalSubheading.textContent = "$" + grandBaseTotal.toFixed(2);
  prop22TotalSubheading.textContent = "$" + grandProp22Total.toFixed(2);
  grandTotalSubheading.textContent = "$" + grandTotal.toFixed(2);

  results.classList.add("active");
}

function addNewTrip() {
  const trip = document.querySelector(".trip");
  const additionalTrip = trip.cloneNode(true);

  const inputs = additionalTrip.querySelectorAll("input");
  inputs.forEach((input) => (input.value = ""));

  const removeTripButton = additionalTrip.querySelector(".remove-trip-button");

  if (removeTripButton) {
    removeTripButton.style.display = "inline-block";

    removeTripButton.onclick = () => {
      additionalTrip.remove();
      calculateAllTrips();
      setupRemoveButtons();
    };
  }

  trips.appendChild(additionalTrip);
  setupRemoveButtons();
}

function setupRemoveButtons() {
  const trip = document.querySelectorAll(".trip");

  trip.forEach((trip, index) => {
    const removeTripButton = trip.querySelector(".remove-trip-button");
    if (!removeTripButton) return;
    
    if (index === 0) {
      removeTripButton.style.display = "none";
    } else {
      removeTripButton.style.display = "inline-block";
      removeTripButton.onclick = () => {
        trip.remove();
        if (results.classList.contains("active")) {
          calculateAllTrips();
        }
        setupRemoveButtons();
      };
    }
  });
}

function resetAll() {
  const trip = document.querySelectorAll(".trip");

  trip.forEach((trip, index) => {
    if (index === 0) {
      const inputs = trip.querySelectorAll("input");
      inputs.forEach((input) => (input.value = ""));
    } else {
      trip.remove();
    }
  });

  setupRemoveButtons();
  calculateAllTrips();

  results.classList.remove("active");
}

addTripButton.onclick = () => {
  addNewTrip();
};

setupRemoveButtons();
calculateButton.onclick = calculateAllTrips;
resetButton.onclick = resetAll;
