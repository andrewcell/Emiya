import { Request, Response, Router} from 'express';
import sqlite3, {Database} from 'sqlite3';
import {getDataPath} from '@shared/functions';
import {VillagerDatabase} from '@interfaces/VillagerDatabase';
import {validateReact} from '@shared/validation';


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
  return res.json({code: 200, comment: 'success', data: villagerList, locale: req.cookies.locale});
}));

export default router;
