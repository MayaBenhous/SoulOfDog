window.onload = () => {
  const urlParams = new URLSearchParams(window.location.search);
  const selectedTripId = urlParams.get("selectedTripId");
  // const trip_lp_string = urlParams.get("newTripObj");

  Promise.all([
    fetch("data/Trips.json").then((response) => response.json()),
    fetch("data/dogs.json").then((response) => response.json()),
  ])
    .then(([dataTrips, dataDogs]) => {
      initTripsList(dataTrips, dataDogs);
      if (selectedTripId) {
        deleteSelectedTrip(selectedTripId);
      }
      // if (trip_lp_string) {
      //   const newTripObj = JSON.parse(decodeURIComponent(trip_lp_string));
      //   newTrip(newTripObj, dataDogs);
      // }
      let newTrips = JSON.parse(localStorage.getItem('trips')) || [];
      newTrips.forEach(newTripObj => {
        newTrip(newTripObj, dataDogs);
      });
    })
    .catch((error) => {
      console.error("Error fetching data:", error);
    });

  document.getElementById("selectButton").addEventListener("click", function () {
      const cards = document.querySelectorAll(".card");
      cards.forEach((card) => {
        card.classList.toggle("show-delete");
      });
    });
};

let selectedTripId;
let selectedDogId;

function listDogs(trip, dataDogs, check) {
  let dogsList = [];
  for (const dogId of trip.dogs_id) {
    const dogName = findDog(dataDogs, dogId);
    if (check == 1) return dogId;
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

function createTrip(trip, contanierList, dogsList, dataDogs) {
  const cardTrip = document.createElement("div");
  cardTrip.classList.add("card");
  cardTrip.classList.add("card-list");

  const cardBody = document.createElement("div");
  cardBody.classList.add("card-body");

  const sectionTitles = document.createElement("section");
  sectionTitles.classList.add("section-title");
  const tripId = document.createElement("p");
  tripId.textContent = trip.id;
  tripId.style.display = "none";
  const tripTitle = document.createElement("h5");
  tripTitle.classList.add("card-title");
  tripTitle.textContent = "Trip with  ";

  const tripDogs = document.createElement("h6");
  tripDogs.classList.add("card-subtitle", "mb-2", "text-body-secondary");
  tripDogs.textContent = dogsList;

  const tripDetails = document.createElement("ul");
  tripDetails.classList.add("list-group", "list-group-flush");
  const details = `
  <li>${trip.date}</li>
  <li>${trip.start_time}</li>
  <li>${trip.end_time}</li>
  <li>${trip.distance}</li>`;
  tripDetails.innerHTML = details;
  const deleteIcon = document.createElement("span");
  deleteIcon.classList.add("delete-icon");
  deleteIcon.classList.add("iconImg");

  deleteIcon.style.backgroundImage = `url("images/icons/delete.png")`;

  deleteIcon.addEventListener("click", function (event) {
    event.stopPropagation();
    if (confirm("Are you sure you want to delete this trip?")) {
      let trips = JSON.parse(localStorage.getItem('trips')) || [];
      trips = trips.filter(storedTrip => storedTrip.id !== trip.id);
      localStorage.setItem('trips', JSON.stringify(trips));
      cardTrip.remove();
    }
  });

  sectionTitles.appendChild(tripId);
  sectionTitles.appendChild(tripTitle);
  sectionTitles.appendChild(tripDogs);
  cardBody.appendChild(sectionTitles);
  cardBody.appendChild(tripDetails);
  cardTrip.appendChild(cardBody);
  cardTrip.appendChild(deleteIcon);
  contanierList.appendChild(cardTrip);

  cardTrip.addEventListener("click", function () {
    selectedTripId = trip.id;
    selectedDogId = listDogs(trip, dataDogs, 1);
    window.location.href = `singleTrip.html?selectedTripId=${selectedTripId}&selectedDogId=${selectedDogId}`;
  });
}

function initTripsList(dataTrips, dataDogs) {
  const contListTrip = document.getElementById("listTripsCont_id");

  for (let t in dataTrips.trips) {
    const trip = dataTrips.trips[t];
    if (trip.type != "empty") {
      const dogsList = listDogs(trip, dataDogs, 0);
      createTrip(trip, contListTrip, dogsList, dataDogs);
    }
  }

  // newTrip(newTripObj, dataDogs);
}

function deleteSelectedTrip(selectedTripId) {
  let trips = JSON.parse(localStorage.getItem('trips')) || [];
  trips = trips.filter(storedTrip => storedTrip.id !== selectedTripId);
  localStorage.setItem('trips', JSON.stringify(trips));

  const tripCards = document.querySelectorAll(".card");
  tripCards.forEach((card) => {
    // console.log(tripCards);
    if (card.querySelector("p").textContent.includes(selectedTripId))
      card.remove();
  });
}

function newTrip(newTripObj, dataDogs) {
  const contListTrip = document.getElementById("listTripsCont_id");
  const trip = newTripObj;
  console.log(trip);
  if (Array.isArray(trip.dogs_id)) {
    arrayDogsId = trip.dogs_id.map(Number);
  } else if (typeof trip.dogs_id === "string") {
    arrayDogsId = trip.dogs_id.split(",").map(Number);
  } else {
    console.error('Invalid dogs_id:', trip.dogs_id);
  }
  trip.dogs_id = arrayDogsId;
  const dogsList = listDogs(trip, dataDogs, 0);
  createTrip(trip, contListTrip, dogsList, dataDogs);
}
