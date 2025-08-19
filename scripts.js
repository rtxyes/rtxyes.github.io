const addTripButton = document.getElementById("add-trip-button");
const resetButton = document.getElementById("reset-button");
const calculateButton = document.getElementById("calculate-button");
const tripsContainer = document.querySelector(".trips");
const results = document.querySelector(".results");
const breakdowns = document.querySelector(".breakdowns");

function calculateTrips() {
  const trips = document.querySelectorAll(".trip");
  const breakdownsContainer = document.querySelector(".breakdowns");

  const originalBreakdown = breakdownsContainer.querySelector(".breakdown");
  breakdownsContainer.querySelectorAll(".breakdown:not(:first-child)").forEach((b) => b.remove());

  let grandBaseTotal = 0;
  let grandProp22Total = 0;
  let grandTotal = 0;

  trips.forEach((trip, index) => {
    const inputs = trip.querySelectorAll("input");
    const [baseInput, tipInput, hoursInput, minutesInput, secondsInput, milesInput] = inputs;

    const base = parseFloat(baseInput.value) || 0;
    const tip = parseFloat(tipInput.value) || 0;
    const hours = parseFloat(hoursInput.value) || 0;
    const minutes = parseFloat(minutesInput.value) || 0;
    const seconds = parseFloat(secondsInput.value) || 0;
    const miles = parseFloat(milesInput.value) || 0;

    if (minutes > 59 || seconds > 59) {
      alert(`Trip #${index + 1}: Minutes and seconds must be between 0 and 59. Skipping this trip.`);
      return;
    }

    console.log(inputs);

    const decimalTime = hours + minutes / 60 + seconds / 3600;
    const moneyByTime = decimalTime * 19.8;
    const moneyByMiles = miles * 0.36;

    const timePay = Math.max(base, moneyByTime);
    const baseTotal = base + tip;
    const prop22Bonus = Math.max(0, moneyByTime - base) + moneyByMiles;
    const tripTotal = timePay + moneyByMiles + tip;

    grandBaseTotal += baseTotal;
    grandProp22Total += prop22Bonus;
    grandTotal += tripTotal;

    const breakdown = originalBreakdown.cloneNode(true);
    breakdown.style.display = "block";

    breakdown.querySelector(".breakdown-trip-number").textContent = `Trip #${index + 1}`;
    breakdown.querySelector(".breakdown-base-total").textContent = `$${baseTotal.toFixed(2)}`;
    breakdown.querySelector(".breakdown-prop22-total").textContent = `$${prop22Bonus.toFixed(2)}`;
    breakdown.querySelector(".breakdown-grand-total").textContent = `$${tripTotal.toFixed(2)}`;

    breakdownsContainer.appendChild(breakdown);
  });

  originalBreakdown.style.display = "none";

  document.querySelector("#result-base-total").textContent = `$${grandBaseTotal.toFixed(2)}`;
  document.querySelector("#result-prop22-total").textContent = `$${grandProp22Total.toFixed(2)}`;
  document.querySelector("#result-grand-total").textContent = `$${grandTotal.toFixed(2)}`;

  document.querySelector(".results").classList.add("active");
  breakdownsContainer.classList.add("active");
}

function addNewTrip() {
  const originalTrip = document.querySelector(".trip");
  const additionalTrip = originalTrip.cloneNode(true);

  const inputs = additionalTrip.querySelectorAll("input");
  inputs.forEach((element) => {
    element.value = "";
  });

  const removeTripButton = additionalTrip.querySelector(".remove-trip-button");

  if (removeTripButton) {
    removeTripButton.onclick = () => {
      additionalTrip.remove();
      calculateTrips();
      setupRemoveButtons();
    };
  }

  tripsContainer.appendChild(additionalTrip);
  setupRemoveButtons();
}

function setupRemoveButtons() {
  const trips = document.querySelectorAll(".trip");

  trips.forEach((trip, index) => {
    const removeTripButton = trip.querySelector(".remove-trip-button");
    if (!removeTripButton) return;

    if (index === 0) {
      removeTripButton.style.display = "none";
    } else {
      removeTripButton.style.display = "inline-block";

      removeTripButton.onclick = () => {
        trip.remove();

        if (results.classList.contains("active")) {
          calculateTrips();
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
  calculateTrips();

  results.classList.remove("active");
  breakdowns.classList.remove("active");
}

addTripButton.onclick = () => {
  addNewTrip();
};

setupRemoveButtons();
calculateButton.onclick = calculateTrips;
resetButton.onclick = resetAll;
