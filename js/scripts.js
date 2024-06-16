window.onload = () => {
  fetch("data/Trips.json")
    .then((response) => response.json())
    // .then((data) => console.log(data));
    .then((data) => initTripsList(data));
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
  const contListTrip = document.getElementById("listTrips-Container");

  for (const trip in data.trips) {
    let cardTrip = document.createElement("div");
    cardTrip.classList.add("card");
    const cardBody = document.createElement("div");
    cardBody.classList.add("card-body");

    cardTrip.appendChild(cardBody);
    contListTrip.appendChild(cardTrip);
  }
  document.getElementsByTagName("main")[0].appendChild(contListTrip); 

  // data.trips.forEach(trip => {
  //   console.log(trip.id);
  //   createTrip(trip);
  //   console.log(trip.id);
  // });
}

// function createTrip(trip) {
//   const contListTrip = document.getElementById("listTrips-Container");
//   const cardTrip = document.createElement("div");
//   cardTrip.classList.add("card");
//   const cardBody = document.createElement("div");
//   cardBody.classList.add("card-body");
//   // contListTrip.appendChild(cardTrip);
//   // const tripTitle = document.createElement("h5");
//   // tripTitle.classList.add("card-title");
//   // tripTitle.textContent = "Trip with";
//   // cardBody.appendChild(tripTitle);

//   cardTrip.appendChild(cardBody);
//   contListTrip.appendChild(cardTrip);
//   // const tripDogs = document.createElement("h6");
//   // tripDogs.classList.add("card-subtitle" ,"mb-2", "text-body-secondary");
//   // const dogsList = trip.dogs.join(", ");
//   // tripDogs.textContent = dogsList;
//   // cardTrip.appendChild(tripDogs);
//   // const tripDetails = document.createElement("ul");
//   // tripDetails.classList.add("list-group", "list-group-flush");
//   // cardTrip.appendChild(tripDetails);
//   // const details = `
//   // <li>${trip.date}</li>
//   // <li>${trip.start_time}</li>
//   // <li>${trip.end_time}</li>
//   // <li>${trip.distance} km</li>`;
//   // tripDetails.innerHTML = details;
// }
