window.onload = () => {
  const urlParams = new URLSearchParams(window.location.search);
  const selectedDogs = urlParams.get("selectedDogs");
  const groupTripId = urlParams.get("groupTripId");

  Promise.all([
    fetch("data/Trips.json").then((response) => response.json()),
    fetch("data/dogs.json").then((response) => response.json()),
  ]).then(([dataTrips, dataDogs]) => {
    if (groupTripId) {
      const groupTrip = findTrip(dataTrips, groupTripId);
      createDateTrip(groupTrip);
      existGroupTrip(groupTrip, dataDogs);
    } else {
      createDateTrip(null);
      newGroupTrip(selectedDogs, dataDogs);
      finishTrip();
    }
    deleteObject(groupTripId);
  });
};

let numDogs;

let trip_lp = {
  id: 0,
  dogs_id: [],
  date: "",
  start_time: "",
  end_time: "",
  needs_pee: [],
  needs_poop: [],
  distance: 0,
};

function findTrip(dataTrips, tripId) {
  for (const trip of dataTrips.trips) {
    if (trip.id == tripId) {
      return trip;
    }
  }
  return null;
}

function findDog(dataDogs, dogId) {
  for (const dog of dataDogs.dogs) {
    if (dog.id === dogId) {
      return dog;
    }
  }
  return null;
}

function newGroupTrip(selectedDogs, dataDogs) {
  const deleteButton = document.getElementById("deleteDogButton");
  deleteButton.style.display = "none";
  const selectedDogsIdsArray = selectedDogs.split(",").map((id) => id.trim());
  numDogs = selectedDogsIdsArray.length;
  for (let i = 0; i < numDogs; i++) {
    trip_lp.needs_pee[i] = false;
    trip_lp.needs_poop[i] = false;
  }
  trip_lp.dogs_id = selectedDogsIdsArray;
  for (const s in selectedDogsIdsArray) {
    const selectDog = selectedDogsIdsArray[s];
    for (const dog of dataDogs.dogs) {
      if (dog.id == selectDog) {
        createDogCard(dog, 0, null);
      }
    }
  }
  createDatils(null);
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

function calculateTripDuration(hourStart, hourEnd) {
  const hourStartNum = hourStart.textContent;
  const hourEndNum = hourEnd.textContent;
  const timePartsStart = hourStartNum.split(":");
  const startHour = parseInt(timePartsStart[0], 10);
  const startMinutes = parseInt(timePartsStart[1], 10);
  const timePartsEnd = hourEndNum.split(":");
  const endHour = parseInt(timePartsEnd[0], 10);
  const endMinutes = parseInt(timePartsEnd[1], 10);
  if (endMinutes < startMinutes) {
    let totalMinutes = 60 - startMinutes;
    totalMinutes = totalMinutes + endMinutes;
    let totalHour = endHour - startHour - 1;
    return { totalHour, totalMinutes };
  }
  const totalHour = endHour - startHour;
  const totalMinutes = endMinutes - startMinutes;
  return { totalHour, totalMinutes };
}

function convertNumbersToTimeString(hours, minutes) {
  const hoursStr = hours.toString().padStart(2, "0");
  const minutesStr = minutes.toString().padStart(2, "0");
  return `${hoursStr}:${minutesStr}`;
}

function totalTime(hourStart, hourEnd) {
  let calculate = calculateTripDuration(hourStart, hourEnd);
  const totalString = convertNumbersToTimeString(
    calculate.totalHour,
    calculate.totalMinutes
  );
  return totalString;
}

function createDateTrip(trip) {
  const tripTitles = document.getElementById("tripTitles");
  const tripDate = document.getElementById("dateTrip");
  let formattedDate;
  if (trip) {
    tripDate.innerHTML = `${trip.date} <span class="ownerTrip">By Idan</span>`;
  } else {
    formattedDate = setCurrentDate();
    tripDate.innerHTML = `${formattedDate} <span class="ownerTrip">By Idan</span>`;
  }
  const ownerTripSpan = document.querySelector(".ownerTrip");
  const editIcon = document.createElement("span");
  editIcon.classList.add("editIconOneTrip");
  ownerTripSpan.appendChild(editIcon);
  trip_lp.date = formattedDate;
  tripTitles.appendChild(tripDate);
}

function finishTrip() {
  const finishButton = document.getElementById("finishTripButton");
  finishButton.addEventListener("click", () => {
    finishButton.style.display = "none";
    const min = 8;
    const max = 100;
    trip_lp.id = Math.floor(Math.random() * (max - min + 1)) + min;
    const hourStart = document.getElementsByClassName("hourStart");
    trip_lp.start_time = hourStart[0].textContent;
    const hourEnd = document.getElementsByClassName("hourEnd");
    hourEnd[0].textContent = getCurrentTime();
    trip_lp.end_time = hourEnd[0].textContent;
    const total = document.getElementsByClassName("totalValue");
    total[0].textContent = totalTime(hourStart[0], hourEnd[0]);
    const distance = document.getElementsByClassName("disValue");
    let randomNumber = Math.random().toFixed(2);
    distance[0].textContent = randomNumber + "km";
    trip_lp.distance = distance[0].textContent;
    checkBoxNeeds();
    console.log(`POST {domain}/trips/${trip_lp.id}`);
    console.log("Request Body:", trip_lp);
  });
}

function checkBoxNeeds() {
  for (let i = 0; i < numDogs; i++) {
    const checkboxPee = document.getElementsByClassName("needsPeeCheckbox")[i];
    const checkboxPoop =
      document.getElementsByClassName("needsPoopCheckbox")[i];
    trip_lp.needs_pee[i] = checkboxPee.checked;
    trip_lp.needs_poop[i] = checkboxPoop.checked;
  }
}

function existGroupTrip(trip, dataDogs) {
  const finishButton = document.getElementById("finishTripButton");
  finishButton.style.display = "none";
  let countDog = 0;
  for (const dogId of trip.dogs_id) {
    const dog = findDog(dataDogs, dogId);
    createDogCard(dog, 1, trip, countDog);
    countDog++;
  }
  createDatils(trip);
}

function createDogCard(dog, type, trip, countDog) {
  const secDogsGroup = document.getElementById("dogs_cards");
  const cardDog = document.createElement("div");
  cardDog.classList.add("card");
  const cardBody = document.createElement("div");
  cardBody.classList.add("card-body");
  cardBody.classList.add("cardGroup_trip");
  handleSecNotes(cardBody);
  handleSecNeeds(dog, type, trip, cardBody, countDog);
  handleSecNameImg(dog, trip, cardBody);
  cardDog.appendChild(cardBody);
  secDogsGroup.appendChild(cardDog);
}

function handleSecNameImg(dog, trip, cardBody) {
  const sectImgName = document.createElement("section");
  sectImgName.classList.add("secImgNameG_trip");
  const imgDog = document.createElement("img");
  imgDog.classList.add("imgDogInTrip");
  imgDog.src = dog.img_dog;
  imgDog.alt = dog.dogName;
  imgDog.title = dog.dogName;
  let dogName = document.createElement("h6");
  dogName.classList.add("dogName");
  dogName.textContent = dog.dogName;
  sectImgName.appendChild(imgDog);
  sectImgName.appendChild(dogName);
  cardBody.appendChild(sectImgName);
}

function handleSecPeeSelect(dog, trip, sectNeeds) {
  const sectPee = document.createElement("section");
  sectPee.classList.add("sectPeeG_trip");
  const needsPeeCheckbox = document.createElement("input");
  needsPeeCheckbox.type = "checkbox";
  needsPeeCheckbox.classList.add("needsPeeCheckbox");
  needsPeeCheckbox.style.accentColor = "#ffffff";
  const imgPeeTop = document.createElement("img");
  imgPeeTop.src = "images/icons/pee.svg";
  imgPeeTop.alt = "imgPeeTop";
  imgPeeTop.title = "imgPeeTop";
  imgPeeTop.classList.add("imgPeeTop-G");
  const imgPeeBot = document.createElement("img");
  imgPeeBot.src = "images/icons/pee.svg";
  imgPeeBot.alt = "imgPeeBot";
  imgPeeBot.title = "imgPeeBot";
  imgPeeBot.classList.add("imgPeeBot-G");
  sectPee.appendChild(needsPeeCheckbox);
  sectPee.appendChild(document.createTextNode("Pee"));
  sectPee.appendChild(imgPeeBot);
  sectPee.appendChild(imgPeeTop);
  sectNeeds.appendChild(sectPee);
}

function handleSecPoopSelect(dog, trip, sectNeeds) {
  const sectPoop = document.createElement("section");
  sectPoop.classList.add("sectPoop");
  const needsPoopCheckbox = document.createElement("input");
  needsPoopCheckbox.type = "checkbox";
  needsPoopCheckbox.classList.add("needsPoopCheckbox");
  needsPoopCheckbox.style.accentColor = "#ffffff";
  const imgPoop = document.createElement("img");
  imgPoop.src = "images/icons/poop.svg";
  imgPoop.alt = "imgPoop";
  imgPoop.title = "imgPoop";
  imgPoop.classList.add("imgPoop-G");
  sectPoop.appendChild(needsPoopCheckbox);
  sectPoop.appendChild(document.createTextNode("Poop"));
  sectPoop.appendChild(imgPoop);
  sectNeeds.appendChild(sectPoop);
}

function handleSecNeeds(dog, type, trip, cardBody, countDog) {
  const sectNeeds = document.createElement("section");
  sectNeeds.classList.add("sectNeedsG_trip");
  handleSecPeeSelect(dog, trip, sectNeeds);
  handleSecPoopSelect(dog, trip, sectNeeds);
  const needsPeeCheckbox = document.getElementsByClassName("needsPeeCheckbox");
  const needsPoopCheckbox =
    document.getElementsByClassName("needsPoopCheckbox");
  if (type == 0) {
    needsPeeCheckbox.checked = false;
    needsPoopCheckbox.checked = false;
  } else if (type == 1) {
    needsPeeCheckbox.checked = trip.needs_pee[countDog];
    needsPoopCheckbox.checked = trip.needs_poop[countDog];
  }
  cardBody.appendChild(sectNeeds);
}

function handleSecNotes(cardBody) {
  const sectNotes = document.createElement("section");
  sectNotes.classList.add("sectNotesG_trip");
  const formFloat = document.createElement("div");
  formFloat.classList.add("form-floating");
  const textNote = document.createElement("textarea");
  textNote.classList.add("form-control");
  formFloat.appendChild(textNote);
  sectNotes.appendChild(formFloat);
  cardBody.appendChild(sectNotes);
}

function createDatils(trip) {
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
  handleTopDeatils(detailsPart);
  handleLowDeatils(detailsPart);
  cardTime.appendChild(detailsPart);
  secDetailsTrip.appendChild(cardTime);
}

function handleNameImgTime(cardTime) {
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

function handleTopDeatils(detailsPart, trip) {
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
    hourStart.textContent = trip.start_time;
    hourEnd.textContent = trip.end_time;
  }
  start.appendChild(hourStart);
  end.appendChild(hourEnd);
  topDetailsPart.appendChild(start);
  topDetailsPart.appendChild(end);
  detailsPart.appendChild(topDetailsPart);
}

function handleLowDeatils(detailsPart, trip) {
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
    valueDis.textContent = `0km`;
  } else {
    valueDis.textContent = trip.distance;
  }
  detailscardDistance.appendChild(valueDis);
  cardDistance.appendChild(detailscardDistance);
}

function deleteObject(selectedTripId) {
  const deleteDogButton = document.getElementById("deleteDogButton");
  deleteDogButton.addEventListener("click", () => {
    if (confirm("Are you sure you want to delete this trip?")) {
      console.log(`DELETE {domain}/trips/${selectedTripId}`);
      window.location.href = `tripsList.html?selectedTripId=${selectedTripId}`;
    }
  });
}
