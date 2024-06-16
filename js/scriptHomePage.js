window.onload = () => {
    fetch("data/dogs.json")
      .then((response) => response.json())
      .then((data) => initDogsHomePage(data));
};

// window.onload = () => {
//     fetch("data/dogs.json")
//       .then((response) => response.json())
//       .then((data) => console.log(data));
// };

function initDogsHomePage(data) {
    console.log(data);
    const titleDogs = document.getElementById("title");
    titleDogs.textContent = data.title;
    const imgsCont = document.getElementById("dogsImgs-Container");

    for (const dog of data.dogs) {
        console.log(dog);
        const imgWrapper = document.createElement("div");
        imgWrapper.classList.add("imgWrapper");
        const img = document.createElement("img");
        img.src = dog.img_dog;
        let dogName = document.createElement("h5");
        dogName.classList.add("dogName");
        dogName.textContent = dog.dogName;
        imgWrapper.appendChild(img);
        imgWrapper.appendChild(dogName);
        imgsCont.appendChild(imgWrapper);
    }

    // data.dogs.forEach(dog => {
    //     const imgWrapper = document.createElement("div");
    //     imgWrapper.classList.add("imgWrapper");
    
    //     const img = document.createElement("img");
    //     img.src = dog.img_dog;
    //     // img.alt = dog.dogName; // Optional: Adding alt text for accessibility
    
    //     imgWrapper.appendChild(img);
    //     imgsCont.appendChild(imgWrapper);
    //   });

    // document.getElementsByTagName("main")[0].appendChild(imgsCont); 
}

