window.onload = () => {
  Promise.all([
    fetch("data/Trips.json").then((response) => response.json()),
    fetch("data/dogs.json").then((response) => response.json()),
  ])
    .then(([dataTrips, dataDogs]) => {
      initTripsList(dataTrips, dataDogs);
    })
    .catch((error) => {
      console.error("Error fetching data:", error);
    });
};

let selectedTripId;
let selectedDogId;

function listDogs(trip, dataDogs, check) {
  let dogsList = [];
  for (const dogId of trip.dogs_id) {
    const dogName = findDog(dataDogs, dogId);
    if(check == 1)
      return dogId;
    if (dogName) {
      dogsList.push(dogName);
    }
  }
  return dogsList.join(", ");
}

function findDog(dataDogs, id) {
  for (const dog of dataDogs.dogs) {
    if (dog.id === id) {
      return dog.dogName;
    }
  }
  return null;
}

function initTripsList(dataTrips, dataDogs) {
  const contListTrip = document.getElementById("listTripsCont_id");

  for (let t in dataTrips.trips) {
    const trip = dataTrips.trips[t];
    if (trip.type != "empty") {
      const cardTrip = document.createElement("div");
      cardTrip.classList.add("card");

      const tripId = trip.id;

      const cardBody = document.createElement("div");
      cardBody.classList.add("card-body");

      const sectionTitles = document.createElement("section");
      sectionTitles.classList.add("section-title");
      const tripTitle = document.createElement("h5");
      tripTitle.classList.add("card-title");
      tripTitle.textContent = "Trip with  ";

      const tripDogs = document.createElement("h6");
      tripDogs.classList.add("card-subtitle", "mb-2", "text-body-secondary");
      const dogsList = listDogs(trip, dataDogs, 0);
      tripDogs.textContent = dogsList;

      const tripDetails = document.createElement("ul");
      tripDetails.classList.add("list-group", "list-group-flush");
      const details = `
      <li>${trip.date}</li>
      <li>${trip.start_time}</li>
      <li>${trip.end_time}</li>
      <li>${trip.distance}</li>`;
      tripDetails.innerHTML = details;

      console.log(trip.id);

      sectionTitles.appendChild(tripTitle);
      sectionTitles.appendChild(tripDogs);
      cardBody.appendChild(sectionTitles);
      cardBody.appendChild(tripDetails);
      cardTrip.appendChild(cardBody);
      contListTrip.appendChild(cardTrip);

      cardTrip.addEventListener("click", function () {
        selectedTripId = trip.id;
        selectedDogId = listDogs(trip, dataDogs, 1);
        window.location.href = `singleTrip.html?selectedTripId=${selectedTripId}&selectedDogId=${selectedDogId}`;
      });
    }
  }
}