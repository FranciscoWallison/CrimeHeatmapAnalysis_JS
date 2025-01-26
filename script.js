let map;
let heatLayer;
let crimeChart;  // Variável global para armazenar o gráfico

// Mapeamento dos tipos de crimes em inglês para português
const crimeTypeTranslation = {
    "DISTURBING THE PEACE": "PERTURBANDO A PAZ",
    "PROPERTY CRIMES": "Crimes contra o Patrimônio",
    "VIOLENT CRIMES": "Crimes Violentos",
    "DRUG OFFENSES": "Ofensas Relacionadas a Drogas",
    "THEFT": "Roubo",
    "BURGLARY": "Arrombamento",
    "VANDALISM": "Vandalismo",
    "ASSAULT": "Agressão",
    "FRAUD": "Fraude",
    "HOMICIDE": "Homicídio",
    "SEXUAL OFFENSES": "Ofensas Sexuais",
    "OTHER": "Outros",
    "ARSON": "Incêndio criminoso",
    "VEHICLE THEFT": "Roubo de veículo",
};


// Função para carregar o CSV e processar os dados
async function loadCSV() {
    try {
        const response = await fetch('policecalls.csv');
        const data = await response.text();

        const crimeData = data.split('\n').slice(1).map(row => {
            const columns = row.split(',');

            if (columns.length < 4) return null;

            const date = columns[0].trim();
            const year = date.split('-')[0];
            const type = columns[1].trim();
            const translatedType = crimeTypeTranslation[type] || type; 
            const lat = parseFloat(columns[2].trim());
            const lng = parseFloat(columns[3].trim());

            if (isNaN(lat) || isNaN(lng)) return null;
    
            return { date, year, type: translatedType, lat, lng };
        }).filter(item => item !== null);

        populateFilters(crimeData);
        initializeMap();
        updateVisualization(crimeData);
    } catch (error) {
        console.error("Error loading CSV:", error);
    }
}

// Função para popular os filtros de ano e tipo de crime
function populateFilters(crimeData) {
    const yearSelect = document.getElementById('yearSelect');
    const typeSelect = document.getElementById('typeSelect');

    // Extrair anos únicos
    const years = [...new Set(crimeData.map(crime => crime.year))].sort();
    years.forEach(year => {
        const option = document.createElement('option');
        option.value = year;
        option.textContent = year;
        yearSelect.appendChild(option);
    });

    // Extrair tipos de crime únicos
    const types = [...new Set(crimeData.map(crime => crime.type))].sort();
    types.forEach(type => {
        const option = document.createElement('option');
        option.value = type;
        option.textContent = type;
        typeSelect.appendChild(option);
    });

    // Adicionar evento de mudança aos filtros
    yearSelect.addEventListener('change', () => updateVisualization(crimeData));
    typeSelect.addEventListener('change', () => updateVisualization(crimeData));
}

// Inicializa o mapa apenas uma vez
function initializeMap() {
    if (!map) {
        map = L.map('map').setView([-3.73784, -38.5554], 12);
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            maxZoom: 18,
        }).addTo(map);
    }
}

// Função para atualizar o mapa e gráfico conforme filtros
function updateVisualization(crimeData) {
    const selectedYear = document.getElementById('yearSelect').value;
    const selectedType = document.getElementById('typeSelect').value;

    // Filtrar dados conforme seleção do usuário
    const filteredData = crimeData.filter(crime =>
        (selectedYear === 'all' || crime.year === selectedYear) &&
        (selectedType === 'all' || crime.type === selectedType)
    );

    updateMap(filteredData);
    updateChart(filteredData);
}

// Função para atualizar o mapa de calor
function updateMap(crimeData) {
    if (heatLayer) {
        map.removeLayer(heatLayer);
    }

    const heatData = crimeData.map(crime => [crime.lat, crime.lng, 1.0]);

    if (heatData.length === 0) {
        console.warn("No data available for selected filters.");
        return;
    }

    heatLayer = L.heatLayer(heatData, {
        radius: 20,
        blur: 15,
        maxZoom: 14
    }).addTo(map);
}

function updateChart(crimeData) {
    const crimeCounts = {};

    crimeData.forEach(crime => {
        if (!crimeCounts[crime.date]) {
            crimeCounts[crime.date] = {};
        }
        crimeCounts[crime.date][crime.type] = (crimeCounts[crime.date][crime.type] || 0) + 1;
    });

    const labels = Object.keys(crimeCounts);
    const types = [...new Set(crimeData.map(crime => crime.type))];

    const datasets = types.map(type => ({
        label: type,
        data: labels.map(date => crimeCounts[date][type] || 0),
        borderColor: getRandomColor(),
        fill: false
    }));

    const ctx = document.getElementById('crimeChart').getContext('2d');

    // Destruir o gráfico existente antes de criar um novo
    if (crimeChart) {
        crimeChart.destroy();
    }

    crimeChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: labels,
            datasets: datasets
        },
        options: {
            responsive: true,
            scales: {
                x: { title: { display: true, text: 'Data' } },
                y: { title: { display: true, text: 'Quantidade de Crimes' } }
            }
        }
    });
}

// Função auxiliar para gerar cores aleatórias para o gráfico
function getRandomColor() {
    return `#${Math.floor(Math.random()*16777215).toString(16)}`;
}

// Carregar os dados ao iniciar a página
loadCSV();
