// const { normalize } = require("path");

function updateImplementTrip(tripId, implementName) {
  console.log(tripId);
  fetch(`https://soulofdog-server.onrender.com/api/trips/trip/${tripId}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      implementName: implementName
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

function handleEditImplement(userTripSpan, implementNameSpan, trip)
{
  console.log(implementNameSpan);
  const editIcon = document.createElement('span');
  editIcon.classList.add('editIconOneTrip');
  userTripSpan.appendChild(editIcon);
  editIcon.addEventListener('click', () => {
    const input = document.createElement('input');
    input.type = 'text';
    console.log(implementNameSpan);
    console.log(implementNameSpan.innerText);
    input.value = implementNameSpan.innerText;
    implementNameSpan.innerHTML = '';
    implementNameSpan.appendChild(input);
    input.focus();
    editIcon.classList.add('saveIcon');
    editIcon.classList.remove('editIconOneTrip');
    editIcon.addEventListener('click', () => {
      const newName = input.value.trim();
      if (newName) {
        trip.implementName = newName;
        implementNameSpan.innerText = newName;
        editIcon.classList.add('savedIcon');
        editIcon.classList.remove('saveIcon');
        updateImplementTrip(trip.tripId, newName);
      }
    });
  });
}

function handleSecNeeds(dog, type, cardBody) {
  const sectNeeds = document.createElement("section");
  sectNeeds.classList.add("sectNeedsG_trip");
  handleSecPeeSelect(dog, type, sectNeeds);
  handleSecPoopSelect(dog, type, sectNeeds);
  cardBody.appendChild(sectNeeds);
}

function handleSecPeeSelect(dog, type, sectNeeds) {
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
    needsPeeCheckbox.checked = dog.needPee;
  }
  sectPee.appendChild(needsPeeCheckbox);
  sectPee.appendChild(document.createTextNode("Pee"));
  sectPee.appendChild(imgPeeBot);
  sectPee.appendChild(imgPeeTop);
  sectNeeds.appendChild(sectPee);
}

function handleSecPoopSelect(dog, type, sectNeeds) {
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
    needsPoopCheckbox.checked = dog.needPoop;
  }
  sectPoop.appendChild(needsPoopCheckbox);
  sectPoop.appendChild(document.createTextNode("Poop"));
  sectPoop.appendChild(imgPoop);
  sectNeeds.appendChild(sectPoop);
}

function handleSecNotes(dog, cardBody, type) {
  const sectNotes = document.createElement("section");
  sectNotes.classList.add("sectNotesG_trip");
  if(type === "Single")
  {
    sectNotes.classList.add("sectNotesS_trip");   
  }
  const formFloat = document.createElement("div");
  formFloat.classList.add("form-floating");
  const textNote = document.createElement("textarea");
  textNote.classList.add("form-control");
  textNote.classList.add("textarea-Notes");
  textNote.textContent = dog.notes;
  formFloat.appendChild(textNote);
  sectNotes.appendChild(formFloat);
  cardBody.appendChild(sectNotes);
}

function calculateTripDuration(hourStart, hourEnd) {
  const hourStartNum = hourStart.textContent;
  const hourEndNum = hourEnd.textContent;
  const timePartsStart = hourStartNum.split(":");
  const startHour = parseInt(timePartsStart[0], 10);
  const startMinutes = parseInt(timePartsStart[1], 10);
  const timePartsEnd = hourEndNum.split(":");
  const endHour = parseInt(timePartsEnd[0], 10);
  const endMinutes = parseInt(timePartsEnd[1], 10);
  let startTotalMinutes = (startHour * 60) + startMinutes;
  let endTotalMinutes = (endHour * 60) + endMinutes;
  let totalMinutes = endTotalMinutes - startTotalMinutes;
  if (totalMinutes < 0) {
    totalMinutes += 24 * 60; 
  }
  const totalHour = Math.floor(totalMinutes / 60);
  const remainingMinutes = totalMinutes % 60;
  return { totalHour: Math.abs(totalHour), totalMinutes: Math.abs(remainingMinutes) };
}

function convertNumbersToTimeString(hours, minutes) {
  const hoursStr = hours.toString().padStart(2, "0");
  const minutesStr = minutes.toString().padStart(2, "0");
  return `${hoursStr}:${minutesStr}`;
}

function totalTime(hourStart, hourEnd) {
  let calculate = calculateTripDuration(hourStart, hourEnd);
  const totalString = convertNumbersToTimeString(
    calculate.totalHour,
    calculate.totalMinutes
  );
  return totalString;
}

function deleteTrip(tripId) {
    console.log('Deleting trip with ID:', tripId);
    return fetch(`https://soulofdog-server.onrender.com/api/trips/trip/${tripId}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json'
      }
    })
    .then(response => {
      console.log('Response status:', response.status);
      if (!response.ok) {
        throw new Error('Failed to delete trip');
      }
      return response.json();
    })
    .then(data => {
      console.log('Trip deleted successfully:', data);
      return data;
    })
    .catch((error) => {
      console.error('Error deleting trip:', error);
      throw error; 
    });
}

function deleteObject(selectedTripId) 
{ 
  const deleteDogButton = document.getElementById("deleteDogButton");
  deleteDogButton.addEventListener("click", () => {
    if (confirm("Are you sure you want to delete this trip?")) {
      console.log(`DELETE {domain}/trips/${selectedTripId}`);
      deleteTrip(selectedTripId)
      .then(() => {
        console.log('Trip deleted successfully!');
        window.location.href = `tripsList.html`;
      })
      .catch((error) => {
        console.error('Failed to delete trip:', error);
      });
      console.log(`DELETE {domain}/trips/${selectedTripId}`);
    }
  });
}

// function updateDetailsTrip(tripId, dog){
//   console.log(tripId);
//   console.log(dog);
//   console.log(dog.dogId);
//   fetch(`https://soulofdog-server.onrender.com/api/trips/trip/${tripId}`, {
//     method: 'PUT',
//     headers: {
//       'Content-Type': 'application/json'
//     },
//     body: JSON.stringify({
//       tripId: tripId,
//       dog: {
//         dogId: dogId,
//         needPee: needPee, //checkbox
//         needPoop: needPoop, //checkbox
//         notes: notes //area-text
//       }
//     })
//   })
//   .then(response => response.json())
//   .then(data => {
//     if (data.error) {
//       console.error('Failed to send connection request');
//     }
//   })
//   .catch((error) => {
//     console.error('Error sending connection request:', error);
//   }); 
// }

function getCurrentDogState() {
  return Array.from(document.querySelectorAll('.dog-detail')).map(dogDiv => {
      const dogId = dogDiv.querySelector('h3').textContent.replace('Dog ', '');
      return {
          dogId: dogId,
          needPee: document.getElementById(`needPee_${dogId}`).checked,
          needPoop: document.getElementById(`needPoop_${dogId}`).checked,
          notes: document.getElementById(`notes_${dogId}`).value
      };
  });
}

function updateDetailsTrip(tripId, dogs) {
  const currentDogs = getCurrentDogState();
  const currentDataMap = new Map(currentDogs.map(dog => [dog.dogId, dog]));
  const originalDataMap = new Map(dogs.map(dog => [dog.dogId, dog]));
  const changedDogs = currentDogs.filter(dog => {
    const original = originalDataMap.get(dog.dogId);
    return !original ||
            original.needPee !== dog.needPee ||
            original.needPoop !== dog.needPoop ||
            original.notes !== dog.notes;
  });
  if (changedDogs.length > 0) {
      fetch(`https://soulofdog-server.onrender.com/api/trips/trip/${tripId}`, {
          method: 'PUT',
          headers: {
              'Content-Type': 'application/json'
          },
          body: JSON.stringify({
              tripId: tripId,
              tripObjData: changedDogs
          })
      })
      .then(response => response.json())
      .then(data => {
          if (data.error) {
              console.error('Failed to update trip details');
          } else {
              console.log('Trip details updated successfully');
              originalState = currentDogs;
          }
      })
      .catch(error => console.error('Error updating trip details:', error));
  } else {
      console.log('No changes detected');
  }
}

function loadInitialData(tripId) {
  let originalState;
  fetch(`https://soulofdog-server.onrender.com/api/trips/trip/${tripId}`)
      .then(response => response.json())
      .then(data => {
          renderDogDetails(data.tripObjData);
          originalState = data.tripObjData;
      })
      .catch(error => console.error('Error loading initial data:', error));
  return originalState;
}

function handleSaveUpdates(updateTripId) {
  document.getElementById('updateTripButton').addEventListener('click', function() {
    const tripId = updateTripId; 
    // const tripId = 123; 
    let originalState = loadInitialData(tripId);
    updateDetailsTrip(tripId, originalState);
    // loadInitialData(123); // Replace with the actual tripId
  });  
}

