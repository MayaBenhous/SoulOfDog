const dogIdTmp = 1;
const tripIdTmp = 2;

window.onload = () => {
  const urlParams = new URLSearchParams(window.location.search);
  const selectedDogId = urlParams.get("selectedDogId");
  const selectedDogContainer = document.getElementById("selectedDogId");
//   selectedDogsContainer.innerHTML = `Selected Dogs IDs: ${selectedDogs}`;
//   const urlParams = new URLSearchParams(window.location.search);
//   const selectedDogs = urlParams.get("selectedDogs");
//   const selectedDogsContainer = document.getElementById("selectedDogs");
//   selectedDogsContainer.innerHTML = `Selected Dogs IDs: ${selectedDogs}`;

  Promise.all([
    fetch("data/Trips.json").then((response) => response.json()),
    fetch("data/dogs.json").then((response) => response.json()),
  ])
    .then(([dataTrips, dataDogs]) => {
      initTrip(dataTrips, dataDogs);
    })
};

// const dogIdTmp = selectedTripId;
// const tripIdTmp = dataTrips.trips[selectedTripId].dog;

function initTrip(dataTrips, dataDogs) {
    const contTripMainDetails = document.getElementById("TripMainDetails-container");
    
    dataDogs.dogs.forEach(dog => {   
        if (dog.id === dogIdTmp) {
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
                if (trip.id === tripIdTmp) {
                    const tripDate = document.getElementById("dateTrip");
                    tripDate.innerHTML = `${trip.date} <span class="ownerTrip">By ${trip.implement}</span>`;

                    const ownerTripSpan = document.querySelector('.ownerTrip');
                    const editIcon = document.createElement('span');
                    editIcon.classList.add("editIconOneTrip");
                    ownerTripSpan.appendChild(editIcon);
                }
            });   
        }
    });
}
