let userId = 2;

window.onload = () => {
  getTypeUser(userId);
};

function getTypeUser(userId) {
  fetch(`https://soulofdog-server.onrender.com/api/users/getUserType/${userId}`)
  .then((response) => response.json())
  .then((userType) => selectedType(userType, userId));
}

function selectedType(userType, userId) {
  if(userType.data === "owner") {
    getDataDogsOwner(userId);
  } 
  else if(userType.data === "dogWalker") {
    getDataDogsDW(userId);
  }
  else {
    return null;
  }
}

function getDataDogsDW(userId) {
  fetch(`https://soulofdog-server.onrender.com/api/dogs/getDogData/${userId}`)
  .then((response) => response.json())
  .then((dataDogs) => initDogWalkerHomePage(dataDogs));
}

function getDataLastTrip(dogId) {
  return fetch(`https://soulofdog-server.onrender.com/api/trips/getLastTrip/${dogId}`)
  .then((response) => response.json())
}

function getDataDogsOwner(userId) {
  fetch(`https://soulofdog-server.onrender.com/api/dogs/getDogData/${userId}`)
  .then((response) => response.json())
  .then((dataDogs) => initOwnerHomePage(dataDogs));
}

function putconnectDWtoDog(dogId) { // connect it to the add dog function that i will do
  fetch(`https://soulofdog-server.onrender.com/api/dogs/connectDWToDog/${userId}/${dogId}`, {
    method: "PUT", 
  })
  .then((response) => response.json())
  .then((userId) => getDataDogsOwner(userId));
}

function putUnconnectDWtoDog(dogId) {
  fetch(`https://soulofdog-server.onrender.com/api/dogs/unconnectDWToDog/${dogId}`, {
    method: "PUT", 
  })
  .then((response) => response.json())
  .then((userId) => getDataDogsOwner(userId));
}

function createWrapperDataDog(dog,imgWrapper) {
    const img = document.createElement("img");
    img.classList.add("imgHomePage");
    img.src = dog.img;
    img.alt = dog.dogName;
    img.title = dog.dogName;
    let dogName = document.createElement("span");
    dogName.classList.add("dogName");
    dogName.textContent = dog.dogName;

    imgWrapper.appendChild(img);
    imgWrapper.appendChild(dogName);
}

function initDogWalkerHomePage(dataDogs) {
  // const notiCont = document.getElementById("notifications-Container");
  // notiCont.style.display = "none";
  // const titleDogs = document.getElementById("title");
  // titleDogs.textContent = dataDogs.title;
  const imgsCont = document.getElementById("dogsImgs-Container");
  const startTripButton = document.getElementById("startTripButton");
  const deleteDogButton = document.getElementById("deleteDogButton");
  const selectedDogs = new Set();
  for (const dog of dataDogs.dogs) {
    const imgWrapper = document.createElement("div");
    imgWrapper.classList.add("imgWrapper");
    createWrapperDataDog(dog,imgWrapper);
    imgsCont.appendChild(imgWrapper);
      imgWrapper.addEventListener("click", () => {
        imgWrapper.classList.toggle("selected");
        if (imgWrapper.classList.contains("selected")) {
          selectedDogs.add(dog.dogId);
        } else {
          selectedDogs.delete(dog.dogId);
        }
        updateButtonsVisibility(selectedDogs, startTripButton, deleteDogButton);
      });
      startTripButton.addEventListener("click", () => {
        const selectedIds = Array.from(selectedDogs).join(",");
        window.location.href = `groupTrip.html?selectedDogs=${selectedIds}`;
      });
      deleteDogButton.addEventListener("click", () => {
        let askOnce = true;
        let userConfirm = false;
        selectedDogs.forEach((dogId) => {
          const dogToRemove = dataDogs.dogs.find((dog) =>dog.dogId === dogId);
          if (dogToRemove) {
            const imgWrapperToRemove = Array.from(imgsCont.children).find(
              (wrapper) =>
                wrapper.querySelector("img").src.includes(dogToRemove.img)
            );
            if (imgWrapperToRemove) {
              if (askOnce) {
                userConfirm = confirm("Are you sure you want to delete this dogs?");
                askOnce = false;
              }
              if (userConfirm) {
                imgsCont.removeChild(imgWrapperToRemove);                
                putUnconnectDWtoDog(dogId);
              } else {
                return;
              }
            }
          }
        });
        selectedDogs.clear();
        updateButtonsVisibility(selectedDogs, startTripButton, deleteDogButton);
      });
    }
}

function initOwnerHomePage(dataDogs) { // fix!!
  const imgsCont = document.getElementById("dogsImgs-Container");
  for (const dog of dataDogs.dogs) {
    const imgWrapper = document.createElement("div");
    imgWrapper.classList.add("imgWrapper");
    createWrapperDataDog(dog,imgWrapper);
    imgsCont.appendChild(imgWrapper);
  }

  const notificationsCont = document.getElementById("notifications-Container");
  const hpDogDetailsCont = document.getElementById("hpDogDetailsCont");
  const lastActBody = document.getElementById("lastActivity");
  notificationsCont.style.display = "block";
  hpDogDetailsCont.style.display = "flex";

  getDataLastTrip(dataDogs.dogs[0].dogId)
    .then((dataTrip) => {
      const lastActivity = document.createElement("p");
      lastActivity.classList.add("pLastActivity");
      lastActivity.textContent = `Last trip was at ${dataTrip.lastTrip.time}`;
      const sectNeeds = document.createElement("section");
      sectNeeds.classList.add("sectNeedsG_trip");
      handleSecPeeSelect(dataTrip.lastTrip.pee, sectNeeds);
      handleSecPoopSelect(dataTrip.lastTrip.poop, sectNeeds)
      lastActBody.appendChild(lastActivity);
      lastActBody.appendChild(sectNeeds);
  })
  .catch((error) => console.error('Error fetching last trip data:', error));
}

function handleSecPeeSelect(type, sectNeeds) {
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
  if (type == 0) {
    needsPeeCheckbox.checked = false;
  } else if (type == 1) {
    needsPeeCheckbox.checked = true;
  }
  sectPee.appendChild(needsPeeCheckbox);
  sectPee.appendChild(document.createTextNode("Pee"));
  sectPee.appendChild(imgPeeBot);
  sectPee.appendChild(imgPeeTop);
  sectNeeds.appendChild(sectPee);
}

function handleSecPoopSelect(type, sectNeeds) {
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
  if (type == 0) {
    needsPoopCheckbox.checked = false;
  } else if (type == 1) {
    needsPoopCheckbox.checked = true;
  }
  sectPoop.appendChild(needsPoopCheckbox);
  sectPoop.appendChild(document.createTextNode("Poop"));
  sectPoop.appendChild(imgPoop);
  sectNeeds.appendChild(sectPoop);
}

function updateButtonsVisibility(selectedDogs,startTripButton,deleteDogButton) {
  startTripButton.style.display = selectedDogs.size > 0 ? "block" : "none";
  deleteDogButton.style.display = selectedDogs.size > 0 ? "block" : "none";
}
