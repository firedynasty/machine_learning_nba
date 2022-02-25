
// Step 1: Load the csv file
test_data = []

d3.csv('static/data/nyc_weather_5_years.csv')
  .then(makeChart);

function makeChart(weather) {
  console.log(weather)
  test_data = weather
  
  var date = weather.map(function(d){return d.DATE;});
  var precipitation = weather.map(function(d){return d.PRCP;});
  var snow = weather.map(function(d){return d.SNOW;});
  var avgTemp = weather.map(function(d){return d.TAVG;});


var chart = new Chart('lineChart', {
  type: 'line',
  data: {
    labels: date,
    datasets:[{
      borderColor: "#3232FF",
      data: precipitation,
      label: "Precipitation levels (in inches)"
    },
    {
      borderColor: "#808080",
      data: snow,
      label: "Snow Levels (in inches)"
    },
    {
      borderColor: "#C81414",
      data: avgTemp,
      label: "Average Temperature (in Fahrenheit)"
    }
    ]
  },
  options: {
    responsive: true,
    maintainAspectRatio:true,
    title: {
      display: true,
      text: 'New York Temperature From the past 5 years'
    }
  }
});


}
