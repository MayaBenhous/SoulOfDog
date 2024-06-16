window.onload = () => {
  fetch("data/Trips.json")
    .then((response) => response.json())
    // .then((data) => console.log(data));
    .then((data) => initTripsList(data));
  // .then((data) => {
  // console.log(data);
  //   initTripsList(data));
  // }
};

// function initTripsList(data) {
// const secListTrips = document.getElementById("list_trips");
// for (let i = 0; i < data.trips.length; i++) {
//   createTrip(data.trips[i]);
//   // }
//   data.trips.forEach((trip) => {
//     createTrip(trip);
//     console.log(trip.id);
//   });
// }

// function createTrip(trip) {
//   const secListTrips = document.getElementById("list_trips");
//   const cardTrip = document.createElement("div");
//   cardTrip.classList.add("card");
//   secListTrips.appendChild(cardTrip);
//   const cardBody = document.createElement("div");
//   cardBody.classList.add("card-body");
//   cardTrip.appendChild(cardBody);
//   const tripTitle = document.createElement("h5");
//   tripTitle.classList.add("card-title");
//   tripTitle.textContent = "Trip with";
//   cardTrip.appendChild(tripTitle);

// }

function initTripsList(data) {
  console.log(data);
  const contListTrip = document.getElementById("listTripsCont_id");
  for (let t in data.trips) {
    console.log(data.trips[t].id);
    const trip = data.trips[t];
    console.log(trip.id);
    const cardTrip = document.createElement("div");
    cardTrip.classList.add("card");
    const cardBody = document.createElement("div");
    cardBody.classList.add("card-body");
    const tripTitle = document.createElement("h5");
    tripTitle.classList.add("card-title");
    tripTitle.textContent = "Trip with";

    const tripDogs = document.createElement("h6");
    tripDogs.classList.add("card-subtitle", "mb-2", "text-body-secondary");
    const dogsList = trip.dogs.join(", ");
    tripDogs.textContent = dogsList;
    const tripDetails = document.createElement("ul");
    tripDetails.classList.add("list-group", "list-group-flush");
    const details = `
    <li>${trip.date}</li>
    <li>${trip.start_time}</li>
    <li>${trip.end_time}</li>
    <li>${trip.distance}km</li>`;
    tripDetails.innerHTML = details;

    cardBody.appendChild(tripTitle);
    cardBody.appendChild(tripDogs);
    cardBody.appendChild(tripDetails);
    cardTrip.appendChild(cardBody);
    contListTrip.appendChild(cardTrip);
  }
}
