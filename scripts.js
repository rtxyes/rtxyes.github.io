const calculateButton = document.getElementById("calculateButton");
const addTripButton = document.getElementById("addTripButton");
const resetButton = document.getElementById("resetButton");
const tripList = document.getElementById("tripList");
const totalDisplay = document.getElementById("totalDisplay");
const baseTotalDisplay = document.getElementById("baseTotalDisplay");
const totalProp22Bonus = document.getElementById("totalProp22Bonus");

function calculateAllTrips() {
  const tripContainers = document.querySelectorAll(".trip");
  let grandTotal = 0;
  let grandBaseTotal = 0;
  let grandProp22BonusTotal = 0;

  tripContainers.forEach((trip) => {
    const basePay = parseFloat(trip.querySelector(".basePay")?.value) || 0;
    const customerTip = parseFloat(trip.querySelector(".customerTip")?.value) || 0;
    const hours = parseFloat(trip.querySelector(".hours")?.value) || 0;
    const minutes = parseFloat(trip.querySelector(".minutes")?.value) || 0;
    const seconds = parseFloat(trip.querySelector(".seconds")?.value) || 0;
    const miles = parseFloat(trip.querySelector(".milesDriven")?.value) || 0;

    if (minutes > 59 || seconds > 59) {
      alert("Minutes and seconds need to be between 0 and 59. (The incorrect trip(s) will not be added to the total.");
      return;
    }

    const decimalMinutes = minutes / 60;
    const decimalSeconds = seconds / 3600;
    const decimalTime = hours + decimalMinutes + decimalSeconds;
    const moneyByTime = decimalTime * 19.80;
    const moneyByMiles = miles * 0.36;
    const timePay = basePay > moneyByTime ? basePay : moneyByTime;
    const tripTotal = timePay + moneyByMiles + customerTip;
    const baseTotal = basePay + customerTip;
    const moneyTimeSubtraction = moneyByTime - basePay;
    const verifiedActiveMoney = moneyTimeSubtraction > 0 ? moneyTimeSubtraction : 0;
    const prop22Total = verifiedActiveMoney + moneyByMiles;

    grandTotal += tripTotal;
    grandBaseTotal += baseTotal;
    grandProp22BonusTotal += prop22Total;
  });

  totalDisplay.textContent = "$" + grandTotal.toFixed(2);
  baseTotalDisplay.textContent = "$" + grandBaseTotal.toFixed(2);
  totalProp22Bonus.textContent = "$" + grandProp22BonusTotal.toFixed(2);
}

function addNewTrip() {
  const firstTrip = document.querySelector(".trip");
  const newTrip = firstTrip.cloneNode(true);

  // Clear inputs in the cloned trip
  const inputs = newTrip.querySelectorAll("input");
  inputs.forEach((input) => (input.value = ""));

  // Show and set up remove button
  const removeBtn = newTrip.querySelector(".removeTripButton");
  if (removeBtn) {
    removeBtn.style.display = "inline-block";
    removeBtn.onclick = () => {
      newTrip.remove();
      calculateAllTrips();
      setupRemoveButtons(); // Re-check all buttons
    };
  }

  tripList.appendChild(newTrip);
  setupRemoveButtons();
}

//FIX BUG THAT CALCULATES GRAND TOTAL WHEN CLICKING X OF OTHER TRIP. IN OTHER WORDS ONLY REMOVE CALCULATION OF TRIP THAT NEEDS TO BE REMOVED IF ANY.

function setupRemoveButtons() {
  const trips = document.querySelectorAll(".trip");
  trips.forEach((trip, index) => {
    const removeBtn = trip.querySelector(".removeTripButton");
    if (!removeBtn) return;

    if (index === 0) {
      removeBtn.style.display = "none"; // Hide on first trip
    } else {
      removeBtn.style.display = "inline-block";
      removeBtn.onclick = () => {
        trip.remove();
        calculateAllTrips();
        setupRemoveButtons(); // Refresh button state
      };
    }
  });
}

function resetAll() {
  const trips = document.querySelectorAll(".trip");

  trips.forEach((trip, index) => {
    if (index === 0) {
      const inputs = trip.querySelectorAll("input");
      inputs.forEach((input) => (input.value = ""));
    } else {
      trip.remove();
    }
  });

  setupRemoveButtons();
  calculateAllTrips();
}

// Initial setup
setupRemoveButtons();

addTripButton.onclick = () => {
  addNewTrip();
};

calculateButton.onclick = calculateAllTrips;

resetButton.onclick = resetAll;
