window.onload = () => {
  const userId = sessionStorage.getItem('userId');
  // getDataUser(userId);
  const urlParams = new URLSearchParams(window.location.search);
  const selectedDogs = urlParams.get("selectedDogsIds");
  console.log(selectedDogs);
  const groupTripId = urlParams.get("groupTripId");
  if(selectedDogs === "null")
  {
    console.log(groupTripId); 
    getGroupTripExist(groupTripId);
  }
  else if(groupTripId === "null"){
    console.log(selectedDogs);
    getNewGroupTrip(selectedDogs,userId);
  }
  getDataUser(userId);
};

let numDogs;

function getGroupTripExist(groupTripId) {
  fetch(`https://soulofdog-server.onrender.com/api/trips/tripFromList/${groupTripId}`)
  .then((response) => response.json())
  .then((dataTrip) => initGroupTripExist(dataTrip));
}

function initGroupTripExist(dataTrip) {
  let dataDogs = dataTrip.trip.dogs[0];
  createDateTrip(dataTrip.trip, null);
  existGroupTrip(dataTrip.trip, dataDogs);
  deleteObject(dataTrip.trip.tripId);
}

function getDataDog(dogId) {
  return fetch(`https://soulofdog-server.onrender.com/api/dogs/dataDogById/${dogId}`)
  .then((response) => response.json());
}

function getUserName(userId) {
  return fetch(`https://soulofdog-server.onrender.com/api/users/userName/${userId}`)
  .then((response) => response.json());
}

function listFromSelected(input_str) {
  let items = input_str.split(',').map(item => item.trim());
  items = items.filter(item => item !== '');
  return items;
}

function getNewGroupTrip(selectedDogs,userId) {
  console.log(selectedDogs);
  let listDogsId = listFromSelected(selectedDogs);
  console.log(listDogsId);
  let countDogs = listDogsId.length;
  console.log(countDogs);
  let dataDogs = [];
  let promises = [];
  let implementUserName;
  for (let i = 0; i < countDogs; i++) {
    let dogId = listDogsId[i];
    console.log(dogId);
    promises.push(getDataDog(dogId).then((dataDog) => {
      console.log(dataDog);
      dataDogs.push(dataDog);
    }));
  }
  promises.push(getUserName(userId).then((userName) => {
    implementUserName = userName.data;
    console.log(implementUserName);
  }));
  Promise.all(promises).then(() => {
    console.log(dataDogs); 
    newGroupTrip(implementUserName, listDogsId, dataDogs);
    // console.log(implementUserName);
    createDateTrip(null, implementUserName);
  });
}

function createNewTrip(trip) {
  let tripData = {
    implementName: trip.implementName,
    tripType: trip.tripType,
    date: trip.date,
    startTime: trip.startTime,
    endTime: trip.endTime,
    distance: trip.distance,
    tripObjData: trip.dogs.map(dog => ({
      dogId: dog.dogId,
      heartbeat: dog.heartbeat,
      steps: dog.steps,
      avgSpeed: dog.avgSpeed,
      needPee: dog.needPee,
      needPoop: dog.needPoop,
      notes: dog.notes
    }))
  };
  console.log(tripData);
  fetch(`https://soulofdog-server.onrender.com/api/trips/newTrip`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(tripData)
  })
  .then(response => response.json())
  .then(data => {
    if (data.error) {
      console.error('Failed to create new trip:', data.error);
    } else {
      console.log('Trip created successfully:', data);
    }
  })
  .catch((error) => {
    console.error('Error creating new trip:', error);
  });
}

function existGroupTrip(trip) {
  const finishButton = document.getElementById("finishTripButton");
  finishButton.style.display = "none";
  let countDog = 0;
  for(let i = 0; i< (trip.dogs.length); i++) {
    dog = trip.dogs[i];
    createDogCard(dog, 1);
    countDog++;
  }
  createDeatils(trip);
}

function newGroupTrip(implementUserName, selectedDogs, dataDogs) {
  console.log(dataDogs);
  let newTrip = {
    implementName: "",
    tripType: "",
    date: null,
    startTime: "",
    endTime: "",
    distance: 0,
    dogs: []
  };
  newTrip.implementName = implementUserName;
  const deleteButton = document.getElementById("deleteDogButton");
  deleteButton.style.display = "none";
  numDogs = selectedDogs.length;
  if(numDogs == 1)
  {
    newTrip.tripType = "Single";
  }
  else if(numDogs > 0){
    newTrip.tripType = "Group";
  }
  for (let i = 0; i< numDogs; i++) {
    let rowDog = dataDogs[i].dog[0];
    let dog = newDogInTrip(rowDog);
    newTrip.dogs.push(dog);
    createDogCard(dog, 0, null);
  }
  console.log(newTrip);
  for (let i = 0; i < numDogs; i++) {
    newTrip.dogs[i].needPee = false;
    newTrip.dogs[i].needPoop = false;
  }
  createDeatils(null);
  console.log(newTrip);
  finishTrip(newTrip);
}

function newDogInTrip(rowDog) {
  return dogInTrip = {
    dogId:rowDog.dogId,
    dogName:rowDog.dogName,
    img:rowDog.img,
    heartbeat:random(80,140),
    steps:random(60,180),
    avgSpeed:random(0.5, 3.0).toFixed(1),
    needPee: false,
    needPoop:false,
    notes:null
  };
}

function random(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function createDateTrip(trip, name) {
  const tripTitles = document.getElementById("tripTitles");
  const tripDate = document.getElementById("dateTrip");
  if (trip) {
    console.log(trip);
    tripDate.innerHTML = `${trip.date} <span class="ownerTrip">${trip.implementName}</span>`;
  } else {
    let formattedDate = setCurrentDate();
    tripDate.innerHTML = `${formattedDate} <span class="ownerTrip">${name}</span>`;
  }
  const ownerTripSpan = document.querySelector(".ownerTrip");
  const editIcon = document.createElement("span");
  editIcon.classList.add("editIconOneTrip");
  ownerTripSpan.appendChild(editIcon);
  tripTitles.appendChild(tripDate);
}

function checkBoxNeeds(newTrip) {
  for (let i = 0; i < numDogs; i++) {
    const checkboxPee = document.getElementsByClassName("needsPeeCheckbox")[i];
    const checkboxPoop = document.getElementsByClassName("needsPoopCheckbox")[i];
    newTrip.dogs[i].needPee = checkboxPee.checked;
    newTrip.dogs[i].needPoop = checkboxPoop.checked;
  }
}

function textInNotes(newTrip) {
  for (let i = 0; i < numDogs; i++) {
    const textNote = document.getElementsByClassName("textarea-Notes")[i];
    newTrip.dogs[i].notes = textNote.value;
  }
}

function createDogCard(dog, type) {
  const secDogsGroup = document.getElementById("dogs_cards");
  const cardDog = document.createElement("div");
  cardDog.classList.add("card");
  const cardBody = document.createElement("div");
  cardBody.classList.add("card-body");
  cardBody.classList.add("cardGroup_trip");
  handleSecNotes(dog, cardBody, "Group");
  handleSecNeeds(dog, type, cardBody);
  handleSecNameImg(dog, cardBody);
  cardDog.appendChild(cardBody);
  secDogsGroup.appendChild(cardDog);
}

function handleSecNameImg(dog, cardBody) {
  const sectImgName = document.createElement("section");
  sectImgName.classList.add("secImgNameG_trip");
  const imgDog = document.createElement("img");
  imgDog.classList.add("imgDogInTrip");
  imgDog.src = dog.img;
  imgDog.alt = dog.dogName;
  imgDog.title = dog.dogName;
  let dogName = document.createElement("h6");
  dogName.classList.add("dogName");
  dogName.textContent = dog.dogName;
  sectImgName.appendChild(imgDog);
  sectImgName.appendChild(dogName);
  cardBody.appendChild(sectImgName);
}

function createDeatils(trip) {
  const secDetailsTrip = document.getElementById("secDetailsTrip");
  createSecTime(secDetailsTrip, trip);
  createSecDistance(secDetailsTrip, trip);
}

function createSecTime(secDetailsTrip, trip) {
  const cardTime = document.createElement("div");
  cardTime.classList.add("cardsSingleTrip");
  handleNameImgTime(cardTime);
  const detailsPart = document.createElement("div");
  detailsPart.classList.add("detailsPart");
  handleDeatilsTime(detailsPart, trip);
  cardTime.appendChild(detailsPart);
  secDetailsTrip.appendChild(cardTime, trip);
}

function handleNameImgTime(cardTime, trip) {
  const titlePart = document.createElement("div");
  titlePart.classList.add("titlePart");
  const iconImg = document.createElement("span");
  iconImg.classList.add("iconImg");
  iconImg.style.backgroundImage = `url("images/icons/clock.svg")`;
  const titleCard = document.createElement("h5");
  titleCard.classList.add("titleCard");
  titleCard.textContent = `Trip Duration`;
  iconImg.appendChild(titleCard);
  titlePart.appendChild(iconImg);
  cardTime.appendChild(titlePart);
}

function handleDeatilsTime(detailsPart, trip) {
  const topDetailsPart = document.createElement("div");
  topDetailsPart.classList.add("topDetailsPart");
  const start = document.createElement("h5");
  start.textContent = `Start`;
  const hourStart = document.createElement("p");
  hourStart.classList.add("hourStart");
  const end = document.createElement("h5");
  end.textContent = `End`;
  const hourEnd = document.createElement("p");
  hourEnd.classList.add("hourEnd");
  if (trip == null) {
    hourStart.textContent = getCurrentTime();
    hourEnd.textContent = `00:00`;
  } else {
    hourStart.textContent = trip.startTime;
    hourEnd.textContent = trip.endTime;
  }
  start.appendChild(hourStart);
  end.appendChild(hourEnd);
  topDetailsPart.appendChild(start);
  topDetailsPart.appendChild(end);
  const lowDetailsPart = document.createElement("div");
  lowDetailsPart.classList.add("lowDetailsPart");
  const total = document.createElement("h5");
  total.classList.add("total");
  total.textContent = `Total`;
  const totalNum = document.createElement("p");
  totalNum.classList.add("value");
  totalNum.classList.add("totalValue");
  if (trip == null) {
    totalNum.textContent = `00:00`;
  } else {
    totalNum.textContent = totalTime(hourStart, hourEnd);
  }
  lowDetailsPart.appendChild(total);
  lowDetailsPart.appendChild(totalNum);
  detailsPart.appendChild(topDetailsPart);
  detailsPart.appendChild(lowDetailsPart);
}

function createSecDistance(secDetailsTrip, trip) {
  const cardDistance = document.createElement("div");
  cardDistance.classList.add("cardDistance");
  cardDistance.classList.add("cardsSingleTrip");
  handleNameImgDistance(cardDistance);
  handleDeatilsDistance(cardDistance, trip);
  secDetailsTrip.appendChild(cardDistance);
}

function handleNameImgDistance(cardDistance) {
  const titleDistance = document.createElement("div");
  titleDistance.classList.add("titlePart");
  const iconImgDistance = document.createElement("span");
  iconImgDistance.classList.add("iconImg");
  iconImgDistance.style.backgroundImage = `url("images/icons/distance.svg")`;
  const titleCardDistance = document.createElement("h5");
  titleCardDistance.classList.add("titleCard");
  titleCardDistance.textContent = `Distance`;
  iconImgDistance.appendChild(titleCardDistance);
  titleDistance.appendChild(iconImgDistance);
  cardDistance.appendChild(titleDistance);
}

function handleDeatilsDistance(cardDistance, trip) {
  const detailscardDistance = document.createElement("div");
  detailscardDistance.classList.add("detailsPart");
  const valueDis = document.createElement("p");
  valueDis.classList.add("value");
  valueDis.classList.add("disValue");
  if (trip == null) {
    valueDis.textContent = `0Km`;
  } else {
    valueDis.textContent = trip.distance+"Km";
  }
  detailscardDistance.appendChild(valueDis);
  cardDistance.appendChild(detailscardDistance);
}

function getCurrentTime() {
  let now = new Date();
  let hours = now.getHours().toString().padStart(2, "0");
  let minutes = now.getMinutes().toString().padStart(2, "0");
  return hours + ":" + minutes;
}

function setCurrentDate() {
  const currentDate = new Date();
  const day = String(currentDate.getDate()).padStart(2, "0");
  const month = String(currentDate.getMonth() + 1).padStart(2, "0");
  const year = currentDate.getFullYear();
  const formattedDate = `${day}-${month}-${year}`;
  return formattedDate;
}

function setFormatDate() {
  const currentDate = new Date();
  const day = String(currentDate.getDate()).padStart(2, "0");
  const month = String(currentDate.getMonth() + 1).padStart(2, "0");
  const year = currentDate.getFullYear();
  const formattedDate = `${year}-${month}-${day}`;
  return formattedDate;
}

function finishTrip(newTrip)
{
  const finishButton = document.getElementById("finishTripButton");
  finishButton.addEventListener("click", () => {
    finishButton.style.display = "none";
    const hourStart = document.getElementsByClassName("hourStart");
    newTrip.startTime = hourStart[0].textContent;
    const hourEnd = document.getElementsByClassName("hourEnd");
    hourEnd[0].textContent = getCurrentTime();
    newTrip.endTime = hourEnd[0].textContent;
    const total = document.getElementsByClassName("totalValue");
    total[0].textContent = totalTime(hourStart[0], hourEnd[0]);
    const distance = document.getElementsByClassName("disValue");
    distance[0].textContent = random(0.5, 7.0) + "km";
    newTrip.distance = distance[0].textContent;
    console.log(newTrip.distance);
    checkBoxNeeds(newTrip);
    textInNotes(newTrip);
    newTrip.date = setFormatDate();
    console.log(newTrip);
    createNewTrip(newTrip);
    // console.log(`POST {domain}/trips/${newTrip.id}`);
    console.log(`POST {domain}/trips/tripId`);
    console.log("Request Body:", newTrip);
  });
}