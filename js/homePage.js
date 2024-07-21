window.onload = () => {
  // getTypeUser(userId);
  selectedType(userType);
  // getDataDogs(userId);
};

// function getTypeUser(userId) {
//   fetch(`https://soulofdog-server.onrender.com/api/dogs/getDogData/${userId}`)
//   .then((response) => response.json())
//   .then((userType) => selectedType(userType));
// }

// let userId = 1;
let userId = 2;

// let userType = "owner";
let userType = "dogWalker";

function selectedType(userType) {
  if(userType === "owner")
  {
    getDataDogsOwner(userId);
  }
  else if(userType === "dogWalker")
  {
    getDataDogsDW(userId);
  }
  else
  {
    return null;
  }
}

function getDataDogsDW(userId) {
  fetch(`https://soulofdog-server.onrender.com/api/dogs/getDogData/${userId}`)
  .then((response) => response.json())
  .then((dataDogs) => initDogWalkerHomePage(dataDogs));
}

function getDataDogsOwner(userId) {
  fetch(`https://soulofdog-server.onrender.com/api/dogs/getDogData/${userId}`)
  .then((response) => response.json())
  .then((dataDogs) => initOwnerHomePage(dataDogs));
}

function putUnconnectDWtoDog(dogId) {
  fetch(`https://soulofdog-server.onrender.com/api/dogs/unconnectDWToDog/${dogId}`, {
    method: "PUT", 
  })
  .then((response) => response.json())
  .then((userId) => getDataDogs(userId));
}

function putconnectDWtoDog(dogId) { // connect it to the add dog function that i will do
  fetch(`https://soulofdog-server.onrender.com/api/dogs/connectDWToDog/${userId}/${dogId}`, {
    method: "PUT", 
  })
  .then((response) => response.json())
  .then((userId) => getDataDogs(userId));
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
  const titleDogs = document.getElementById("title");
  titleDogs.textContent = dataDogs.title;
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
  const titleDogs = document.getElementById("title");
  titleDogs.textContent = dataDogs.title;
  const imgsCont = document.getElementById("dogsImgs-Container");
  for (const dog of dataDogs.dogs) {
    const imgWrapper = document.createElement("div");
    imgWrapper.classList.add("imgWrapper");
    createWrapperDataDog(dog,imgWrapper);
    imgsCont.appendChild(imgWrapper);
  }
}

function updateButtonsVisibility(selectedDogs,startTripButton,deleteDogButton) {
  startTripButton.style.display = selectedDogs.size > 0 ? "block" : "none";
  deleteDogButton.style.display = selectedDogs.size > 0 ? "block" : "none";
}
