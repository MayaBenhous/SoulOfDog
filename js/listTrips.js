window.onload = () => {
  const urlParams = new URLSearchParams(window.location.search);
  const selectedTripId = urlParams.get("selectedTripId");

  startWithServer(userId);
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
let userId = 6; 

let i = 0;
let dataList = {
  dataTrips: null,
  dataDogs: null
};

function getDogsUser(userId) {
  return fetch(`https://soulofdog-server.onrender.com/api/dogs/getDogData/${userId}`)
  .then((response) => response.json())
}

function startWithServer(userId) {
  Promise.all([
    fetch(`https://soulofdog-server.onrender.com/api/trips/createListTrips/${userId}`)
      .then(response => {
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        return response.json();
      }),
    fetch(`https://soulofdog-server.onrender.com/api/dogs/getDogData/${userId}`)
      .then(response => {
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        return response.json();
      })
  ])
  .then(([dataTripsServer, dataDogsServer]) => {
    initTripsList(dataTripsServer, dataDogsServer);
  })
  .catch((error) => {
    console.error('Error fetching data:', error);
  });
}

let selectedTripId;
let selectedDogId;

function initTripsList(dataTrips, dataDogs) {
  const contListTrip = document.getElementById("listTripsCont_id");
  let length = dataTrips.listTrips.length;
  for (let t = length - 1; t >= 0; t--) {
    const trip = dataTrips.listTrips[t];
    if (trip.type != "empty") {
      const dogsList = listDogs(trip, dataDogs, 0);
      createTrip(trip, contListTrip, dogsList, dataDogs);
    }
  }
}

function listDogs(trip, dataDogs, check) {
  let dogsList = [];
  for (const dogId of trip.dogsId) {
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
    if (dog.dogId === id) {
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
  handleClickTrip(cardTrip, trip, dataDogs);
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
  <li>${trip.startTime}</li>
  <li>${trip.endTime}</li>
  <li>${trip.distance}km</li>`;
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

function handleClickTrip(cardTrip, trip, dataDogs) {
  cardTrip.addEventListener("click", function () {
    let countDogs = trip.dogsId.length;
    let selectedDogId = trip.dogsId;
    let userType = trip.userType;
    if((countDogs === 1) && (userType !== "dogWalker"))
    {
        window.location.href = `singleTrip.html?selectedTripId=${trip.tripId}&selectedDogId=${selectedDogId}&dataDogs=${dataDogs}`;
    }
    else {
        console.log(selectedDogId);
        console.log("group!!");
        window.location.href = `groupTrip.html?groupTripId=${trip.tripId}`;     
      // window.location.href = `groupTrip.html?groupTripId=${trip.tripId}&selectedDogs=${selectedDogId}`;     
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

function newTrip(newTripObj, dataDogs) // not working now
{
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