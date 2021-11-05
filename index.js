const express = require("express");
const https = require("https");


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

    console.log(url_sh);

    const heroRequest = https.get(url_sh, (response) => {
        if(response.statusCode === 200){
            let data = '';
            response.on('data', chunk =>{
                data += chunk;
            });
            response.on('end', () => {
                data = JSON.parse(data);
                console.log(data);
            if(data.response === "error"){
                res.render(__dirname + "/public/pages/error.html");
            }else{
                
            }
        }).on("error", (err) =>{
            res.render(__dirname + "/public/pages/error.html");
        });
        }else{
            res.render(__dirname + "/public/pages/error.html");
        }
    }).end();

});

app.listen(3000, () => {
    console.log("Server listening in port: 3000");
});