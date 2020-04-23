const express = require('express');
const router = express.Router();
const path = require('path');
const fs = require("fs");

const downloadKey = {};

const mibo = JSON.parse(fs.readFileSync("miibo.json")).data;
const welcome = JSON.parse(fs.readFileSync("wel.json")).data;

mibo.forEach(function(ambo) {
  if (ambo.number !== -1) {
    const randomKey = makeId(15);
    downloadKey[randomKey] = {file: ambo.file, name: ambo.number + " - " + ambo.name + " - " + ambo.name_kor};
    ambo.file = randomKey;
  }
});

welcome.forEach(function(ambo) {
  const randomKey = makeId(15);
  downloadKey[randomKey] = {file: ambo.file, name: ambo.number + " - " + ambo.name + " - " + ambo.name_kor}
  ambo.file = randomKey
});

router.get('/', function(req, res, next) {
  res.render('index', { title: 'NTAG215', miibo: mibo, welcome: welcome });
});

router.get(['/category', '/category/:id'], function(req, res, next) {
  const fs = require("fs");
  if (typeof req.params.id !== "undefined" && req.params.id === "welcome") {
    res.render("category", { title: "NTAG215", miibo: welcome, category: "welcome" });
  } else {
    var id = parseInt(req.params.id);
    if (req.params.id === undefined) id = 1;

    var newData = [];
    mibo.forEach(function (ambo, index, object) {
      if (ambo.number !== -1) {
        if (ambo.number >= ((id - 1) * 100) + 1 && ambo.number <= (100 * (id))) {
          newData.push(ambo)
        } else {
          //object.splice(index, 1)
        }
      }
    });
    res.render("category", { title: "NTAG215", miibo: newData, category: id });
  }

});

router.get("/data/:key", function(req, res) {
  const ip = req.headers['x-forwarded-for'] ||  req.connection.remoteAddress;
  const key = req.params.key;
  if (!(key in downloadKey)) {
    return res.render("error", {notfound: true});
  } else {
    const realFile = downloadKey[key];
    save(realFile.name, ip, key);
    if (realFile.file === "no") {
      res.render("error", {notyet: true});
    } else {
      res.download(path.resolve("data/Cards/" + realFile.file), realFile.name + ".bin")

    }
    /*if (key.length === 7) {
      res.download(path.resolve("data/Cards/Welcome amiibo Series/" + realFile.file), realFile.name + ".bin")
    }*/

  }
});

router.get("/menu", function(req, res) {
  const log = JSON.parse(fs.readFileSync("log.json"));
  const sorted = Object.keys(log).sort(function(a,b){return log[a]-log[b]});
  const array = [];
  sorted.forEach(function(key, index){
    const data = key.split("-");
    let number = TryParseInt(data[0], data[0]);
    let image = "cards";
    if (typeof number === "string") {
      number = number.trim();
      image = "welcome"
    }
    const name = data[1].trim();
    const name_kor = data[2].trim();
    array.push({image: image, number: number, name: name, name_kor: name_kor, count: log[key]})
  });
  res.render("ranking", {data: array.reverse()})
});

/**
 * @return {number}
 */
function TryParseInt(str,defaultValue) {
  var retValue = defaultValue;
  if(str !== null) {
    if(str.length > 0) {
      if (!isNaN(str)) {
        retValue = parseInt(str);
      }
    }
  }
  return retValue;
}

function save(name, ip, key) {
  if (!fs.existsSync("log.json")) {
    fs.writeFileSync("log.json", "{}")
  }
  if (!fs.existsSync("logArray.json")) {
    fs.writeFileSync("logArray.json", '{"data": []}')
  }
  var log = JSON.parse(fs.readFileSync("log.json"));
  var logArray = JSON.parse(fs.readFileSync("logArray.json"));
  var count = 1;
  if (name in log) {
    count = count + log[name]
  }
  var arr = name.split("-");
  logArray.data.push({number: arr[0].toString().trim(), name: arr[1].trim(), name_kor: arr[2].trim(), now: new Date().toLocaleString(), ip: ip, key: key});
  log[name] = count;
  fs.writeFileSync('log.json', JSON.stringify(log, null ,4))
  fs.writeFileSync('logArray.json', JSON.stringify(logArray, null ,4))
}

function makeId(length) {
  var result           = '';
  var characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  var charactersLength = characters.length;
  for ( var i = 0; i < length; i++ ) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
}


module.exports = router;
