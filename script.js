// Função para carregar o CSV e processar os dados
async function loadCSV() {
    const response = await fetch('policecalls.csv');
    const data = await response.text();
    
    const crimeData = data.split('\n').slice(1).map(row => {
        const [date, type, lat, lng] = row.split(',');
        return { date, type, lat: parseFloat(lat), lng: parseFloat(lng) };
    });

    initializeMap(crimeData);
    plotCrimeChart(crimeData);
}

// Inicializa o mapa de calor com ajustes para melhorar a visualização
function initializeMap(crimeData) {
    const map = L.map('map').setView([-3.73784, -38.5554], 12);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 18,
    }).addTo(map);

    // Agrupando coordenadas semelhantes para maior intensidade em regiões com mais crimes
    const heatMapData = crimeData.reduce((acc, crime) => {
        const key = `${crime.lat.toFixed(3)},${crime.lng.toFixed(3)}`;
        acc[key] = (acc[key] || 0) + 1;
        return acc;
    }, {});

    const heatPoints = Object.entries(heatMapData).map(([key, count]) => {
        const [lat, lng] = key.split(',').map(Number);
        return [lat, lng, count];
    });

    L.heatLayer(heatPoints, {
        radius: 20,   // Ajuste do raio para melhor visualização
        blur: 15,     // Nível de suavização
        maxZoom: 14,  // Define o nível máximo de zoom para visualizar os pontos
        max: Math.max(...Object.values(heatMapData)), // Ajuste da intensidade
    }).addTo(map);
}

// Processa os dados para o gráfico de tendências
function plotCrimeChart(crimeData) {
    const crimeCounts = {};

    crimeData.forEach(crime => {
        if (!crimeCounts[crime.date]) {
            crimeCounts[crime.date] = {};
        }
        crimeCounts[crime.date][crime.type] = (crimeCounts[crime.date][crime.type] || 0) + 1;
    });

    const labels = Object.keys(crimeCounts);
    const propertyCrimes = labels.map(date => crimeCounts[date]["PROPERTY CRIMES"] || 0);
    const violentCrimes = labels.map(date => crimeCounts[date]["VIOLENT CRIMES"] || 0);

    const ctx = document.getElementById('crimeChart').getContext('2d');
    new Chart(ctx, {
        type: 'line',
        data: {
            labels: labels,
            datasets: [
                {
                    label: 'Property Crimes',
                    data: propertyCrimes,
                    borderColor: 'blue',
                    fill: false
                },
                {
                    label: 'Violent Crimes',
                    data: violentCrimes,
                    borderColor: 'red',
                    fill: false
                }
            ]
        },
        options: {
            responsive: true,
            scales: {
                x: { title: { display: true, text: 'Date' } },
                y: { title: { display: true, text: 'Crime Count' } }
            }
        }
    });
}

// Carregar os dados ao iniciar a página
loadCSV();
