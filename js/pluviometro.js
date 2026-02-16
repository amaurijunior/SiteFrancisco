// Dashboard de Pluviômetro - Módulo Principal
// Implementação completa das Tarefas 2-7

// Configuração
const CONFIG = {
  csvPath: 'data/pluviometro.csv',
  dateFormat: 'YYYY-MM-DD'
};

// Estado global
let globalData = null;
let currentChart = null;
let currentPeriod = 30;
let comparisonMode = false;

// ===== INICIALIZAÇÃO =====
document.addEventListener('DOMContentLoaded', async function() {
  setupEventListeners();
  await loadData();
  renderChart(currentPeriod);
  updateStats(currentPeriod);
});

// ===== TAREFA 2.0: FETCH E PARSING DE CSV =====

async function loadData() {
  // Verificar cache em memória
  if (globalData) {
    console.log('Using cached data');
    return globalData;
  }

  showLoading(true);

  try {
    const csvText = await fetchCSVData();
    globalData = parseCSV(csvText);
    hideError();
    console.log(`Loaded ${globalData.length} entries from CSV`);
  } catch (error) {
    console.error('Error loading CSV:', error);
    showError();
    globalData = MOCK_DATA;
    console.log(`Fallback to MOCK_DATA: ${globalData.length} entries`);
  } finally {
    showLoading(false);
  }

  return globalData;
}

async function fetchCSVData() {
  const response = await fetch(CONFIG.csvPath);

  if (!response.ok) {
    throw new Error(`HTTP ${response.status}: ${response.statusText}`);
  }

  return await response.text();
}

function parseCSV(csvText) {
  const lines = csvText.trim().split('\n');

  // Remover cabeçalho
  const header = lines.shift();

  return lines
    .map((line, index) => {
      try {
        // Parser simples (para CSV sem vírgulas em campos)
        const [dateStr, precipStr, ...notesParts] = line.split(',');
        const notes = notesParts.join(',').trim().replace(/^"|"$/g, '');

        // Parse data
        const date = parseDate(dateStr.trim());
        if (!date) {
          console.warn(`Linha ${index + 2}: data inválida "${dateStr.trim()}" (esperado YYYY-MM-DD)`);
          return null;
        }

        // Parse precipitação
        const precipitation = parseFloat(precipStr.trim());
        if (isNaN(precipitation) || precipitation < 0) {
          console.warn(`Linha ${index + 2}: precipitação inválida "${precipStr.trim()}"`);
          return null;
        }

        return {
          date,
          precipitation,
          notes
        };
      } catch (error) {
        console.warn(`Linha ${index + 2}: erro ao parsear`, error);
        return null;
      }
    })
    .filter(item => item !== null)
    .sort((a, b) => a.date - b.date);
}

function parseDate(dateStr) {
  // Aceitar APENAS formato YYYY-MM-DD
  const pattern = /^(\d{4})-(\d{2})-(\d{2})$/;
  const match = dateStr.match(pattern);

  if (!match) {
    return null;
  }

  const [_, year, month, day] = match;
  const date = new Date(parseInt(year), parseInt(month) - 1, parseInt(day));

  // Validar se data é válida
  if (
    date.getFullYear() !== parseInt(year) ||
    date.getMonth() !== parseInt(month) - 1 ||
    date.getDate() !== parseInt(day)
  ) {
    return null;
  }

  return date;
}

// ===== TAREFA 3.0: VISUALIZAÇÃO BASE COM CHART.JS =====

function renderChart(period) {
  const filteredData = filterDataByPeriod(period);

  if (currentChart) {
    currentChart.destroy();
  }

  const ctx = document.getElementById('precipitationChart').getContext('2d');

  currentChart = new Chart(ctx, {
    type: 'bar',
    data: {
      labels: filteredData.map(item => formatDate(item.date)),
      datasets: [{
        label: 'Precipitação (mm)',
        data: filteredData.map(item => item.precipitation),
        backgroundColor: 'rgba(87, 108, 188, 0.6)',
        borderColor: 'rgba(87, 108, 188, 1)',
        borderWidth: 1
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { display: true },
        tooltip: {
          callbacks: {
            afterLabel: function(context) {
              const index = context.dataIndex;
              const notes = filteredData[index].notes;
              return notes ? `Obs: ${notes}` : '';
            }
          }
        }
      },
      scales: {
        y: {
          beginAtZero: true,
          title: { display: true, text: 'Precipitação (mm)' }
        },
        x: {
          title: { display: true, text: 'Data' }
        }
      }
    }
  });

  updateAccessibleTable(filteredData);
}

function calculateStats(filteredData) {
  if (!filteredData || filteredData.length === 0) {
    return {
      total: 0,
      average: 0,
      max: { value: 0, date: null }
    };
  }

  const total = filteredData.reduce((sum, item) => sum + item.precipitation, 0);
  const average = total / filteredData.length;
  const maxItem = filteredData.reduce((max, item) =>
    item.precipitation > max.precipitation ? item : max,
    { precipitation: 0, date: null }
  );

  return {
    total,
    average,
    max: { value: maxItem.precipitation, date: maxItem.date }
  };
}

function updateStats(period) {
  const filteredData = filterDataByPeriod(period);
  const stats = calculateStats(filteredData);

  document.getElementById('stat-total').textContent = stats.total.toFixed(1);
  document.getElementById('stat-average').textContent = stats.average.toFixed(2);
  document.getElementById('stat-max').textContent = stats.max.value.toFixed(1);
  document.getElementById('stat-max-date').textContent = stats.max.date ? formatDate(stats.max.date) : '--';
}

// ===== TAREFA 4.0: FILTROS POR PERÍODO =====

function filterDataByPeriod(period) {
  if (!globalData) return [];

  if (period === 'all') {
    return globalData;
  }

  const days = parseInt(period);
  const cutoffDate = new Date();
  cutoffDate.setDate(cutoffDate.getDate() - days);

  return globalData.filter(item => item.date >= cutoffDate);
}

// ===== TAREFA 5.0: MODO DE COMPARAÇÃO =====

function filterDataByMonthYear(month, year) {
  if (!globalData) return [];

  return globalData.filter(item =>
    item.date.getMonth() === month && item.date.getFullYear() === year
  );
}

function renderComparisonChart(period1Data, period2Data, label1, label2) {
  if (currentChart) {
    currentChart.destroy();
  }

  const ctx = document.getElementById('precipitationChart').getContext('2d');

  // Criar array de dias do mês (1-31)
  const maxDays = Math.max(
    ...period1Data.map(item => item.date.getDate()),
    ...period2Data.map(item => item.date.getDate())
  );

  const labels = Array.from({ length: maxDays }, (_, i) => i + 1);

  // Mapear dados por dia do mês
  const period1Map = {};
  period1Data.forEach(item => {
    period1Map[item.date.getDate()] = item.precipitation;
  });

  const period2Map = {};
  period2Data.forEach(item => {
    period2Map[item.date.getDate()] = item.precipitation;
  });

  currentChart = new Chart(ctx, {
    type: 'line',
    data: {
      labels: labels,
      datasets: [
        {
          label: label1,
          data: labels.map(day => period1Map[day] || null),
          borderColor: 'rgba(87, 108, 188, 1)',
          backgroundColor: 'rgba(87, 108, 188, 0.2)',
          fill: false,
          spanGaps: true
        },
        {
          label: label2,
          data: labels.map(day => period2Map[day] || null),
          borderColor: 'rgba(113, 138, 240, 1)',
          backgroundColor: 'rgba(113, 138, 240, 0.2)',
          fill: false,
          spanGaps: true
        }
      ]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { display: true }
      },
      scales: {
        y: {
          beginAtZero: true,
          title: { display: true, text: 'Precipitação (mm)' }
        },
        x: {
          title: { display: true, text: 'Dia do Mês' }
        }
      }
    }
  });
}

function populateMonthYearSelectors() {
  // Extrair meses/anos únicos dos dados
  const monthsYears = new Set();
  globalData.forEach(item => {
    const key = `${item.date.getFullYear()}-${String(item.date.getMonth() + 1).padStart(2, '0')}`;
    monthsYears.add(key);
  });

  const options = Array.from(monthsYears).sort().reverse().map(key => {
    const [year, month] = key.split('-');
    const monthName = new Date(year, month - 1).toLocaleString('pt-BR', { month: 'long', year: 'numeric' });
    return `<option value="${key}">${monthName}</option>`;
  }).join('');

  document.getElementById('period1').innerHTML = options;
  document.getElementById('period2').innerHTML = options;
}

function updateComparison() {
  const period1Key = document.getElementById('period1').value;
  const period2Key = document.getElementById('period2').value;

  if (!period1Key || !period2Key) return;

  const [year1, month1] = period1Key.split('-').map(Number);
  const [year2, month2] = period2Key.split('-').map(Number);

  const period1Data = filterDataByMonthYear(month1 - 1, year1);
  const period2Data = filterDataByMonthYear(month2 - 1, year2);

  const label1 = new Date(year1, month1 - 1).toLocaleString('pt-BR', { month: 'long', year: 'numeric' });
  const label2 = new Date(year2, month2 - 1).toLocaleString('pt-BR', { month: 'long', year: 'numeric' });

  renderComparisonChart(period1Data, period2Data, label1, label2);

  // Atualizar estatísticas com dois períodos
  const stats1 = calculateStats(period1Data);
  const stats2 = calculateStats(period2Data);

  document.getElementById('stat-total').textContent = `${stats1.total.toFixed(1)} / ${stats2.total.toFixed(1)}`;
  document.getElementById('stat-average').textContent = `${stats1.average.toFixed(2)} / ${stats2.average.toFixed(2)}`;
  document.getElementById('stat-max').textContent = `${stats1.max.value.toFixed(1)} / ${stats2.max.value.toFixed(1)}`;
  document.getElementById('stat-max-date').textContent = `${label1.split(' ')[0]} / ${label2.split(' ')[0]}`;
}

// ===== EVENT LISTENERS =====

function setupEventListeners() {
  // Filtros de período
  document.querySelectorAll('.filter-btn').forEach(btn => {
    btn.addEventListener('click', function() {
      document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
      this.classList.add('active');

      currentPeriod = this.dataset.period;
      renderChart(currentPeriod);
      updateStats(currentPeriod);
    });
  });

  // Toggle modo comparação
  document.getElementById('comparisonToggle').addEventListener('change', function() {
    comparisonMode = this.checked;
    const selectors = document.getElementById('comparisonSelectors');

    if (comparisonMode) {
      selectors.classList.remove('d-none');
      populateMonthYearSelectors();
      updateComparison();
    } else {
      selectors.classList.add('d-none');
      renderChart(currentPeriod);
      updateStats(currentPeriod);
    }
  });

  // Seletores de comparação
  document.getElementById('period1').addEventListener('change', updateComparison);
  document.getElementById('period2').addEventListener('change', updateComparison);
}

// ===== UI HELPERS =====

function showLoading(show) {
  const loader = document.getElementById('loading');
  loader.classList.toggle('d-none', !show);
}

function showError() {
  const errorMsg = document.getElementById('error-message');
  errorMsg.classList.remove('d-none');
}

function hideError() {
  const errorMsg = document.getElementById('error-message');
  errorMsg.classList.add('d-none');
}

function formatDate(date) {
  return date.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric' });
}

function updateAccessibleTable(data) {
  const tbody = document.getElementById('data-table-body');
  tbody.innerHTML = data.map(item => `
    <tr>
      <td>${formatDate(item.date)}</td>
      <td>${item.precipitation.toFixed(1)}</td>
      <td>${item.notes}</td>
    </tr>
  `).join('');
}
