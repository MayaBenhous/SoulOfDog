window.onload = () => {
    fetch("data/dogs.json")
      .then((response) => response.json())
      .then((data) => initDogsHomePage(data));
};

function initDogsHomePage(data) {
    console.log(data);
    const titleDogs = document.getElementById("title");
    titleDogs.textContent = data.title;
    const imgsCont = document.getElementById("dogsImgs-Container");
    const startTripButton = document.getElementById("startTripButton");
    const deleteDogButton = document.getElementById("deleteDogButton");
    const selectedDogs = new Set();

    for (const dog of data.dogs) {
        console.log(dog);
        const imgWrapper = document.createElement("div");
        imgWrapper.classList.add("imgWrapper");
        const img = document.createElement("img");
        img.src = dog.img_dog;
        img.alt = dog.dogName;
        img.title = dog.dogName;

        let dogName = document.createElement("h5");
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
            startTripButton.style.display = selectedDogs.size > 0 ? "block" : "none";
            deleteDogButton.style.display = selectedDogs.size > 0 ? "block" : "none";

        });

        startTripButton.addEventListener("click", () => {
            const selectedIds = Array.from(selectedDogs).join(",");
            window.location.href = `groupTrip.html?selectedDogs=${selectedIds}`;
        });
    }
}





