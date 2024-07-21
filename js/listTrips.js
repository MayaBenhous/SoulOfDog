window.onload = () => {
  const urlParams = new URLSearchParams(window.location.search);
  const selectedTripId = urlParams.get("selectedTripId");
  
  startWitHhoutServer();
  createButtonDelete();
};

function startWitHhoutServer(){
  Promise.all([
    fetch("data/Trips.json").then((response) => response.json()),
    fetch("data/dogs.json").then((response) => response.json()),
  ])
    .then(([dataTrips, dataDogs]) => {
      initTripsList(dataTrips, dataDogs);
      if (selectedTripId) {
        deleteSelectedTrip(selectedTripId);
      }
    })
    .catch((error) => {
      console.error("Error fetching data:", error);
    });
}
let userId = 2;

function getListTrips(userId) {
  fetch(`https://soulofdog-server.onrender.com/api/trips/createListTrips/${userId}`)
  .then((response) => response.json())
  .then((dataListTrips) => initTripsList(dataListTrips));
}

let selectedTripId;
let selectedDogId;

// function initTripsList(dataListTrips) {
  // console.log(dataListTrips);
  function initTripsList(dataTrips, dataDogs) {
  const contListTrip = document.getElementById("listTripsCont_id");
  let length = dataTrips.trips.length;
  for (let t = length - 1; t >= 0; t--) {
    const trip = dataTrips.trips[t];
    if (trip.type != "empty") {
      const dogsList = listDogs(trip, dataDogs, 0);
      createTrip(trip, contListTrip, dogsList, dataDogs);
    }
  }
}

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
  handleSecTitle(trip, cardBody, dogsList);
  handleDeatilsTrip(trip, cardBody);
  cardTrip.appendChild(cardBody);
  handleDeleteIcon(cardTrip, trip);
  contanierList.appendChild(cardTrip);
  handleClickTrip(cardTrip, selectedTripId, trip, dataDogs);
}

function handleSecTitle(trip, cardBody, dogsList) {
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
  sectionTitles.appendChild(tripId);
  sectionTitles.appendChild(tripTitle);
  sectionTitles.appendChild(tripDogs);
  cardBody.appendChild(sectionTitles);
}

function handleDeatilsTrip(trip, cardBody) {
  const tripDetails = document.createElement("ul");
  tripDetails.classList.add("list-group", "list-group-flush");
  const details = `
  <li>${trip.date}</li>
  <li>${trip.start_time}</li>
  <li>${trip.end_time}</li>
  <li>${trip.distance}</li>`;
  tripDetails.innerHTML = details;
  cardBody.appendChild(tripDetails);
}

function handleDeleteIcon(cardTrip, trip) {
  const deleteIcon = document.createElement("span");
  deleteIcon.classList.add("delete-icon");
  deleteIcon.classList.add("iconImg");
  deleteIcon.style.backgroundImage = `url("images/icons/delete.svg")`;
  deleteIcon.addEventListener("click", function (event) {
    event.stopPropagation();
    if (confirm("Are you sure you want to delete this trip?")) {
      console.log(`DELETE {domain}/trips/${trip.id}`);
      cardTrip.remove();
    }
  });
  cardTrip.appendChild(deleteIcon);
}

function handleClickTrip(cardTrip, selectedTripId, trip, dataDogs) {
  cardTrip.addEventListener("click", function () {
    selectedTripId = trip.id;
    selectedDogId = listDogs(trip, dataDogs, 1);
    if (trip.type == "Single") {
      window.location.href = `singleTrip.html?selectedTripId=${selectedTripId}&selectedDogId=${selectedDogId}`;
    } else if (trip.type === "Group") {
      const groupTripId = selectedTripId;
      window.location.href = `groupTrip.html?groupTripId=${selectedTripId}`;
    }
  });
}

function deleteSelectedTrip(selectedTripId) {
  const tripCards = document.querySelectorAll(".card");
  tripCards.forEach((card) => {
    if (card.querySelector("p").textContent.includes(selectedTripId))
      card.remove();
  });
  console.log(`DELETE {domain}/trips/${selectedTripId}`);
}

function newTrip(newTripObj, dataDogs) {
  const contListTrip = document.getElementById("listTripsCont_id");
  const trip = newTripObj;
  if (Array.isArray(trip.dogs_id)) {
    arrayDogsId = trip.dogs_id.map(Number);
  } else if (typeof trip.dogs_id === "string") {
    arrayDogsId = trip.dogs_id.split(",").map(Number);
  } else {
    console.error("Invalid dogs_id:", trip.dogs_id);
  }
  trip.dogs_id = arrayDogsId;
  const dogsList = listDogs(trip, dataDogs, 0);
  createTrip(trip, contListTrip, dogsList, dataDogs);
}

function createButtonDelete() {
  document.getElementById("selectButton").addEventListener("click", function () {
    const cards = document.querySelectorAll(".card");
    cards.forEach((card) => {
      card.classList.toggle("show-delete");});
  });
}