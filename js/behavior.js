window.onload = () => {
    const userId = sessionStorage.getItem('userId');
    getDataUser(userId);
    fetch(`https://soulofdog-server.onrender.com/api/dogs/dogId/${userId}`)
    .then((response) => response.json())
    .then((dogId) => init(dogId.dogId));
};

function getDataDogsOwner(userId) {
    fetch(`https://soulofdog-server.onrender.com/api/dogs/dogDataByUserId/${userId}`)
    .then((response) => response.json())
    .then((dataDogs) => initOwnerHomePage(dataDogs));
}

async function getGraphsData(dogId) {
    try {
        const response = await fetch(`https://soulofdog-server.onrender.com/api/dogs/dataForGraphs/${dogId}`);
        const data = await response.json();
        return processFetchedData(data);
    } catch (error) {
        console.error('Error fetching data:', error);
        return [];
    }
}

function processFetchedData(data) {
    const recentData = data.data;
    return {
        labels: recentData.map(item => item.date),
        datasets: [
            {
                label: 'Steps',
                data: recentData.map(item => item.steps),
                backgroundColor: 'rgba(75, 192, 192, 0.2)',
                borderColor: 'rgba(75, 192, 192, 1)',
                borderWidth: 1
            },
            {
                label: 'Range',
                data: recentData.map(item => item.distance),
                backgroundColor: 'rgba(153, 102, 255, 0.2)',
                borderColor: 'rgba(153, 102, 255, 1)',
                borderWidth: 1
            },
            {
                label: 'avgHeartBeat',
                data: recentData.map(item => item.avgHeartbeat),
                backgroundColor: 'rgba(255, 159, 64, 0.2)',
                borderColor: 'rgba(255, 159, 64, 1)',
                borderWidth: 1
            },
            {
                label: 'avgSpeed',
                data: recentData.map(item => item.avgSpeed),
                backgroundColor: 'rgba(255, 99, 132, 0.2)',
                borderColor: 'rgba(255, 99, 132, 1)',
                borderWidth: 1
            }
        ]
    };
}

function getOptions() {
    return {
        scales: {
            y: {
                beginAtZero: true
            }
        },
        plugins: {
            zoom: {
                pan: {
                    enabled: true,
                    mode: 'xy'
                },
                zoom: {
                    enabled: true,
                    mode: 'xy',
                    speed: 0.1,
                    threshold: 2
                }
            }
        }
    };
}

async function createCharts(dogId) {
    let charts = [];
    const data = await getGraphsData(dogId);
    if (!data.labels.length) {
        console.error('No data available for chart creation.');
        return;
    }
    const checkedTypes = Array.from(document.querySelectorAll('input[name="chartType"]:checked')).map(checkbox => checkbox.value);
    console.log(checkedTypes);
    const chartTypes = {
        'Steps': 'bar',
        'Range': 'bar',
        'avgHeartBeat': 'bar',
        'avgSpeed': 'bar'
    };
    data.datasets.forEach((dataset, index) => {
        const canvas = document.getElementById(`chart${index + 1}`);
        console.log(dataset.label);
        if (checkedTypes.includes(dataset.label)) {
            if (charts[index]) {
                charts[index].destroy();
            }
            canvas.style.display = 'block';
            const ctx = canvas.getContext('2d');
            charts[index] = new Chart(ctx, {
                type: chartTypes[dataset.label],
                data: {
                    labels: data.labels,
                    datasets: [dataset]
                },
                options: getOptions()
            });
        } else {
            if (charts[index]) {
                charts[index].destroy();
            }
            console.log('else');
            canvas.style.display = 'none'; // Hide the canvas
        }
    });
}

function setUpEventListeners(dogId) {
    document.querySelectorAll('input[name="chartType"]').forEach(checkbox => {
        checkbox.addEventListener('change', () => createCharts(dogId));
    });
}

function init(dogId) {
    setUpEventListeners(dogId);
    createCharts(dogId);
}