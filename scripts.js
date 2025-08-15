// ------------------------------------------
// Element References
// ------------------------------------------

// Button elements
const calculateButton = document.getElementById("calculateButton");
const addTripButton = document.getElementById("addTripButton");
const resetButton = document.getElementById("resetButton");

// Container for all trip entries
const tripList = document.getElementById("tripList");

// Output display elements
const totalDisplay = document.getElementById("totalDisplay");
const baseTotalDisplay = document.getElementById("baseTotalDisplay");
const totalProp22Bonus = document.getElementById("totalProp22Bonus");
const resultsDiv = document.getElementById("resultsDiv");

/**
 * Calculates totals across all trips and updates the UI.
 * - Adds up base pay, customer tips, and Prop 22 bonuses.
 * - Converts time (HH:MM:SS) into a decimal hour format for calculations.
 * - Applies Prop 22 logic to determine minimum earnings per hour and per mile.
 * - Displays calculated totals and shows the results section.
 */
function calculateAllTrips() {
  const tripContainers = document.querySelectorAll(".trip");

  // Initialize grand totals
  let grandTotal = 0;
  let grandBaseTotal = 0;
  let grandProp22BonusTotal = 0;

  tripContainers.forEach((trip) => {
    // Extract and parse all input values
    const basePay = parseFloat(trip.querySelector(".basePay")?.value) || 0;
    const customerTip = parseFloat(trip.querySelector(".customerTip")?.value) || 0;
    const hours = parseFloat(trip.querySelector(".hours")?.value) || 0;
    const minutes = parseFloat(trip.querySelector(".minutes")?.value) || 0;
    const seconds = parseFloat(trip.querySelector(".seconds")?.value) || 0;
    const miles = parseFloat(trip.querySelector(".milesDriven")?.value) || 0;

    // Validate that minutes and seconds are within the allowed range
    if (minutes > 59 || seconds > 59) {
      alert("Minutes and seconds need to be between 0 and 59. (The incorrect trip(s) will not be added to the total.");
      return;
    }

    // Convert time to decimal hours
    const decimalMinutes = minutes / 60;
    const decimalSeconds = seconds / 3600;
    const decimalTime = hours + decimalMinutes + decimalSeconds;

    // Calculate pay based on time and distance
    const moneyByTime = decimalTime * 19.8; // $19.80/hour minimum guaranteed
    const moneyByMiles = miles * 0.36; // $0.36/mile reimbursement

    // Apply Prop 22 logic: driver gets whichever is higher between base pay and guaranteed time pay
    const timePay = basePay > moneyByTime ? basePay : moneyByTime;

    // Total for this trip, including time pay, mileage, and tip
    const tripTotal = timePay + moneyByMiles + customerTip;

    // Total based strictly on base pay + tip
    const baseTotal = basePay + customerTip;

    // Calculate Prop 22 bonus (if guaranteed time pay > base pay)
    const moneyTimeSubtraction = moneyByTime - basePay;
    const verifiedActiveMoney = moneyTimeSubtraction > 0 ? moneyTimeSubtraction : 0;
    const prop22Total = verifiedActiveMoney + moneyByMiles;

    // Accumulate to grand totals
    grandTotal += tripTotal;
    grandBaseTotal += baseTotal;
    grandProp22BonusTotal += prop22Total;
  });

  // Update the UI with calculated totals
  totalDisplay.textContent = "$" + grandTotal.toFixed(2);
  baseTotalDisplay.textContent = "$" + grandBaseTotal.toFixed(2);
  totalProp22Bonus.textContent = "$" + grandProp22BonusTotal.toFixed(2);

  // Show the results section
  resultsDiv.classList.add("active");
}

/**
 * Creates a new trip entry by cloning the first existing trip element.
 * - Clears input values in the cloned trip.
 * - Sets up the remove button functionality.
 * - Appends the new trip to the trip list and updates all remove buttons.
 */
function addNewTrip() {
  const firstTrip = document.querySelector(".trip"); // Reference the first trip element
  const newTrip = firstTrip.cloneNode(true); // Create a deep clone of the first trip

  // Clear all input fields in the cloned trip
  const inputs = newTrip.querySelectorAll("input");
  inputs.forEach((input) => (input.value = ""));

  // Initialize the remove button for the cloned trip
  const removeBtn = newTrip.querySelector(".removeTripButton");
  if (removeBtn) {
    removeBtn.style.display = "inline-block";

    removeBtn.onclick = () => {
      newTrip.remove(); // Remove this trip

      calculateAllTrips(); // Recalculate totals or results after removal
      setupRemoveButtons(); // Reapply button visibility logic
    };
  }

  // Add the new trip to the DOM
  tripList.appendChild(newTrip);

  // Update remove button visibility and handlers for all trips
  setupRemoveButtons();
}

/**
 * Adds functionality to remove buttons within each trip element.
 * - Hides the remove button for the first trip to ensure at least one trip remains.
 * - Enables removal of other trips and recalculates results if needed.
 * - Reinitializes button visibility after a trip is removed.
 */
function setupRemoveButtons() {
  const trips = document.querySelectorAll(".trip"); // Get all trip elements

  trips.forEach((trip, index) => {
    const removeBtn = trip.querySelector(".removeTripButton");

    // Skip this trip if no remove button is present
    if (!removeBtn) return;

    // Hide remove button on the first trip to prevent deleting all trips
    if (index === 0) {
      removeBtn.style.display = "none";
    } else {
      removeBtn.style.display = "inline-block";

      // Set up removal logic for this trip
      removeBtn.onclick = () => {
        trip.remove(); // Remove the selected trip

        // Recalculate results if the results section is active
        if (resultsDiv.classList.contains("active")) {
          calculateAllTrips();
        }

        // Re-apply button visibility logic after DOM changes
        setupRemoveButtons();
      };
    }
  });
}

/**
 * Resets the trip list to its initial state.
 * - Clears input values in the first trip.
 * - Removes all additional trips.
 * - Updates remove buttons, recalculates totals, and hides the results section.
 */
function resetAll() {
  const trips = document.querySelectorAll(".trip");

  trips.forEach((trip, index) => {
    if (index === 0) {
      // Clear inputs in the first trip
      const inputs = trip.querySelectorAll("input");
      inputs.forEach((input) => (input.value = ""));
    } else {
      // Remove all other trips
      trip.remove();
    }
  });

  // Refresh button states and calculations
  setupRemoveButtons();
  calculateAllTrips();

  // Hide the results section
  resultsDiv.classList.remove("active");
}

// ------------------------------------------
// Initial Setup and Button Event Handlers
// ------------------------------------------

// Set up initial remove button behavior
setupRemoveButtons();

// Add a new trip when the "Add Trip" button is clicked
addTripButton.onclick = () => {
  addNewTrip();
};

// Calculate all trips when the "Calculate" button is clicked
calculateButton.onclick = calculateAllTrips;

// Reset all trips when the "Reset" button is clicked
resetButton.onclick = resetAll;
