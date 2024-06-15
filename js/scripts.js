window.onload = () => {
  initTripsList();
};

function initTripsList() {
  pageRect = true;
  for (let i = 0; i < characters.length; i++) {
    createTrip();
  }
}

function createTrip() {
  const secListTrips = document.getElementById("list_trips");
  const tripTitle = document.createElement("h2");
  secListTrips.appendChild(tripTitle);
  document.querySelector("h2").innerHTML = `Trip with`;

  const tripDogs = document.createElement("h3");
  tripTitle.appendChild(tripDogs);
  let dogsList;
  const ulFrag = document.createDocumentFragment();
  const tripDetails = document.createElement("ul");
  ulFrag.appendChild(tripDetails);
  for (const t in data.trips) {
    const tripItem = createElement("li");
    const trip = data.trips[t];
    const tripStr = `${trip.date}   ${trip.start_time}  ${trip.end_time}    ${trip.distance}`;
    tripItem.innerHTML = tripStr;
    tripDetails.appendChild(tripItem);
    for (const d in trip.dogs) {
      const nameDog = trip.dogs[d];
    }
    dogsList = `${nameDog}, `;
  }
  document.querySelector("h3").innerHTML = `${dogsList}`;
  contSong.appendChild(ulFrag);
}