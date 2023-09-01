const fileInput = document.getElementById('fileInput');
const tableContainer = document.getElementById('tableContainer');
const chartContainer = document.getElementById('chartContainer');
let chartInstance;

fileInput.addEventListener('change', handleFile);

function handleFile(e) {
  const file = e.target.files[0];
  
  if (!file) {
      return;
  }

  const reader = new FileReader();

  reader.onload = function (e) {
      const data = new Uint8Array(e.target.result);
      const workbook = XLSX.read(data, { type: 'array' });
      const firstSheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[firstSheetName];

      const jsonData = XLSX.utils.sheet_to_json(worksheet, { raw: true });

      const table = document.createElement('table');
      table.className = 'data-table';

      // Create table header row
      const headerRow = document.createElement('tr');
      Object.keys(jsonData[0]).forEach(header => {
          const th = document.createElement('th');
          th.textContent = header;
          headerRow.appendChild(th);
      });
      table.appendChild(headerRow);

      // Create table data rows
      jsonData.forEach(rowData => {
          const dataRow = document.createElement('tr');
          Object.values(rowData).forEach(value => {
              const td = document.createElement('td');
              td.textContent = value;
              dataRow.appendChild(td);
          });
          table.appendChild(dataRow);
      });

      // Clear previous content and append the new table
      tableContainer.innerHTML = '';
      tableContainer.appendChild(table);

      const numericLabels = Object.keys(jsonData[0]).filter(label => {
          const firstValue = jsonData[0][label];
          return label !== 'Year' && !isNaN(firstValue) && typeof firstValue === 'number';
      });

      const chartData = {
          labels: jsonData.map(row => row.Year),
          datasets: numericLabels.map(label => ({
              label: label,
              data: jsonData.map(row => row[label]),
              backgroundColor: `rgba(${Math.random() * 255},${Math.random() * 255},${Math.random() * 255}, 0.2)`,
              borderColor: `rgba(${Math.random() * 255},${Math.random() * 255},${Math.random() * 255}, 1)`,
              borderWidth: 1,
          })),
      };

      if (chartInstance) {
          chartInstance.destroy(); // Clear previous chart if exists
      }

      const chartOptions = {
          scales: {
              x: {
                  stacked: false,
                  title: {
                      display: true,
                      text: 'Year',
                  },
              },
              y: {
                  stacked: false,
                  title: {
                      display: true,
                      text: 'Numeric Values',
                  },
              },
          },
          plugins: {
              legend: {
                  display: true,
                  position: 'top',
              },
              datalabels: {
                  align: 'top',
                  offset: 4,
              },
          },
          responsive: true,
      };

      // Create a new canvas for the chart
      const chartCanvas = document.createElement('canvas');
      if (tableContainer) {
          tableContainer.appendChild(chartCanvas);

          // Get 2d context of the chart canvas
          const ctx = chartCanvas.getContext('2d');

          // Create the new chart
          chartInstance = new Chart(ctx, {
              type: 'bar', 
              data: chartData,
              options: chartOptions,
          });
      }
  };

  reader.readAsArrayBuffer(file);
}
