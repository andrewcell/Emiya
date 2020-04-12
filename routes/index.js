var express = require('express');
var router = express.Router();
const path = require('path');

const downloadKey = {};

router.get('/', function(req, res, next) {
  const fs = require("fs");
  const mibo = JSON.parse(require('fs').readFileSync("miibo.json")).data;

  mibo.forEach(function(ambo) {
    if (ambo.number !== -1) {
      const randomKey = makeId(6);
      downloadKey[randomKey] = {file: ambo.file, name: ambo.number + " - " + ambo.name + " - " + ambo.name_kor};
      ambo.file = randomKey;
    }
  });

  const welcome = JSON.parse(fs.readFileSync("wel.json")).data;
  welcome.forEach(function(ambo) {
    const randomKey = makeId(7)
    downloadKey[randomKey] = {file: ambo.file, name: ambo.number + " - " + ambo.name + " - " + ambo.name_kor}
    ambo.file = randomKey
  });
  res.render('index', { title: 'NTAG215', miibo: mibo, welcome: welcome });
});

router.get(['/category', '/category/:id'], function(req, res, next) {
  var id = parseInt(req.params.id);
  if (req.params.id === undefined) id = 1;
  const mibo = JSON.parse(require('fs').readFileSync("miibo.json")).data;
  var newData = []
  mibo.forEach(function(ambo, index, object) {
    if (ambo.number !== -1) {
      if (ambo.number >= ((id-1)*100)+1 && ambo.number <= (100 * (id))) {
        const randomKey = makeId(6);
        downloadKey[randomKey] = {file: ambo.file, name: ambo.number + " - " + ambo.name + " - " + ambo.name_kor};
        ambo.file = randomKey;
        newData.push(ambo)
      } else {
        //object.splice(index, 1)
      }
    }
  });

  res.render("category", { title: "NTAG215", miibo: newData, category: id });
});

router.get("/data/:key", function(req, res) {
  const ip = req.headers['x-forwarded-for'] ||  req.connection.remoteAddress;
  const key = req.params.key;
  if (!(key in downloadKey)) {
    return res.json({"メッセージ": "要求の形式が正しくありません。"});
  } else {
    const realFile = downloadKey[key];
    save(realFile.name, ip);
    /*if (key.length === 7) {
      res.download(path.resolve("data/Cards/Welcome amiibo Series/" + realFile.file), realFile.name + ".bin")
    }*/
    res.download(path.resolve("data/Cards/" + realFile.file), realFile.name + ".bin")
  }
});

function save(name, ip) {
  const fs = require('fs');
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
  logArray.data.push({number: arr[0].toString().trim(), name: arr[1].trim(), name_kor: arr[2].trim(), now: new Date().toLocaleString(), ip: ip});
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
