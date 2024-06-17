window.onload = () => {
  fetch("data/Trips.json")
    .then((response) => response.json())
    .then((dataTrips) => initTripsList(dataTrips));

  fetch("data/dogs.json")
    .then((response) => response.json())
    .then((dataDogs) => findDog(dataDogs));
};

function listDogs(dataTrips) {
  let dogsList;
  console.log(dataTrips.dogs);
  for (const d in dataTrips.dogs) {
    console.log(dataTrips.dogs[d]);
    // console.log(d);
    // dogId = dataTrips.dogs[d];
    // dogId = dog[id];
    // console.log(dogId);
    // const dog_name = findDog(dataDogs, dogId);
    // dogsList = dog_name.join(", ");
  }
  return dogsList;
  // tripDogs.textContent = dogsList;
}

function findDog(dataDogs, id) {
  for (const d in dataDogs.dogs) {
    dog = dataDogs.dogs[d];
    dogId = dog.id;
    if (dogId == id) {
      return dog.dogName;
    }
  }
}

function initTripsList(dataTrips) {
  // console.log(dataTrips);
  const contListTrip = document.getElementById("listTripsCont_id");
  for (let t in dataTrips.trips) {
    // console.log(dataTrips.trips[t].id);
    const trip = dataTrips.trips[t];
    // console.log(trip.id);
    const cardTrip = document.createElement("div");
    cardTrip.classList.add("card");
    const cardBody = document.createElement("div");
    cardBody.classList.add("card-body");

    const sectionTitles = document.createElement("section");
    sectionTitles.classList.add("section-title");
    const tripTitle = document.createElement("h5");
    tripTitle.classList.add("card-title");
    tripTitle.textContent = "Trip with  ";

    const tripDogs = document.createElement("h6");
    tripDogs.classList.add("card-subtitle", "mb-2", "text-body-secondary");
    // const dogsList = trip.dogs_names.join(", ");
    const dogsList = listDogs(dataTrips);
    tripDogs.textContent = dogsList;

    // const tripDogs2 = document.createElement("h6");
    // tripDogs2.classList.add("card-subtitle", "mb-2", "text-body-secondary");
    // const dogsList2 = listDogs(dataTrips);
    // tripDogs2.textContent = dogsList2;

    const tripDetails = document.createElement("ul");
    tripDetails.classList.add("list-group", "list-group-flush");
    const details = `
    <li>${trip.date}</li>
    <li>${trip.start_time}</li>
    <li>${trip.end_time}</li>
    <li>${trip.distance}km</li>`;
    tripDetails.innerHTML = details;

    // cardBody.appendChild(tripTitle);
    // cardBody.appendChild(tripDogs);
    sectionTitles.appendChild(tripTitle);
    sectionTitles.appendChild(tripDogs);

    // cardBody.appendChild(tripDogs2);

    cardBody.appendChild(sectionTitles);
    cardBody.appendChild(tripDetails);
    cardTrip.appendChild(cardBody);
    contListTrip.appendChild(cardTrip);
  }
}
