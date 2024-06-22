window.onload = () => {
  const urlParams = new URLSearchParams(window.location.search);
  const selectedTripId = urlParams.get("selectedTripId");
  const dogId = urlParams.get("selectedDogId");
  console.log(selectedTripId);
  console.log(dogId);

  Promise.all([
    fetch("data/Trips.json").then((response) => response.json()),
    fetch("data/dogs.json").then((response) => response.json()),
  ])
    .then(([dataTrips, dataDogs]) => {
      initTrip(dataTrips, dataDogs, dogId, selectedTripId);
    })
};

function calculateTripDuration(hourStart,hourEnd) {
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
  const hoursStr = hours.toString().padStart(2, '0');
  const minutesStr = minutes.toString().padStart(2, '0');
  return `${hoursStr}:${minutesStr}`;
}

function initTrip(dataTrips, dataDogs, dogId, tripId) {
    const contTripMainDetails = document.getElementById("TripMainDetails-container");
    const singleTripCardsCont = document.getElementById("singleTripCrads-container");

    iconsArr = ['images/icons/clock.png','images/icons/distance.png','images/icons/heartbeat.png','images/icons/steps.png','images/icons/avgSpeed.png','images/icons/needs.png','images/icons/notes.png'];
    titlesArr = ['Trip Duration', 'distance', 'heartbeat','steps', 'avg_speed', 'Needs', 'Notes'];

    dataDogs.dogs.forEach(dog => {   
        if (dog.id == dogId) {
            const tripTitle = document.getElementById("titleTrip");
            tripTitle.textContent = `Trip with ${dog.dogName}`;
            const imgWrapper = document.createElement("div");
            imgWrapper.classList.add("imgWrapperOneTrip");
            const img = document.createElement("img");
            img.src = dog.img_dog;
            img.alt = dog.dogName;
            const nameDog = document.createElement("span");
            nameDog.classList.add("dogName");
            nameDog.textContent = dog.dogName;
            
            imgWrapper.appendChild(img);
            imgWrapper.appendChild(nameDog);
            contTripMainDetails.appendChild(imgWrapper);

            dataTrips.trips.forEach(trip => {
              if (trip.id == tripId) {
                  const tripDate = document.getElementById("dateTrip");
                  tripDate.innerHTML = `${trip.date} <span class="ownerTrip">By ${trip.implement}</span>`;

                  const ownerTripSpan = document.querySelector('.ownerTrip');
                  const editIcon = document.createElement('span');
                  editIcon.classList.add("editIconOneTrip");
                  ownerTripSpan.appendChild(editIcon);

                  titlesArr.forEach((title,index) => {
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
                    console.log(card);
                    titleCard.textContent = title;

                    iconImg.appendChild(titleCard);
                    titlePart.appendChild(iconImg);
                    card.appendChild(titlePart);

                    const detailsPart = document.createElement("div");
                    detailsPart.classList.add("detailsPart");

                    if (title == 'Trip Duration') {
                      const topDetailsPart = document.createElement("div");
                      topDetailsPart.classList.add("topDetailsPart");
                      const start = document.createElement("h5");
                      start.textContent = `Start`;
                      const hourStart = document.createElement("p");
                      hourStart.textContent = trip.start_time;
                      const end = document.createElement("h5");
                      end.textContent = `End`;
                      const hourEnd = document.createElement("p");
                      hourEnd.textContent = trip.end_time;

                      const lowDetailsPart = document.createElement("div");
                      lowDetailsPart.classList.add("lowDetailsPart");
                      const total = document.createElement("h5");
                      total.classList.add("total");
                      total.textContent = `Total`;
                      const totalNum = document.createElement("p");
                      totalNum.classList.add("value");
                      let calculate = calculateTripDuration(hourStart,hourEnd);
                      const totalString = convertNumbersToTimeString(calculate.totalHour, calculate.totalMinutes)
                      console.log(totalString);
                      totalNum.textContent = totalString;

                      start.appendChild(hourStart);
                      end.appendChild(hourEnd);
                      topDetailsPart.appendChild(start);
                      topDetailsPart.appendChild(end);
                      lowDetailsPart.appendChild(total);
                      lowDetailsPart.appendChild(totalNum);
                      detailsPart.appendChild(topDetailsPart);
                      detailsPart.appendChild(lowDetailsPart);
                      card.appendChild(detailsPart);
                    }

                    if(title === 'Needs') {
                      const sectNeeds = document.createElement("section");
                      sectNeeds.classList.add("sectNeedsG_trip");
                      const sectPee = document.createElement("section");
                      sectPee.classList.add("sectPeeG_trip");
                      const needsPeeCheckbox = document.createElement("input");
                      needsPeeCheckbox.type = "checkbox";
                      needsPeeCheckbox.checked = false;
                      const imgPeeTop = document.createElement("img");
                      imgPeeTop.src="images/icons/pee.png";
                      imgPeeTop.alt =  "imgPeeTop";
                      imgPeeTop.title =  "imgPeeTop";
                      imgPeeTop.classList.add("imgPeeTop-G");
                      const imgPeeBot = document.createElement("img");
                      imgPeeBot.src="images/icons/pee.png";
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
                      needsPoopCheckbox.checked = false;
                      const imgPoop = document.createElement("img");
                      imgPoop.src = "images/icons/poop.png";
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

                    const value = document.createElement("p");
                    value.classList.add("value");
                    for (const param in trip) {
                      if (param === title)
                        value.textContent = trip[param];
                    }

                    detailsPart.appendChild(value);
                    card.appendChild(detailsPart);
                    singleTripCardsCont.appendChild(card);
                  });
              }
            });
          }
        
    });
}
