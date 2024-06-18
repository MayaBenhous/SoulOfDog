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
  const conGroupList = document.getElementById("groupTripCont_id");
  for (const s in selectedDogsIdsArray) {
    const selectDog = selectedDogsIdsArray[s];
    console.log(selectDog);
    for (const dog of dataDogs.dogs) {
      if (dog.id == selectDog) {
        const cardDog = document.createElement("div");
        cardDog.classList.add("card");
        const cardBody = document.createElement("div");
        cardBody.classList.add("card-body");

        const sectNotes = document.createElement("section");
        sectNotes.classList.add("sectNotesG_trip");
        const notesSpan = document.createElement("span");
        notesSpan.textContent = "The dog's needs on the trip were normal";
        sectNotes.appendChild(notesSpan);
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
        // needsPoopCheckbox.checked = dog.needs_poop;
        const imgPoop = document.createElement("img");
        imgPoop.src="images/icons/poop.png";
        imgPoop.alt =  "imgPoop";
        imgPoop.title =  "imgPoop";
        imgPoop.classList.add("imgPoop-G");
        sectPoop.appendChild(needsPoopCheckbox);
        sectPoop.appendChild(document.createTextNode("Poop"));
        sectPoop.appendChild(imgPoop);

        sectNeeds.appendChild(sectPee);
        sectNeeds.appendChild(sectPoop);
        cardBody.appendChild(sectNeeds);

        const sectImgName = document.createElement("section");
        cardBody.classList.add("secImgNameG_trip");
        const imgDog = document.createElement("img");
        imgDog.classList.add("imgDogInTrip");
        imgDog.src = dog.img_dog;
        imgDog.alt = dog.dogName;
        imgDog.title = dog.dogName;
        let dogName = document.createElement("h6");
        dogName.classList.add("nameDogInTrip");
        dogName.textContent = dog.dogName;
        sectImgName.appendChild(imgDog);
        sectImgName.appendChild(dogName);
        cardBody.appendChild(sectImgName);

        cardDog.appendChild(cardBody);
        conGroupList.appendChild(cardDog);
      }
    }
  }
}
