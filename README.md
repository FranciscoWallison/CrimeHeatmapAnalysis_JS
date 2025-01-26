# Mapa de Calor e Análise de Crimes

Este projeto apresenta um **Mapa de Calor** e uma **Análise Temporal** de dados de crimes utilizando tecnologias web. Ele permite que os usuários visualizem a distribuição geográfica e temporal de diferentes tipos de crimes, com a possibilidade de filtrar por ano e tipo.

### Crimes contra patrimonio - 2007 (Arena castelão - Frotaleza/CE)
![image](https://github.com/user-attachments/assets/68afee8a-eb88-4932-a9d2-9d1246cbec6f)




## 🖥️ Funcionalidades

- **Mapa de Calor**:
  - Exibe as regiões com maior concentração de crimes usando o Leaflet.js e o plugin Leaflet Heatmap.
  - Filtros para selecionar o ano e o tipo de crime.

- **Análise Temporal**:
  - Gráfico interativo que mostra a tendência de ocorrências ao longo do tempo utilizando Chart.js.
  - Os tipos de crimes são traduzidos para português.

## 🛠️ Tecnologias Utilizadas

- **HTML**: Estrutura básica do projeto.
- **CSS**: Estilos básicos para layout responsivo.
- **JavaScript**:
  - [Leaflet.js](https://leafletjs.com/): Biblioteca para mapas interativos.
  - [Leaflet.heat](https://github.com/Leaflet/Leaflet.heat): Plugin para criação de mapas de calor.
  - [Chart.js](https://www.chartjs.org/): Biblioteca para gráficos interativos.
- **CSV**: Dados de crimes carregados a partir de um arquivo CSV.

## 🚀 Como Usar

1. Faça o download ou clone o repositório.
2. Certifique-se de que o arquivo `policecalls.csv` esteja no mesmo diretório do projeto.
3. Abra o arquivo `index.html` em um navegador web.

### Estrutura do Projeto
```
├── index.html # Página principal
├── script.js # Lógica do mapa, gráficos e filtros
├── policecalls.csv # Arquivo de dados CSV
└── README.md # Documentação do projeto
```


## 📂 Formato do Arquivo CSV

O arquivo `policecalls.csv` deve ter o seguinte formato:

| date       | type               | lat      | lng      |
|------------|--------------------|----------|----------|
| 2023-01-01 | PROPERTY CRIMES    | -3.73784 | -38.5554 |
| 2023-01-01 | VIOLENT CRIMES     | -3.83914 | -38.5606 |

### Tradução de Tipos de Crimes

| Tipo Original         | Tradução                    |
|-----------------------|----------------------------|
| PROPERTY CRIMES       | Crimes contra a propriedade |
| VIOLENT CRIMES        | Crimes violentos           |
| DRUG VIOLATIONS       | Violações de drogas        |
| FRAUD                 | Fraude                     |
| BURGLARY              | Roubo                      |
| ASSAULT               | Agressão                  |
| HOMICIDE              | Homicídio                 |
| VANDALISM             | Vandalismo                |
| VEHICLE THEFT         | Roubo de veículo          |
| ARSON                 | Incêndio criminoso        |
| THEFT                 | Furto                     |

## 📋 Funcionalidades dos Filtros

- **Filtro de Ano**: Selecione um ano específico ou visualize todos os anos.
- **Filtro de Tipo de Crime**: Escolha um tipo específico ou visualize todos os tipos.

## 📊 Análise Gráfica

- Gráficos interativos que mostram a quantidade de crimes por data e tipo.
- Atualizações automáticas ao aplicar os filtros.

## 🌍 Mapa Interativo

- Destaca regiões com maior incidência de crimes.
- Responde dinamicamente aos filtros selecionados.



fonte [dados.fortaleza](https://dados.fortaleza.ce.gov.br/)


## 📄 Licença

Este projeto é de código aberto e pode ser usado livremente.


