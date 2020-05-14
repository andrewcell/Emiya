import { Request, Response, Router} from 'express';
import sqlite3, {Database} from 'sqlite3';
import {getDataPath} from '@shared/functions';
import {VillagerDatabase} from '@interfaces/VillagerDatabase';
import {validateReact} from '@shared/validation';
import aes, {utils} from 'aes-js';
import toBytes = utils.utf8.toBytes;
import fromBytes = utils.hex.fromBytes;

const router = Router();

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
  const key = [ 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16 ];
  //const key = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31];
  const aesCtr = new aes.ModeOfOperation.ctr(key, new aes.Counter(3));
  const data = Buffer.from(fromBytes(aesCtr.encrypt(toBytes(JSON.stringify(villagerList))))).toString('base64');

  return res.json({code: 200, comment: 'success', data: data, locale: req.cookies.locale});
}));

export default router;
