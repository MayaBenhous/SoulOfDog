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


  