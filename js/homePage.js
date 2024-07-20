window.onload = () => {
  getDataDogs(userId);
};
let userId = 2;

function getDataDogs(userId) {
  fetch(`https://soulofdog-server.onrender.com/api/dogs/getDogData/${userId}`)
  .then((response) => response.json())
  .then((dataDogs) => initDogsHomePage(dataDogs));
}

function initDogsHomePage(dataDogs) {
  console.log(dataDogs);
  const titleDogs = document.getElementById("title");
  titleDogs.textContent = dataDogs.title;
  const imgsCont = document.getElementById("dogsImgs-Container");
  const startTripButton = document.getElementById("startTripButton");
  const deleteDogButton = document.getElementById("deleteDogButton");
  const selectedDogs = new Set();

  for (const dog of dataDogs.dogs) {
    if (dog.id != 0) {
      const imgWrapper = document.createElement("div");
      imgWrapper.classList.add("imgWrapper");
      const img = document.createElement("img");
      img.classList.add("imgHomePage");
      img.src = dog.img;
      // img.src = dog.img_dog;
      img.alt = dog.dogName;
      img.title = dog.dogName;
      let dogName = document.createElement("span");
      dogName.classList.add("dogName");
      dogName.textContent = dog.dogName;

      imgWrapper.appendChild(img);
      imgWrapper.appendChild(dogName);
      imgsCont.appendChild(imgWrapper);

      imgWrapper.addEventListener("click", () => {
        imgWrapper.classList.toggle("selected");
        if (imgWrapper.classList.contains("selected")) {
          selectedDogs.add(dog.id);
        } else {
          selectedDogs.delete(dog.id);
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
          const dogToRemove = dataDogs.dogs.find((dog) => dog.id === dogId);
          if (dogToRemove) {
            const imgWrapperToRemove = Array.from(imgsCont.children).find(
              (wrapper) =>
                wrapper.querySelector("img").src.includes(dogToRemove.img_dog)
            );
            if (imgWrapperToRemove) {
              if (askOnce) {
                userConfirm = confirm("Are you sure you want to delete this dogs?");
                askOnce = false;
              }
              if (userConfirm) {
                imgsCont.removeChild(imgWrapperToRemove);
                console.log(`DELETE {domain}/dogs/${dogId}`);
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
}

function updateButtonsVisibility(selectedDogs,startTripButton,deleteDogButton) {
  startTripButton.style.display = selectedDogs.size > 0 ? "block" : "none";
  deleteDogButton.style.display = selectedDogs.size > 0 ? "block" : "none";
}
