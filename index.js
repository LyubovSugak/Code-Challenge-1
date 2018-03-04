const fs = require('fs');
var util = require('util');
// var readdir = util.promisify(fs.readdir);
// var stat = util.promisify(fs.stat);

const express = require('express');
const app = express();
const server = require('http').Server(app);
const bodyParser = require('body-parser');
const compression = require('compression');
const secret = require('./secrets.json').sessSecret;

app.use(bodyParser.urlencoded({
  extended: false
}));
app.use(bodyParser.json());
app.use(compression());
app.use(express.static('public'));
app.use('/static', express.static(__dirname + '/public'));

if (process.env.NODE_ENV != 'production') {
    app.use(
        '/bundle.js',
        require('http-proxy-middleware')({
            target: 'http://localhost:8081/'
        })
    );
} else {
    app.use('/bundle.js', (req, res) => res.sendFile(`${__dirname}/bundle.js`));
}

app.get('/', function(req, res) {
    res.sendFile(__dirname + '/index.html');
})

server.listen(8080, function() {
    console.log("I'm listening.");
});

var csv = fs.readFileSync('./report.csv')
var csvNew = csv.toString("utf8").replace(/\r\n/g, ',').split(',')
let titleArray = csvNew.splice(0, 4);

let allDataArray = [];
let singleItem = {};
let size = 4;
for (var i = 0; i < (csvNew.length - 1) / 4; i++) {
    var temp = csvNew.slice((i*size), (i*size) + size)
    for (var y = 0; y < titleArray.length; y++) {
        singleItem[titleArray[y]] = temp[y]
    }
    allDataArray.push(singleItem)  
}
fs.writeFile('file.json', JSON.stringify(allDataArray, null, 4), (err) => {
    if (err) {
        console.log(err);
        process.exit(-1);
    } else {
        console.log('aaaa JSON')
    }
})
 



// <--w W-->
