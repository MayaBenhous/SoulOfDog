window.onload = () => {
  fetch("data/Trips.json")
    .then((response) => response.json())
    // .then((data) => console.log(data));
    .then((data) => console.log(data));
    // .then((data) => {
    //   console.log(data);
    //   initTripsList(data));
    // }
      
};

function initTripsList(data) {
  // const secListTrips = document.getElementById("list_trips");
  // for (let i = 0; i < data.trips.length; i++) {
  //   createTrip(data.trips[i]);
  // }
  data.trips.forEach((trip) => {
    createTrip(trip);
    console.log(trip.id);
  });
}

function createTrip(trip) {
  const secListTrips = document.getElementById("list_trips");
  const cardTrip = document.createElement("div");
  cardTrip.classList.add("card");
  secListTrips.appendChild(cardTrip);
  const cardBody = document.createElement("div");
  cardBody.classList.add("card-body");
  cardTrip.appendChild(cardBody);
  const tripTitle = document.createElement("h5");
  tripTitle.classList.add("card-title");
  tripTitle.textContent = "Trip with";
  cardTrip.appendChild(tripTitle);
  const tripDogs = document.createElement("h6");
  tripDogs.classList.add("card-subtitle" ,"mb-2", "text-body-secondary");
  const dogsList = trip.dogs.join(", ");
  tripDogs.textContent = dogsList;
  cardTrip.appendChild(tripDogs);
  const tripDetails = document.createElement("ul");
  tripDetails.classList.add("list-group", "list-group-flush");
  cardTrip.appendChild(tripDetails);
  const details = `
  <li>${trip.date}</li>
  <li>${trip.start_time}</li>
  <li>${trip.end_time}</li>
  <li>${trip.distance} km</li>`;
  tripDetails.innerHTML = details;
}
