window.onload = () => {
  const urlParams = new URLSearchParams(window.location.search);
  const selectedDogs = urlParams.get("selectedDogs");
  // const selectedDogsContainer = document.getElementById("selectedDogs");
  //   selectedDogsContainer.innerHTML = `Selected Dogs IDs: ${selectedDogs}`;

  Promise.all([
    fetch("data/Trips.json").then((response) => response.json()),
    fetch("data/dogs.json").then((response) => response.json()),
  ]).then(([dataTrips, dataDogs]) => {
    // createDateTrip();
    newGroupTrip(selectedDogs, dataDogs);
    finishTrip();
    createDateTrip();
    // finishTrip();
  });
};

let trip_lp = {
  dogs_id: ["dog1", "dog2", "dog3"],
  date: "2024-06-22",
  start_time: "09:00",
  end_time: "17:00",
  distance: 0,
};

function newGroupTrip(selectedDogs, dataDogs) {
  const selectedDogsIdsArray = selectedDogs.split(",").map((id) => id.trim());
  trip_lp.dogs_id = selectedDogsIdsArray;
  const secDogsGroup = document.getElementById("dogs_cards");
  for (const s in selectedDogsIdsArray) {
    const selectDog = selectedDogsIdsArray[s];
    for (const dog of dataDogs.dogs) {
      if (dog.id == selectDog) {
        const cardDog = document.createElement("div");
        cardDog.classList.add("card");
        const cardBody = document.createElement("div");
        cardBody.classList.add("card-body");
        cardBody.classList.add("cardGroup_trip");

        const sectNotes = document.createElement("section");
        sectNotes.classList.add("sectNotesG_trip");
        const formFloat = document.createElement("div");
        formFloat.classList.add("form-floating");
        const textNote = document.createElement("textarea");
        textNote.classList.add("form-control");
        formFloat.setAttribute(
          "aria-placeholder",
          "The dog's needs on the trip were normal"
        );

        formFloat.appendChild(textNote);
        sectNotes.appendChild(formFloat);
        cardBody.appendChild(sectNotes);

        const sectNeeds = document.createElement("section");
        sectNeeds.classList.add("sectNeedsG_trip");
        const sectPee = document.createElement("section");
        sectPee.classList.add("sectPeeG_trip");
        const needsPeeCheckbox = document.createElement("input");
        // needsPeeCheckbox.classList.add("checkBox");
        needsPeeCheckbox.type = "checkbox";
        needsPeeCheckbox.checked = false;
        // needsPeeCheckbox.checked = dog.needs_pee;
        const imgPeeTop = document.createElement("img");
        imgPeeTop.src = "images/icons/pee.png";
        imgPeeTop.alt = "imgPeeTop";
        imgPeeTop.title = "imgPeeTop";
        imgPeeTop.classList.add("imgPeeTop-G");
        const imgPeeBot = document.createElement("img");
        imgPeeBot.src = "images/icons/pee.png";
        imgPeeBot.alt = "imgPeeBot";
        imgPeeBot.title = "imgPeeBot";
        imgPeeBot.classList.add("imgPeeBot-G");
        sectPee.appendChild(needsPeeCheckbox);
        sectPee.appendChild(document.createTextNode("Pee"));
        sectPee.appendChild(imgPeeBot);
        sectPee.appendChild(imgPeeTop);

        const sectPoop = document.createElement("section");
        sectPoop.classList.add("sectPoop");
        const needsPoopCheckbox = document.createElement("input");
        needsPoopCheckbox.type = "checkbox";
        needsPoopCheckbox.checked = false;
        // needsPoopCheckbox.checked = dog.needs_poop;
        const imgPoop = document.createElement("img");
        imgPoop.src = "images/icons/poop.png";
        imgPoop.alt = "imgPoop";
        imgPoop.title = "imgPoop";
        imgPoop.classList.add("imgPoop-G");
        sectPoop.appendChild(needsPoopCheckbox);
        sectPoop.appendChild(document.createTextNode("Poop"));
        sectPoop.appendChild(imgPoop);

        sectNeeds.appendChild(sectPee);
        sectNeeds.appendChild(sectPoop);
        cardBody.appendChild(sectNeeds);

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

        cardDog.appendChild(cardBody);
        secDogsGroup.appendChild(cardDog);
      }
    }
  }

  const secDetailsTrip = document.getElementById("secDetailsTrip");
  const cardTime = document.createElement("div");
  cardTime.classList.add("cardsSingleTrip");
  const titlePart = document.createElement("div");
  titlePart.classList.add("titlePart");
  const iconImg = document.createElement("span");
  iconImg.classList.add("iconImg");
  iconImg.style.backgroundImage = `url("images/icons/clock.png")`;
  const titleCard = document.createElement("h5");
  titleCard.classList.add("titleCard");
  titleCard.textContent = `Trip Duration`;

  iconImg.appendChild(titleCard);
  titlePart.appendChild(iconImg);
  cardTime.appendChild(titlePart);

  const detailsPart = document.createElement("div");
  detailsPart.classList.add("detailsPart");

  const topDetailsPart = document.createElement("div");
  topDetailsPart.classList.add("topDetailsPart");
  const start = document.createElement("h5");
  start.textContent = `Start`;
  const hourStart = document.createElement("p");
  hourStart.classList.add("hourStart");
  hourStart.textContent = getCurrentTime();

  const end = document.createElement("h5");
  end.textContent = `End`;
  const hourEnd = document.createElement("p");
  hourEnd.classList.add("hourEnd");
  hourEnd.textContent = `00:00`;

  const lowDetailsPart = document.createElement("div");
  lowDetailsPart.classList.add("lowDetailsPart");
  const total = document.createElement("h5");
  total.classList.add("total");
  total.textContent = `Total`;
  const totalNum = document.createElement("p");
  totalNum.classList.add("value");
  totalNum.classList.add("totalValue");
  totalNum.textContent = `00:00`;

  start.appendChild(hourStart);
  end.appendChild(hourEnd);
  topDetailsPart.appendChild(start);
  topDetailsPart.appendChild(end);
  lowDetailsPart.appendChild(total);
  lowDetailsPart.appendChild(totalNum);
  detailsPart.appendChild(topDetailsPart);
  detailsPart.appendChild(lowDetailsPart);
  cardTime.appendChild(detailsPart);

  const cardDistance = document.createElement("div");
  cardDistance.classList.add("cardDistance");
  cardDistance.classList.add("cardsSingleTrip");
  const titleDistance = document.createElement("div");
  titleDistance.classList.add("titlePart");
  const iconImgDistance = document.createElement("span");
  iconImgDistance.classList.add("iconImg");
  iconImgDistance.style.backgroundImage = `url("images/icons/distance.png")`;
  const titleCardDistance = document.createElement("h5");
  titleCardDistance.classList.add("titleCard");
  titleCardDistance.textContent = `Distance`;

  iconImgDistance.appendChild(titleCardDistance);
  titleDistance.appendChild(iconImgDistance);
  cardDistance.appendChild(titleDistance);
  const detailscardDistance = document.createElement("div");
  detailscardDistance.classList.add("detailsPart");
  const valueDis = document.createElement("p");
  valueDis.classList.add("value");
  valueDis.classList.add("disValue");
  valueDis.textContent = `0km`;
  detailscardDistance.appendChild(valueDis);
  cardDistance.appendChild(detailscardDistance);
  secDetailsTrip.appendChild(cardTime);
  secDetailsTrip.appendChild(cardDistance);
}

function listDogsNames() {}
function getCurrentTime() {
  let now = new Date();
  let hours = now.getHours().toString().padStart(2, "0");
  let minutes = now.getMinutes().toString().padStart(2, "0");
  return hours + ":" + minutes;
}

function setCurrentDate() {
  const currentDate = new Date();
  console.log(currentDate);
  const day = String(currentDate.getDate()).padStart(2, "0");
  const month = String(currentDate.getMonth() + 1).padStart(2, "0");
  const year = currentDate.getFullYear();
  const formattedDate = `${day}-${month}-${year}`;
  console.log(formattedDate);

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

function createDateTrip() {
  const titleAndIconsCont = document.getElementById("titleAndIcons-container");
  const tripTitles = document.getElementById("tripTitles");
  const tripDate = document.getElementById("dateTrip");
  const formattedDate = setCurrentDate();
  tripDate.innerHTML = `${formattedDate} <span class="ownerTrip">By Idan</span>`;
  const ownerTripSpan = document.querySelector(".ownerTrip");
  const editIcon = document.createElement("span");
  editIcon.classList.add("editIconOneTrip");
  ownerTripSpan.appendChild(editIcon);

  console.log(formattedDate);
  trip_lp.date = formattedDate;
  tripTitles.appendChild(tripDate);
  titleAndIconsCont.appendChild(tripTitles);
}

function finishTrip() {
  const finishButton = document.getElementById("finishTripButton");
  finishButton.addEventListener("click", () => {
    const hourStart = document.getElementsByClassName("hourStart");
    hourStart[0];
    console.log(hourStart[0]);
    trip_lp.start_time = hourStart[0].textContent;

    const hourEnd = document.getElementsByClassName("hourEnd");
    hourEnd[0].textContent = getCurrentTime();
    console.log(hourEnd[0]);
    trip_lp.end_time = hourEnd[0].textContent;

    let calculate = calculateTripDuration(hourStart[0], hourEnd[0]);
    const totalString = convertNumbersToTimeString(
      calculate.totalHour,
      calculate.totalMinutes
    );
    const total = document.getElementsByClassName("totalValue");
    total[0].textContent = totalString;
    const distance = document.getElementsByClassName("disValue");
    distance[0].textContent = "0.3km";
    trip_lp.distance = distance[0].textContent;
    console.log(trip_lp);
    let trip_lp_string = JSON.stringify(trip_lp);
    console.log(trip_lp_string);
    window.location.href = `tripsList.html?newTripObj=${encodeURIComponent(trip_lp_string)}`;
  });
}
