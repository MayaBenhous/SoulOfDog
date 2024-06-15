window.onload = () => {
  fetch("data/Trips.json")
    .then((response) => response.json())
    .then((data) => initTripsList(data));
};

function initTripsList(data) {
  const secListTrips = document.getElementById("list_trips");
  for (let i = 0; i < data.trips.length; i++) {
    createTrip(data.songs[i]);
  }
}

function createTrip(trip) {
  const secListTrips = document.getElementById("list_trips");
  const cardTrip = document.createElement("div");
  cardTrip.classList.add("card-body");
  secListTrips.appendChild(cardTrip);
  const tripTitle = document.createElement("h5");
  tripTitle.classList.add("card-title");
  tripTitle.textContent = "Trip with";
  cardTrip.appendChild(tripTitle);
  // document.querySelector("h5").innerHTML = `Trip with`;
  const tripDogs = document.createElement("h6");
  tripDogs.classList.add("card-subtitle" ,"mb-2", "text-body-secondary");
  const dogsList = trip.dogs.join(", ");
  tripDogs.textContent = dogsList;
  cardTrip.appendChild(tripDogs);
  const tripDetails = document.createElement("ul");
  // tripDetails.classList.add("card-text");
  cardTrip.appendChild(tripDetails);

  const details = `
  <li>Type: ${trip.type}</li>
  <li>Implement: ${trip.implement}</li>
  <li>Date: ${trip.date}</li>
  <li>Start Time: ${trip.start_time}</li>
  <li>End Time: ${trip.end_time}</li>
  <li>Distance: ${trip.distance} km</li>`;
  tripDetails.innerHTML = details;
  // document.querySelector("h6").innerHTML = `${dogsList}`;
  // cardTrip.appendChild(ulFrag);
}
