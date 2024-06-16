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
    const titleDogs = document.getElementById("title");
    titleDogs.textContent = data.title;
    const imgsCont = document.getElementById("dogsImgs-Container");

    for (const dog in data.dogs) {
        const imgWrapper = document.createElement("div");
        imgWrapper.classList.add("imgWrapper");
        const img = document.createElement("img");
        img.src = dog.img_dog;

        imgWrapper.appendChild(img);
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

    document.getElementsByTagName("main")[0].appendChild(imgsCont); 
}

