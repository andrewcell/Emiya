import { Request, Response, Router} from 'express';
import sqlite3, {Database} from 'sqlite3';
import {getDataPath} from '@shared/functions';
import {VillagerDatabase} from '@interfaces/VillagerDatabase';
const router = Router();

// const sqlite = sqlite3.verbose()
// let db = new sqlite.Database(getDataPath('villagers.db'));

router.get('/', (req: Request, res: Response) => {
  const db = VillagerDatabase;
  const data = db.getInstance().getAllVillager(req.cookies.locale);
  const array = [];
  for (const villager of data) {
    array.push(villager)
  }
  res.render('villagers/list', {data: array});
});

export default router;
