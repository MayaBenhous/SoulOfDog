window.onload = () => {
  const userId = sessionStorage.getItem('userId');
  const urlParams = new URLSearchParams(window.location.search);
  const selectedTripId = urlParams.get("selectedTripId");
  const dogId = urlParams.get("selectedDogId");

  getTripData(selectedTripId, dogId);
  deleteObject(selectedTripId);
  getDataUser(userId);
};
iconsArr = ['images/icons/clock.svg','images/icons/distance.svg','images/icons/heartbeat.svg','images/icons/steps.svg','images/icons/avgSpeed.svg','images/icons/needs.svg','images/icons/notes.svg'];
titlesArr = ['Trip Duration', 'distance', 'heartbeat','steps', 'avg_speed', 'Needs', 'Notes'];

function getTripData(tripId, dogId) {
  fetch(`https://soulofdog-server.onrender.com/api/trips/tripFromList/${tripId}`)
  .then((response) => response.json())
  .then((dataTrip) => initSingleTrip(dataTrip, dogId));
}

function initSingleTrip(dataTrip, dogId) {
  let dogData = findDog(dataTrip.trip.dogs, dogId);
  initTrip(dataTrip.trip, dogData);
}

function findDog(dogs, dogId) {
  for(let i = 0; i< dogs.length ; i++) {
    let dog = dogs[i];
    if (dog.dogId == dogId) {
      return dog;
    }
  }
  return null;
}

function initTrip(dataTrip, dataDog) {
  const contTripMainDetails = document.getElementById("TripMainDetails-container");
  const singleTripCardsCont = document.getElementById("singleTripCrads-container");
  handleSingleTripTitle(dataDog);
  handleSingleDetails(dataTrip);
    titlesArr.forEach((title,index) => {
      handleCreateCard(title, index, dataTrip, dataDog);
    });
        
}

function handleTripDuration(detailsPart, trip) {
  const topDetailsPart = document.createElement("div");
  topDetailsPart.classList.add("topDetailsPart");
  const start = document.createElement("h5");
  start.textContent = `Start`;
  const hourStart = document.createElement("p");
  hourStart.textContent = trip.startTime;
  const end = document.createElement("h5");
  end.textContent = `End`;
  const hourEnd = document.createElement("p");
  hourEnd.textContent = trip.endTime;
  const lowDetailsPart = document.createElement("div");
  lowDetailsPart.classList.add("lowDetailsPart");
  const total = document.createElement("h5");
  total.classList.add("total");
  total.textContent = `Total`;
  const totalNum = document.createElement("p");
  totalNum.classList.add("value");
  const totalString = totalTime(hourStart, hourEnd);
  totalNum.textContent = totalString;
  start.appendChild(hourStart);
  end.appendChild(hourEnd);
  topDetailsPart.appendChild(start);
  topDetailsPart.appendChild(end);
  lowDetailsPart.appendChild(total);
  lowDetailsPart.appendChild(totalNum);
  detailsPart.appendChild(topDetailsPart);
  detailsPart.appendChild(lowDetailsPart);
}

function handleSingleTripTitle(dog) {
  const contTripMainDetails = document.getElementById("TripMainDetails-container");
  const tripTitle = document.getElementById("titleTrip");
  tripTitle.textContent = `Trip with ${dog.dogName}`;
  const imgWrapper = document.createElement("div");
  imgWrapper.classList.add("imgWrapperOneTrip");
  const img = document.createElement("img");
  img.src = dog.img;
  img.alt = dog.dogName;
  const nameDog = document.createElement("span");
  nameDog.classList.add("dogName");
  nameDog.textContent = dog.dogName;
  imgWrapper.appendChild(img);
  imgWrapper.appendChild(nameDog);
  contTripMainDetails.appendChild(imgWrapper);
}

function handleSingleDetails(trip){
  const tripDate = document.getElementById("dateTrip");
  tripDate.innerHTML = `${trip.date} <span class="ownerTrip">By ${trip.implementName}</span>`;
  const ownerTripSpan = document.querySelector('.ownerTrip');
  const editIcon = document.createElement('span');
  editIcon.classList.add("editIconOneTrip");
  ownerTripSpan.appendChild(editIcon);
}

function handleCreateCard(title, index, trip, dogintrip) {
  const singleTripCardsCont = document.getElementById("singleTripCrads-container");
  const url = iconsArr[index];
  const card = document.createElement("div");
  card.classList.add("cardsSingleTrip");
  const titlePart = document.createElement("div");
  titlePart.classList.add("titlePart");
  const iconImg = document.createElement("span");
  iconImg.classList.add("iconImg");
  iconImg.style.backgroundImage = `url("${url}")`;
  const titleCard = document.createElement("h5");
  titleCard.classList.add("titleCard");
  titleCard.textContent = title;
  iconImg.appendChild(titleCard);
  titlePart.appendChild(iconImg);
  card.appendChild(titlePart);
  const detailsPart = document.createElement("div");
  detailsPart.classList.add("detailsPart");
  const value = document.createElement("p");
  value.classList.add("value");
  if (title == 'Trip Duration') {
    handleTripDuration(detailsPart, trip);
    card.appendChild(detailsPart);
  }
  else if(title === 'distance') {
    value.textContent = trip.distance+"Km";
  }
  else if(title === 'heartbeat') {
    value.textContent = dogintrip.heartbeat+" BPM";
  }
  else if(title === 'steps') {
    value.textContent = dogintrip.steps;
  }
  else if(title === 'avg_speed') {
    value.textContent = dogintrip.avgSpeed+"Km/h";
  }
  else if(title === 'Needs') {
    handleSecNeeds(dogintrip, 1, detailsPart);
  }
  else if (title === 'Notes') {
    handleSecNotes(dogintrip, detailsPart,"Single");
  }
  detailsPart.appendChild(value);
  card.appendChild(detailsPart);
  singleTripCardsCont.appendChild(card);
}






