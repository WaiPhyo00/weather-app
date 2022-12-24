const express = require("express");
const bodyParser = require("body-parser");
const https = require("https");

const app = express();

app.use(bodyParser.urlencoded({extended:true}));

app.get("/", (req, res) => {
    res.sendFile(__dirname + "/index.html");
});

app.post("/", (req, res) => {
    //latitude: 16.871311, longitude: 96.199379,
    const lat = req.body.latitude;
    const lon = req.body.longitude;
    const apiKey = "apiKey";
    const unit = "metric";
    const url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=${unit}`;
    https.get(url, (response) => {
        console.log(response.statusCode);
    
        response.on("data", (data) => {
            const weatherData = JSON.parse(data);
            const cityName = weatherData.name;
            const temp = weatherData.main.temp;
            const weatherDescription = weatherData.weather[0].description;
            const icon = weatherData.weather[0].icon;
            const imageurl = `http://openweathermap.org/img/wn/${icon}@2x.png`;
            const cityID = weatherData.id;

            res.send(
                `<div style="text-align:center;margin: auto;">
                    <h1 style="margin: 100px;">Current Weather Forcast</h1>
                    <div id="openweathermap-widget-11" style="display: flex;justify-content: center;align-items: center;margin: 100px;"></div>
                    <h3>${cityName} is currently ${weatherDescription} and the temperature is ${temp} degrees Celcius.</h3>
                    <img src=${imageurl}>
                    
                    <script src='//openweathermap.org/themes/openweathermap/assets/vendor/owm/js/d3.min.js'></script>
                    <script>window.myWidgetParam ? window.myWidgetParam : window.myWidgetParam = [];  window.myWidgetParam.push({id: 11,cityid: ${cityID},appid: 'afd858c8860c692b4c817aee4447a205',units: 'metric',containerid: 'openweathermap-widget-11',  });  (function() {var script = document.createElement('script');script.async = true;script.charset = "utf-8";script.src = "//openweathermap.org/themes/openweathermap/assets/vendor/owm/js/weather-widget-generator.js";var s = document.getElementsByTagName('script')[0];s.parentNode.insertBefore(script, s);  })();</script>
                </div>`
            );
        });
    });
})

app.listen(3000, () => {
    console.log("Server is running on port 3000.");
});
