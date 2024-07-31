window.onload = () => {
  const userId = sessionStorage.getItem('userId');
  const urlParams = new URLSearchParams(window.location.search);
  startWithServer(userId);
  createButtonDelete();
  handleClickPlus(userId);
  getDataUser(userId);
};

// let i = 0;
// let dataList = {
//   dataTrips: null,
//   dataDogs: null
// };
// let selectedTripId;
// let selectedDogId;

function getDogsUser(userId) {
  return fetch(`https://soulofdog-server.onrender.com/api/dogs/getDogData/${userId}`)
  .then((response) => response.json())
}

function getTypeUser(userId) {
  return fetch(`https://soulofdog-server.onrender.com/api/users/userType/${userId}`)
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
    fetch(`https://soulofdog-server.onrender.com/api/dogs/dogDataByUserId/${userId}`)
      .then(response => {
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        return response.json();
      })
  ])
  .then(([dataTripsServer, dataDogsServer]) => {
    initTripsList(dataTripsServer, dataDogsServer, userId);
  })
  .catch((error) => {
    console.error('Error fetching data:', error);
  });
}

function getDogIdByUserId(userId) {
  return fetch(`https://soulofdog-server.onrender.com/api/dogs/dogId/${userId}`)
  .then((response) => response.json());
}

function initTripsList(dataTrips, dataDogs, userId) {
  getTypeUser(userId).then((typeUser) => {
    if(typeUser.data === "owner")
    {
      plusButton = document.getElementById("addTrip");
      plusButton.style.display="block";
    }
  });
  const contListTrip = document.getElementById("listTripsCont_id");
  let length = dataTrips.parsedList.length;
  for (let t = 0; t < length ; t++) {
    const trip = dataTrips.parsedList[t];
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

function handleClickTrip(cardTrip, trip, dataDogs) {
  cardTrip.addEventListener("click", function () {
    let countDogs = trip.dogsId.length;
    let selectedDogId = trip.dogsId[0];
    if(countDogs === 1)
    {
      window.location.href = `singleTrip.html?selectedTripId=${trip.tripId}&selectedDogId=${selectedDogId}&dataDogs=${dataDogs}`;
    }
    else {
      window.location.href = `groupTrip.html?groupTripId=${trip.tripId}&selectedDogsIds=null`;     
    }
  });
}

function handleDeleteIcon(cardTrip, trip) 
{
  const deleteIcon = document.createElement("span");
  deleteIcon.classList.add("delete-icon");
  deleteIcon.classList.add("iconImg");
  deleteIcon.style.backgroundImage = `url("images/icons/delete.svg")`;
  deleteIcon.addEventListener("click", function (event) {
    event.stopPropagation();
    if (confirm("Are you sure you want to delete this trip?")) {
      deleteTrip(trip.tripId)
      .then(() => {
        cardTrip.remove();
        window.location.href = `tripsList.html`;
      })
      .catch((error) => {
        console.error('Failed to delete trip:', error);
      });
    }
  });
  cardTrip.appendChild(deleteIcon);
}

function createButtonDelete()
{
  document.getElementById("selectButton").addEventListener("click", function () {
    const cards = document.querySelectorAll(".card");
    cards.forEach((card) => {
      card.classList.toggle("show-delete");});
  });
}

function handleClickPlus(userId) {
  document.getElementById("addTrip").addEventListener("click", function () {
    getDogIdByUserId(userId).then((dogId) => {
      const selectedIds = dogId.dogId;
      window.location.href = `groupTrip.html?groupTripId=null&selectedDogsIds=${selectedIds}`;
    });
  });
}