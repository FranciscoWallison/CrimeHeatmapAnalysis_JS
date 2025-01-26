// Função para carregar o CSV e processar os dados
async function loadCSV() {
    try {
        const response = await fetch('policecalls.csv');
        const data = await response.text();
        
        const crimeData = data.split('\n').slice(1).map(row => {
            const columns = row.split(',');

            // Verificando se há dados suficientes na linha
            if (columns.length < 4) return null;

            const date = columns[0].trim();
            const type = columns[1].trim();
            const lat = parseFloat(columns[2].trim());
            const lng = parseFloat(columns[3].trim());

            // Verifica se lat e lng são valores numéricos válidos
            if (isNaN(lat) || isNaN(lng)) {
                console.warn(`Invalid data found and skipped: ${row}`);
                return null;
            }

            return { date, type, lat, lng };
        }).filter(item => item !== null);

        console.log("Loaded Crime Data:", crimeData);

        initializeMap(crimeData);
        plotCrimeChart(crimeData);
    } catch (error) {
        console.error("Error loading CSV:", error);
    }
}

// Inicializa o mapa de calor
function initializeMap(crimeData) {
    const map = L.map('map').setView([-3.73784, -38.5554], 12);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 18,
    }).addTo(map);

    const heatData = crimeData.map(crime => [crime.lat, crime.lng, 1.0]);

    // Verificação adicional para evitar valores inválidos
    if (heatData.length === 0) {
        console.error("No valid heatmap data to display.");
        return;
    }

    L.heatLayer(heatData, {
        radius: 25,
        blur: 15,
        maxZoom: 14
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
