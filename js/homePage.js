let userId = 2;

window.onload = () => {
  getTypeUser(userId);
  handleConnectDWtoDog();
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

function putconnectDWtoDog(userId,dogId) { // connect it to the add dog function that i will do
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
  document.getElementById("addDog").style.display = "block";
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

function initOwnerHomePage(dataDogs) {
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

function handleConnectDWtoDog() {
  const modalElement = document.getElementById('addDogModal');
  const modal = new bootstrap.Modal(modalElement);
  const askPermissionButton = document.getElementById("askPermissionButton");
  askPermissionButton.addEventListener('click', () => {
    const chipId = document.getElementById("chipIdInput").value;
    modal.hide();
    if (chipId) {
      fetch (`https://soulofdog-server.onrender.com/api/dogs/getUserIdByChipId/${chipId}`)
      .then((response) => response.json())
      .then((data) => {
        if (data.userId) {
          sendConnectionRequest(data.userId, chipId); // stopped here
        } else if (data.error) {
          console.error('Error:', data.error);
        }
      })
      .catch((error) => {
        console.error('Error:', error);
      })
    }
  })
}

function sendConnectionRequest(ownerId, chipId) {
  fetch('https://soulofdog-server.onrender.com/api/connectionRequests/add', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      ownerId: ownerId,
      chipId: chipId
    })
  })
  .then(response => response.json())
  .then(data => {
    if (data.success) {
      alert('Connection request sent successfully.');
    } else {
      console.error('Failed to send connection request:', data.error);
      alert(`Error: ${data.error}`);
    }
  })
  .catch((error) => {
    console.error('Error sending connection request:', error);
  });
}

function addOwnerNotification(ownerId, chipId) {
  // console.log(ownerId);
  // console.log(userId);
  // if (ownerId === userId) {
    // console.log(ownerId);
    const notificationsCont = document.getElementById("notifications-Container");
    const notification = document.createElement("div");
    notification.classList.add("notification");
    const message = document.createElement("p");
    message.textContent = `A connection request has been made for chip ID: ${chipId}.`;
    notification.appendChild(message);
  
    const confirmButton = document.createElement("button");
    confirmButton.textContent = "Confirm";
    confirmButton.classList.add("btn", "btn-success");
    confirmButton.addEventListener("click", () => confirmConnection(ownerId, chipId, notification));
    notification.appendChild(confirmButton);
  
    const denyButton = document.createElement("button");
    denyButton.textContent = "Deny";
    denyButton.classList.add("btn", "btn-danger");
    denyButton.addEventListener("click", () => denyConnection(ownerId, chipId, notification));
    notification.appendChild(denyButton);
  
    notificationsCont.appendChild(notification);
  
}

function confirmConnection(ownerId, chipId, notification) {
  fetch('https://soulofdog-server.onrender.com/api/connectionRequests/confirm', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      ownerId: ownerId,
      chipId: chipId
    })
  })
  .then(response => response.json())
  .then(data => {
    if (data.success) {
      alert('Connection confirmed successfully.');
      notification.remove();
    } else {
      console.error('Failed to confirm connection:', data.error);
      alert(`Error: ${data.error}`);
    }
  })
  .catch((error) => {
    console.error('Error confirming connection:', error);
  });

  putconnectDWtoDog();
}

function denyConnection(ownerId, chipId, notification) {
  fetch('https://soulofdog-server.onrender.com/api/connectionRequests/deny', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      ownerId: ownerId,
      chipId: chipId
    })
  })
  .then(response => response.json())
  .then(data => {
    if (data.success) {
      alert('Connection denied successfully.');
      notification.remove();
    } else {
      console.error('Failed to deny connection:', data.error);
      alert(`Error: ${data.error}`);
    }
  })
  .catch((error) => {
    console.error('Error denying connection:', error);
  });
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
