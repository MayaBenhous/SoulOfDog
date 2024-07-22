window.onload = () => {
  const urlParams = new URLSearchParams(window.location.search);
  // const selectedTripId = urlParams.get("selectedTripId");
  // const dogId = urlParams.get("selectedDogId");

  getTripData(selectedTripId);
  // startWithoutServer();
};

const selectedTripId = 8;
const dogId = 1;

function startWithoutServer(){
    Promise.all([
    fetch("data/Trips.json").then((response) => response.json()),
    fetch("data/dogs.json").then((response) => response.json()),
  ])
    .then(([dataTrips, dataDogs]) => {
      initTrip(dataTrips, dataDogs, dogId, selectedTripId);
      deleteObject(selectedTripId);
    });
}

function getTripData(tripId) {
  fetch(`https://soulofdog-server.onrender.com/api/trips/getTripFromList/${tripId}`)
  .then((response) => response.json())
  .then((dataTrip) => initSingleTrip(dataTrip));
}

function initSingleTrip(dataTrip) {
  let dataDog = dataTrip.trip.dogs[0];
  initTrip(dataTrip.trip, dataDog);
}


function initTrip(dataTrip, dataDog) {
  const contTripMainDetails = document.getElementById("TripMainDetails-container");
  const singleTripCardsCont = document.getElementById("singleTripCrads-container");
  console.log(dataDog)
  handleSingleTripTitle(dataDog);
  console.log(dataTrip);
  handleSingleDetails(dataTrip);
    titlesArr.forEach((title,index) => {
      handleCreateCard(title, index, dataTrip, dataDog);
    });
        
}

function handleNeeds(sectNeeds, dogInTrip, detailsPart) {
  sectNeeds.classList.add("sectNeedsG_trip");
  const sectPee = document.createElement("section");
  sectPee.classList.add("sectPeeG_trip");
  const needsPeeCheckbox = document.createElement("input");
  needsPeeCheckbox.type = "checkbox";
  needsPeeCheckbox.style.accentColor = "#ffffff";
  needsPeeCheckbox.checked = dogInTrip.needPee;
  const imgPeeTop = document.createElement("img");
  imgPeeTop.src="images/icons/pee.svg";
  imgPeeTop.alt =  "imgPeeTop";
  imgPeeTop.title =  "imgPeeTop";
  imgPeeTop.classList.add("imgPeeTop-G");
  const imgPeeBot = document.createElement("img");
  imgPeeBot.src="images/icons/pee.svg";
  imgPeeBot.alt =  "imgPeeBot";
  imgPeeBot.title =  "imgPeeBot";
  imgPeeBot.classList.add("imgPeeBot-G");

  sectPee.appendChild(needsPeeCheckbox);
  sectPee.appendChild(document.createTextNode("Pee"));
  sectPee.appendChild(imgPeeBot);
  sectPee.appendChild(imgPeeTop);

  const sectPoop = document.createElement("section");
  sectPoop.classList.add("sectPoop");
  const needsPoopCheckbox = document.createElement("input");
  needsPoopCheckbox.type = "checkbox";
  needsPoopCheckbox.style.accentColor = "#ffffff";
  needsPoopCheckbox.checked = dogInTrip.needPoop;
  const imgPoop = document.createElement("img");
  imgPoop.src = "images/icons/poop.svg";
  imgPoop.alt =  "imgPoop";
  imgPoop.title =  "imgPoop";
  imgPoop.classList.add("imgPoop-G");

  sectPoop.appendChild(needsPoopCheckbox);
  sectPoop.appendChild(document.createTextNode("Poop"));
  sectPoop.appendChild(imgPoop);
  sectNeeds.appendChild(sectPee);
  sectNeeds.appendChild(sectPoop);
  detailsPart.appendChild(sectNeeds);
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
  let calculate = calculateTripDuration(hourStart,hourEnd);
  const totalString = convertNumbersToTimeString(calculate.totalHour, calculate.totalMinutes);
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

function handleNotes(dogInTrip, detailsPart) {
  const sectNotes = document.createElement("section");
  sectNotes.classList.add("sectNotesG_trip");
  sectNotes.classList.add("sectNotesS_trip");
  const formFloat = document.createElement("div");
  formFloat.classList.add("form-floating");
  const textNote = document.createElement("textarea");
  textNote.classList.add("form-control");
  textNote.textContent = dogInTrip.notes;

  formFloat.appendChild(textNote);
  sectNotes.appendChild(formFloat);
  detailsPart.appendChild(sectNotes);
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

iconsArr = ['images/icons/clock.svg','images/icons/distance.svg','images/icons/heartbeat.svg','images/icons/steps.svg','images/icons/avgSpeed.svg','images/icons/needs.svg','images/icons/notes.svg'];
titlesArr = ['Trip Duration', 'distance', 'heartbeat','steps', 'avg_speed', 'Needs', 'Notes'];
   
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
    const sectNeeds = document.createElement("section");
    handleNeeds(sectNeeds, dogintrip, detailsPart);
  }
  else if (title === 'Notes') {
    handleNotes(dogintrip, detailsPart);
  }
  detailsPart.appendChild(value);
  card.appendChild(detailsPart);
  singleTripCardsCont.appendChild(card);
}

function calculateTripDuration(hourStart,hourEnd) {
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
  const hoursStr = hours.toString().padStart(2, '0');
  const minutesStr = minutes.toString().padStart(2, '0');
  return `${hoursStr}:${minutesStr}`;
}

function deleteObject(selectedTripId) { //to finish
  const deleteDogButton = document.getElementById("deleteDogButton");
  deleteDogButton.addEventListener("click", () => {
    if(confirm("Are you sure you want to delete this trip?")) {
      console.log(`DELETE {domain}/trips/${selectedTripId}`);
      window.location.href = `tripsList.html?selectedTripId=${selectedTripId}`;
    }
  });
}




