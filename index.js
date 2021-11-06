const express = require("express");
const https = require("https");
const fs = require("fs");
var bodyParser = require('body-parser');
const request = require("request");
var jsdom = require("jsdom");
const { JSDOM } = jsdom;
const { window } = new JSDOM();
const { document } = (new JSDOM('')).window;
global.document = document;

var $ = jQuery = require('jquery')(window);


const app = express();

app.use(express.static("public"));
app.use("/pages",express.static("public"));
app.use(express.json());
app.use(express.urlencoded({ extended:true }));
app.engine('html', require('ejs').renderFile);
app.set('view engine', 'html');
app.set('views', __dirname);

app.get('/', (req,res) => {
    res.sendFile(__dirname + "/public/pages/main.html");
});

app.post('/', (req,res) => {
    const shName = req.body.shName;

    console.log(shName);

    const apiKey = "4854537781247050";
    const url = "https://superheroapi.com/api.php/" + apiKey + "/search/";
    const url_sh = url + shName;


    const heroRequest = https.get(url_sh, (response) => {
        if(response.statusCode === 200){
            let info = '';
            response.on('data', chunk =>{
                info += chunk;
            });
            response.on('end', () => {
                info = JSON.parse(info);
            if(info.response === "error"){
                res.render(__dirname + "/public/pages/error.html");
            }else{
                fs.readFile('public/pages/card.html', 'utf8', (err, data) =>{
                    const dom = new jsdom.JSDOM(data);
                    dom.window.document.querySelector('#result-container').innerHTML = `<div id="heroResult">
                    <div class="photostats">
                        <div class="image" id="image">
                            <img  src="${info.results[0].image.url}">
                        </div>
                        <div class="detail-item shfont">
        
                            <!-- Powerstats bars -->
                            <span class="anchor" id="powerstats"></span>
                            <h1 id="powerstats">Powerstats</h1>
                            <div id="stats-container">
                                <div id="stat-names">
                                    <span>Combat...${info.results[0].powerstats.combat} </span>
                                    <span>Durability...${info.results[0].powerstats.durability} </span>
                                    <span>Intelligence...${info.results[0].powerstats.intelligence} </span>
                                    <span>Power...${info.results[0].powerstats.power} </span>
                                    <span>Speed...${info.results[0].powerstats.speed} </span>
                                    <span>Strength...${info.results[0].powerstats.strength} </span>
                                </div>
        
                                <div id="stat-bars">
                                    <div class="bar-container">
                                        <div class="bar combat" style="width: ${info.results[0].powerstats.combat}%;"></div>
                                    </div>
                                    <div class="bar-container">
                                        <div class="bar durability" style="width: ${info.results[0].powerstats.durability}%;"></div>
                                    </div>
                                    <div class="bar-container">
                                        <div class="bar intelligence" style="width: ${info.results[0].powerstats.intelligence}%;"></div>
                                    </div>
                                    <div class="bar-container">
                                        <div class="bar power" style="width: ${info.results[0].powerstats.power}%;"></div>
                                    </div>
                                    <div class="bar-container">
                                        <div class="bar speed" style="width: ${info.results[0].powerstats.speed}%;"></div>
                                    </div>
                                    <div class="bar-container">
                                        <div class="bar strength" style="width: ${info.results[0].powerstats.strength}%;"></div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="info shfont" style="color: white;">
                        <h1 class="hname">${info.results[0].name}</h1>
                        <p>Hero ID: ${info.results[0].id}</p>
                        <h2>Biography</h2>
                        <p>Full Name: ${info.results[0].biography["full-name"]}</p>
                        <p>Place of birth: ${info.results[0].biography["place-of-birth"]}</p>
                        <h3>Appearance</h3>
                        <p>Gender: ${info.results[0].appearance.gender}</p>
                        <p>Race: ${info.results[0].appearance.race}</p>
                        <p>Height: ${info.results[0].appearance.height}</p>
                        <p>Weight: ${info.results[0].appearance.weight}</p>
                        <p>Eye Color: ${info.results[0].appearance["eye-color"]}</p>
                        <p>Hair Color: ${info.results[0].appearance["hair-color"]}</p>
                        <h4>Other Information</h4>
                        <p>Aliases: ${info.results[0].biography.aliases}</p>
                        <p>Group Affiliation: ${info.results[0].connections["group-affiliation"]}</p>
        
                    </div>
        
                </div>`;
        
                    fs.writeFile('public/pages/card.html', dom.serialize(), err => {
                        res.render(__dirname + "/public/pages/card.html");
                    });
                });  
            }
        }).on("error", (err) =>{
            res.render(__dirname + "/public/pages/error.html");
        });
        }else{
            res.render(__dirname + "/public/pages/error.html");
        }
    }).end();
});

app.get('/navigate.html', function(req,res){
     console.log(req.query.id);
});


app.listen(3000, () => {
    console.log("Server listening in port: 3000");
});