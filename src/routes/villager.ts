import { Request, Response, Router} from 'express';
import sqlite3, {Database} from 'sqlite3';
import {getDataPath} from '@shared/functions';
import {VillagerDatabase} from '@interfaces/VillagerDatabase';
import {validateReact} from '@shared/validation';
import crypto from 'crypto-js';
import {AES} from 'aes-js';
import {decrypt, encrypt} from '@shared/Encryption';
import MyVillagers, {resize} from '@interfaces/MyVillagersDatabase';
import {UserDocument} from '@shared/User';

const router = Router();
router.use((req, res, next) => {
  res.locals.villagers = true;
  next();
});

const villagerList: any[] = [];

const loadDb = () => {
  const db = VillagerDatabase;
  const data = db.getInstance().getAllVillager();
  for (const villager of data) {
    villagerList.push(villager)
  }
}

const getLengthWithoutNull = (arr: any[]): number => {
  let count = 0
  for (const item of arr) {
    if (item != null) {
      count++;
    }
  }
  return count;
}

const pushToNull = (arr: string[], value: string): string[] => {
  const array = arr;
  let changed = false;
  arr.forEach((value1, index) => {
    if (value1 == null && !changed) {
      array[index] = value;
      changed = true;
    }
  });
  return arr;
}

// const availableCodes = ["dog18","dog17","dog16","dog10","dog09","dog07","dog05","dog08","dog14","dog01","dog00","dog02","dog03","dog04","dog06","dog15","flg11","flg18","flg19","flg15","flg17","flg09","flg05","flg00","flg16","flg06","flg13","flg01","flg02","flg04","flg10","flg03","flg07","flg12","ant09","ant06","ant08","ant00","ant02","ant03","ant01","gor10","gor05","gor04","gor09","gor08","gor00","gor01","gor07","gor02","cat21","cat02","cat20","cat15","cat01","cat04","cat07","cat11","cat14","cat16","cat17","cat10","cat13","cat09","cat03","cat05","cat12","cat18","cat23","cat19","cat00","cat06","cat08","wol08","wol12","wol10","wol09","wol04","wol01","wol02","wol06","wol03","wol05","wol00","squ13","squ17","squ02","squ14","squ18","squ16","squ10","squ15","squ01","squ03","squ09","squ00","squ04","squ05","squ08","squ06","squ07","squ11","chn13","chn12","chn10","chn11","chn00","chn09","chn05","chn01","chn02","pbr08","pbr03","pbr09","pbr06","pbr02","pbr07","pbr00","pbr05","pbr01","pig14","pig16","pig09","pig10","pig17","pig15","pig08","pig13","pig01","pig11","pig00","pig02","pig04","pig03","pig05","hrs07","hrs13","hrs11","hrs12","hrs16","hrs08","hrs09","hrs05","hrs01","hrs00","hrs04","hrs02","hrs06","hrs03","hrs10","ocp02","ocp01","ocp00","der05","der08","der02","der06","der07","der09","der03","der00","der04","der01","lon04","lon08","lon07","lon02","lon01","lon00","lon06","brd15","brd16","brd11","brd06","brd05","brd17","brd18","brd08","brd01","brd03","brd00","brd04","brd02","mus16","mus17","mus18","mus08","mus01","mus09","mus00","mus15","mus03","mus10","mus04","mus05","mus14","mus02","mus12","bul08","bul07","bul03","bul05","bul01","bul00","cbr07","cbr19","cbr09","cbr13","cbr17","cbr16","cbr01","cbr00","cbr10","cbr02","cbr04","cbr14","cbr03","cbr05","cbr15","cbr06","crd08","crd07","crd02","crd06","crd01","crd04","crd00","cow07","cow06","cow01","cow00","shp10","shp04","shp13","shp11","shp12","shp03","shp15","shp01","shp07","shp09","shp00","shp02","shp08","goa08","goa09","goa02","goa07","goa06","goa00","goa04","goa01","duk17","duk11","duk16","duk13","duk00","duk04","duk03","duk06","duk12","duk15","duk02","duk07","duk10","duk05","duk01","duk08","duk09","mnk07","mnk06","mnk08","mnk04","mnk01","mnk05","mnk03","mnk02","kgr08","kgr09","kgr02","kgr10","kgr00","kgr01","kgr06","kgr05","elp12","elp05","elp09","elp07","elp10","elp04","elp00","elp03","elp06","elp01","elp02","rhn08","rhn04","rhn02","rhn07","rhn00","rhn01","kal10","kal04","kal08","kal09","kal01","kal02","kal00","kal03","kal05","bea13","bea14","bea08","bea02","bea11","bea15","bea09","bea01","bea07","bea10","bea12","bea03","bea00","bea06","bea05","ost05","ost10","ost07","ost03","ost06","ost08","ost02","ost09","ost01","ost00","rbt19","rbt11","rbt14","rbt18","rbt17","rbt10","rbt04","rbt02","rbt07","rbt12","rbt00","rbt01","rbt05","rbt06","rbt13","rbt16","rbt03","rbt08","rbt15","rbt09","pgn12","pgn13","pgn09","pgn14","pgn00","pgn04","pgn05","pgn06","pgn10","pgn01","pgn11","pgn03","pgn02","hip09","hip05","hip00","hip08","hip03","hip02","hip04","ham02","ham04","ham03","ham05","ham07","ham06","ham01","ham00","tig05","tig06","tig02","tig03","tig00","tig01","tig04"]

const validateCode = (code: string): boolean => {
  if (villagerList.some(e => e.code === code)) {
    return true;
  } else {
    return false;
  }
}

loadDb()

router.get(['/', '/:param'], (req: Request, res: Response) => {
  res.render('villagers/main', {data: villagerList, locale: req.cookies.locale});
});

router.get('/react/villagers', validateReact, ((req, res) => {
  const json = JSON.stringify(villagerList);
  const data = encrypt(json);

  return res.json({code: 200, comment: 'success', data, locale: req.cookies.locale});
}));

router.get('/react/my/get', validateReact, (req, res) => {
  if (req.user) {
    const db = MyVillagers.getInstance();
    const user = req.user as UserDocument;
    let data: string[];
    if (req.session!.myvillagers == null || req.session!.myvillagersguest === true || req.session!.requireupdate === 4) {
      data = db.getMyVillagers(user.id);
      req.session!.myvillagers = data;
      req.session!.myvillagersguest = false;
      req.session!.requireupdate = 1;
    } else {
      data = req.session!.myvillagers;
    }
    return res.json({code: 'villagers00', comment: 'success', data: encrypt(JSON.stringify(data))})
  } else {
    if (req.session?.myvillagers == null) {
      req.session!.myvillagers = resize([], 10, null)
      req.session!.myvillagersguest = true;
    }
    return res.json({code: 'villagers00', comment: 'success', data: encrypt(JSON.stringify(req.session!.myvillagers))});
  }
});

router.post('/react/my/set', validateReact, (req, res) => {
  const body = JSON.parse(decrypt(req.body.data));
  if (!validateCode(body.code as string)) return {code: 500, comment: 'Internal Server Error.'}
  if (req.user) {
    const db = MyVillagers.getInstance();

    if (req.session!.myvillagers == null) {
      req.session!.myvillagers =  resize([], 10, null)
    }
    if (getLengthWithoutNull(req.session!.myvillagers) >= 10)
      return res.json({code: 'villager01', comment: res.__('ts.villagers.my.full')});

    const existData: string[] = req.session!.myvillagers
    if (existData.includes(body.code)) return res.json({code: 'villager01', comment: res.__('ts.villagers.my.alreadyexists')})
    pushToNull(existData, body.code);
    db.setMyVillager((req.user as UserDocument).id, existData);
    req.session!.requireupdate = 4;
  } else {
    if (req.session!.myvillagers == null) {
      req.session!.myvillagers = resize([], 10, null);
    }
    const arr = (req.session!.myvillagers) as string[];
    if (getLengthWithoutNull(req.session!.myvillagers) >= 10)
      return res.json({code: 'villager01', comment: res.__('ts.villagers.my.full')});
    if (arr.includes(body.code)) return res.json({code: 'villager01', comment: res.__('ts.villagers.my.alreadyexists')})
    pushToNull(arr, body.code);
    req.session!.myvillagers = arr;
    req.session!.myvillagersguest = true;
  }
  return res.json({code: 'villagers00', comment: res.__('ts.villagers.my.added')})
});

router.delete('/react/my/del', validateReact, (req, res) => {
  const body = JSON.parse(decrypt(req.body.data));

});
export default router;
