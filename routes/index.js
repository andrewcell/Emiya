var express = require('express');
var router = express.Router();
const path = require('path');

const downloadKey = {};

router.get('/', function(req, res, next) {
  const mibo = JSON.parse(require('fs').readFileSync("miibo.json")).data;

  mibo.forEach(function(ambo) {
    if (ambo.number !== -1) {
      const randomKey = makeId(6);
      downloadKey[randomKey] = {file: ambo.file, name: ambo.number + " - " + ambo.name + " - " + ambo.name_kor};
      ambo.file = randomKey;
    }
  });
  res.render('index', { title: 'NTAG215', miibo: mibo });
});

router.get("/data/:key", function(req, res) {
  const key = req.params.key;
  if (!(key in downloadKey)) {
    return res.json({"メッセージ": "要求の形式が正しくありません。"});
  } else {
    const realFile = downloadKey[key];
    save(realFile.name);
    res.download(path.resolve("data/Cards/" + realFile.file), realFile.name + ".bin")
  }
});

function save(name) {
  const fs = require('fs');
  if (!fs.existsSync("log.json")) {
    fs.writeFileSync("log.json", "{}")
  }
  var log = JSON.parse(fs.readFileSync("log.json"));
  log[name] = (name in log) ? log[name]++ : 1;
  fs.writeFileSync('log.json', JSON.stringify(log))
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
