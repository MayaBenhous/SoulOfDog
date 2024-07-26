window.onload = () => {
  const userId = sessionStorage.getItem('userId');
  getTypeUser(userId);
  handleConnectDWtoDog(userId);
  getDataNotifications(userId);
  getDataUser(userId);
  initMap();
};

function getTypeUser(userId) {
  fetch(`https://soulofdog-server.onrender.com/api/users/userType/${userId}`)
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
  fetch(`https://soulofdog-server.onrender.com/api/dogs/dogDataByUserId/${userId}`)
  .then((response) => response.json())
  .then((dataDogs) => initDogWalkerHomePage(dataDogs));
}

function getDataNotifications(userId) {
  fetch(`https://soulofdog-server.onrender.com/api/users/notifications/${userId}`)
  .then((response) => response.json())
  .then((dataNoti) => addOwnerNotification(dataNoti));
}

function getDataLastTrip(dogId) {
  return fetch(`https://soulofdog-server.onrender.com/api/trips/lastTrip/${dogId}`)
  .then((response) => response.json())
}

function getDataDogsOwner(userId) {
  fetch(`https://soulofdog-server.onrender.com/api/dogs/dogDataByUserId/${userId}`)
  .then((response) => response.json())
  .then((dataDogs) => initOwnerHomePage(dataDogs));
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
        console.log(selectedIds);
        window.location.href = `groupTrip.html?groupTripId=null&selectedDogsIds=${selectedIds}`;
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
      lastActivity.classList.add("message");
      lastActivity.textContent = `Last trip was at ${dataTrip.time}`;
      const sectNeeds = document.createElement("section");
      sectNeeds.classList.add("sectNeedsG_trip");
      handleSecPeeSelect(dataTrip.pee, sectNeeds);
      handleSecPoopSelect(dataTrip.poop, sectNeeds)
      lastActBody.appendChild(lastActivity);
      lastActBody.appendChild(sectNeeds);
  })
  .catch((error) => console.error('Error fetching last trip data:', error));
}

// async function initMap() {
//   try {
//     const response = await axios.get('http://localhost:8081/api/dogs/location/4');
//     const location = response.data;
//     const map = L.map('map').setView([location.lat, location.lon], 13);

//     L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
//       attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
//       maxZoom: 19
//   }).addTo(map);
  
//     L.marker([location.lat, location.lon]).addTo(map)
//         .bindPopup('Location found.')
//         .openPopup();
//   } catch (error) {
//       console.error('Error initializing map:', error);
//       // alert('Could not load map data.');
//   }
// }

function handleConnectDWtoDog(userId) {
  const modalElement = document.getElementById('addDogModal');
  const modal = new bootstrap.Modal(modalElement);
  const askPermissionButton = document.getElementById("askPermissionButton");
  askPermissionButton.addEventListener('click', () => {
    const chipId = document.getElementById("chipIdInput").value;
    modal.hide();
    if (chipId) {
      fetch (`https://soulofdog-server.onrender.com/api/dogs/userIdByChipId/${chipId}`)
      .then((response) => response.json())
      .then((data) => sendConnectionRequest(data.userId, chipId, userId));
    }
  })
}

function sendConnectionRequest(ownerId, chipId, userId) {
  fetch(`https://soulofdog-server.onrender.com/api/users/newNotification`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      ownerId: ownerId,
      notificationType: 'connect',
      senderId: userId,
      chipId: chipId
    })
  })
  .then(response => response.json())
  .then(data => {
    if (data.error) {
      console.error('Failed to send connection request');
    }
  })
  .catch((error) => {
    console.error('Error sending connection request:', error);
  });
}

function addOwnerNotification(dataNoti) {
  const notificationsCont = document.getElementById("bodyNoti");
  for (let i = 0; i < dataNoti.length; i++) {
    const notification = document.createElement("div");
    notification.classList.add("notification");
    const message = document.createElement("p");
    message.classList.add("message");
    message.textContent = `${dataNoti[i].senderName} the ${dataNoti[i].senderType} wants to ${dataNoti[i].notificationType} with ${dataNoti[i].dogName}`;
    notification.appendChild(message);

    const confirmButton = document.createElement("button");
    confirmButton.textContent = "Confirm";
    confirmButton.classList.add("btn", "btn-success","confirmButton");
    confirmButton.addEventListener("click", () => {
      notification.remove();
      putConnectDWtoDog(dataNoti[i].senderId, dataNoti[i].dogId, dataNoti[i].notificationId);
    });
    notification.appendChild(confirmButton);
  
    const denyButton = document.createElement("button");
    denyButton.textContent = "Deny";
    denyButton.classList.add("btn", "btn-danger", "confirmButton");
    denyButton.addEventListener("click", () => {
      notification.remove();
      deleteNotification(dataNoti[i].notificationId);
    });

    notification.appendChild(denyButton);
    notificationsCont.appendChild(notification);
  }
}

function putConnectDWtoDog(userId,dogId,notiId) {
  fetch(`https://soulofdog-server.onrender.com/api/dogs/connectDWToDog/${userId}/${dogId}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(),
  })
  .then((response) => response.json())
  .then(data => {
    if (data.success) {
      deleteNotification(notiId);
    } else {
      console.error('Failed to connect dog to dog walker connection');
    }
  })
  .catch((error) => {
    console.error('Error confirming connection:', error);
  });
}

function putUnconnectDWtoDog(dogId) {
  fetch(`https://soulofdog-server.onrender.com/api/dogs/unconnectDWToDog/${dogId}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(),
  })
  .then((response) => response.json())
  .then(data => {
    if (!data.success) {
      console.error('Failed to unconnect dog to dog walker connection');
    }
  })
  .catch((error) => {
    console.error('Error confirming connection:', error);
  });
}

function deleteNotification(notificationIdId) {
  fetch(`https://soulofdog-server.onrender.com/api/users/notification/${notificationIdId}`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
    },
  }).then((response) => response.json());
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
