const fileInput = document.getElementById('fileInput');
const canvas = document.getElementById('myChart');
const ctx = canvas.getContext('2d');

fileInput.addEventListener('change', handleFile);

function handleFile(e) {
  const file = e.target.files[0];
  if (file) {
      const reader = new FileReader();

      reader.onload = function (e) {
          const data = new Uint8Array(e.target.result);
          const workbook = XLSX.read(data, { type: 'array' });
          const firstSheetName = workbook.SheetNames[0];
          const worksheet = workbook.Sheets[firstSheetName];

          const jsonData = XLSX.utils.sheet_to_json(worksheet, { raw: true });

          const labels = Object.keys(jsonData[0]).slice(1); 

          labels.forEach(label => {
              const dataValues = jsonData.map(row => row[label]);

              const dataset = {
                  label: label,
                  data: dataValues,
                  backgroundColor: `rgba(${Math.random() * 255},${Math.random() * 255},${Math.random() * 255}, 0.2)`,
                  borderColor: `rgba(${Math.random() * 255},${Math.random() * 255},${Math.random() * 255}, 1)`,
                  borderWidth: 1,
              };

              const chartData = {
                  labels: jsonData.map(row => row.Year),
                  datasets: [dataset],
              };
              

              const canvas = document.createElement('canvas');
              document.body.appendChild(canvas);

              new Chart(canvas.getContext('2d'), {
                  type: 'bar',
                  data: chartData,
                  options: {
                      scales: {
                          x: {
                              stacked: true,
                          },
                          y: {
                              stacked: true,
                          },
                      },
                      plugins: {
                          title: {
                              display: true,
                              text: label,
                          },
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
                  },
              });
          });
      };

      reader.readAsArrayBuffer(file);
  }
}

fileInput.addEventListener('change', handleFile);

