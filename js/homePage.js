window.onload = () => {
  getDataDogs(userId);
};
let userId = 2;

function getDataDogs(userId) {
  fetch(`https://soulofdog-server.onrender.com/api/dogs/getDogData/${userId}`)
  .then((response) => response.json())
  .then((dataDogs) => initDogWalkerHomePage(dataDogs));
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


    // if (dog.dogId != 0) {
    //   const imgWrapper = document.createElement("div");
    //   imgWrapper.classList.add("imgWrapper");
    //   const img = document.createElement("img");
    //   img.classList.add("imgHomePage");
    //   img.src = dog.img;
    //   img.alt = dog.dogName;
    //   img.title = dog.dogName;
    //   let dogName = document.createElement("span");
    //   dogName.classList.add("dogName");
    //   dogName.textContent = dog.dogName;

    //   imgWrapper.appendChild(img);
    //   imgWrapper.appendChild(dogName);
    //   imgsCont.appendChild(imgWrapper);

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
              // wrapper.querySelector("img").src.includes(dogToRemove.img_dog)
            );
            if (imgWrapperToRemove) {
              if (askOnce) {
                userConfirm = confirm("Are you sure you want to delete this dogs?");
                askOnce = false;
              }
              if (userConfirm) {
                imgsCont.removeChild(imgWrapperToRemove);                
                // console.log(`DELETE {domain}/dogs/${dogId}`);
                // console.log(dogId);
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
// }

function updateButtonsVisibility(selectedDogs,startTripButton,deleteDogButton) {
  startTripButton.style.display = selectedDogs.size > 0 ? "block" : "none";
  deleteDogButton.style.display = selectedDogs.size > 0 ? "block" : "none";
}
