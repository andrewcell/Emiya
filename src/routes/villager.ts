import { Request, Response, Router} from 'express';
import sqlite3, {Database} from 'sqlite3';
import {getDataPath} from '@shared/functions';
import {VillagerDatabase} from '@interfaces/VillagerDatabase';
import {validateReact} from '@shared/validation';
import crypto from 'crypto-js';
import {AES} from 'aes-js';
import {decrypt} from '../public/scripts/encryption';

const router = Router();
const key: string = ['.container', 'vimac', 'body', 'sec', 'wait', 'react', 'production.js'].toString();

router.use((req, res, next) => {
  res.locals.villagers = true;
  next();
});
// const sqlite = sqlite3.verbose()
// let db = new sqlite.Database(getDataPath('villagers.db'));
const villagerList: any[] = [];

const loadDb = () => {
  const db = VillagerDatabase;
  const data = db.getInstance().getAllVillager();
  for (const villager of data) {
    villagerList.push(villager)
  }
}

loadDb()

router.get(['/', '/:param'], (req: Request, res: Response) => {
  res.render('villagers/main', {data: villagerList, locale: req.cookies.locale});
});

/* router.get('/list', (req: Request, res: Response) => {
  res.render('villagers/list', {data: villagerList, locale: req.cookies.locale});
});
*/
router.get('/react/villagers', validateReact, ((req, res) => {
  //const key = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31];
  //const aesCtr = new aes.ModeOfOperation.ctr(key, new aes.Counter(3));
  const json = JSON.stringify(villagerList);
  const data = crypto.AES.encrypt(json, key).toString() as string;

  return res.json({code: 200, comment: 'success', data: data, locale: req.cookies.locale});
}));
router.get('/react/my/get', validateReact, (req, res) => {
  //const decrypted = decryptFromBase64(req.body.data);
  if (req.user) {

  } else {
    let result: string[] = [];
    if (req!.session!.myvillagers != null) {
      result = req!.session!.myvillagers;
    } else {
      req!.session!.myvillagers = [];
    }
    return res.json({code: 200, comment: 'success', data: crypto.AES.encrypt(JSON.stringify(result), key).toString()})
  }
});
router.post('/react/my/set', validateReact, (req, res) => {
  const body = JSON.parse(decrypt(req.body.data));
  const arr = (req!.session!.myvillagers) as string[];
  if (arr.includes(body.code)) return res.json({code: 'villager01', comment: res.__('ts.villagers.my.alreadyexists')})
  arr.push(body.code);
  req!.session!.myvillagers = arr;
  return res.json({code: 'villager00', comment: 'success'})
  /*arr.forEach((value, index) => {

  })*/
});
export default router;
