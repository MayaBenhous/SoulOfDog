window.onload = () => {
  const urlParams = new URLSearchParams(window.location.search);
  const selectedDogs = urlParams.get("selectedDogs");
  const selectedDogsContainer = document.getElementById("selectedDogs");
  //   selectedDogsContainer.innerHTML = `Selected Dogs IDs: ${selectedDogs}`;

  Promise.all([
    fetch("data/Trips.json").then((response) => response.json()),
    fetch("data/dogs.json").then((response) => response.json()),
  ])
    .then(([dataTrips, dataDogs]) => {
      newGroupTrip(selectedDogs, dataDogs);
    })
    .catch((error) => {
      console.error("Error fetching data:", error);
    });
};

function newGroupTrip(selectedDogs, dataDogs) {
  const selectedDogsIdsArray = selectedDogs.split(",").map((id) => id.trim());
  // const conGroupList = document.getElementById("groupTripCont_id");
  const secDogsGroup = document.getElementById("dogs_cards");
  for (const s in selectedDogsIdsArray) {
    const selectDog = selectedDogsIdsArray[s];
    console.log(selectDog);
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
        textNote.setAttribute ("rows", 20);

        formFloat.appendChild(textNote);
        sectNotes.appendChild(formFloat);
        cardBody.appendChild(sectNotes);

        const sectNeeds = document.createElement("section");
        sectNeeds.classList.add("sectNeedsG_trip");
        const sectPee = document.createElement("section");
        sectPee.classList.add("sectPeeG_trip");
        const needsPeeCheckbox = document.createElement("input");
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
  // {
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
  hourStart.textContent = getCurrentTime();

  const end = document.createElement("h5");
  end.textContent = `End`;
  const hourEnd = document.createElement("p");
  hourEnd.classList.add("hourEnd")
  hourEnd.textContent = `00:00`;

  const lowDetailsPart = document.createElement("div");
  lowDetailsPart.classList.add("lowDetailsPart");
  const total = document.createElement("h5");
  total.classList.add("total");
  total.textContent = `Total`;
  const totalNum = document.createElement("p");
  totalNum.classList.add("value");
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
  const value = document.createElement("p");
  value.classList.add("value");
  value.textContent = `0km`;
  detailscardDistance.appendChild(value);
  cardDistance.appendChild(detailscardDistance);
  secDetailsTrip.appendChild(cardTime);
  secDetailsTrip.appendChild(cardDistance);
}

function getCurrentTime() {
  let now = new Date();
  let hours = now.getHours().toString().padStart(2, "0");
  let minutes = now.getMinutes().toString().padStart(2, "0");
  return hours + ":" + minutes;
}

function calculateTripDuration(hourStart, hourEnd) {
  const hourStartNum = hourStart.textContent;
  const hourEndNum = hourEnd.textContent;
  const timePartsStart = hourStartNum.split(":");
  const startHour = parseInt(timePartsStart[0], 10);
  console.log(startHour);
  const startMinutes = parseInt(timePartsStart[1], 10);
  console.log(startMinutes);

  const timePartsEnd = hourEndNum.split(":");
  const endHour = parseInt(timePartsEnd[0], 10);
  console.log(endHour);
  const endMinutes = parseInt(timePartsEnd[1], 10);
  console.log(endMinutes);

  const totalHour = endHour - startHour;
  console.log(totalHour);

  const totalMinutes = endMinutes - startMinutes;
  console.log(totalMinutes);

  return { totalHour, totalMinutes };
}

function convertNumbersToTimeString(hours, minutes) {
  const hoursStr = hours.toString().padStart(2, "0");
  const minutesStr = minutes.toString().padStart(2, "0");
  return `${hoursStr}:${minutesStr}`;
}

function finishTrip() {

// let calculate = calculateTripDuration(hourStart, hourEnd);
  // const totalString = convertNumbersToTimeString(
  //   calculate.totalHour,
  //   calculate.totalMinutes
  // );
  // console.log(totalString);
  // totalNum.textContent = totalString;
}