import { Request, Response, Router} from 'express';
import {validateLoggedIn, validateReact} from '@shared/validation';
import {decrypt, encrypt} from '@shared/Encryption';
import MyVillagers, {resize} from '@interfaces/MyVillagersDatabase';
import {UserDocument} from '@shared/User';
import {internalError} from '@shared/constants';
import logger from '@shared/Logger';
import {villagers} from 'animal-crossing';

const router = Router();

router.use((req, res, next) => {
  res.locals.villagers = true;
  next();
});

const getLengthWithoutNull = (arr: string[] | number[]): number => {
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

const validateCode = (code: string): boolean => {
  return villagers.find(v => v.filename === code) != null;
}

const getVillagerMapId = (req: Request): string => {
  if (req.session!.myvillagersmap != null) {
    return req.session!.myvillagersmap;
  } else {
    return '1';
  }
}

router.get(['/', '/:param'], (req: Request, res: Response) => {
  const title = res.__('global.title.subtitle', res.__('villagers.title'))
  res.render('villagers/main', {locale: req.cookies.locale, title});
});

router.get('/react/villagers', validateReact, ((req, res) => {
  const json = JSON.stringify(villagers);
  const data = encrypt(json);

  return res.json({code: 200, comment: 'success', data, locale: req.cookies.locale});
}));

router.get('/react/my/get', validateReact, async (req, res) => {
  const myVillagersMap = new Map<string, string[]>()
  if (req.user) {
    const db = MyVillagers.getInstance();
    const user = req.user as UserDocument;
    let data: string[];
    if (req.session!.myvillagers == null || req.session!.myvillagersguest === true || req.session!.requireupdate === 4) {
      data = await db.getMyVillagers(user.id);
      req.session!.myvillagers = data;
      req.session!.myvillagersguest = false;
      req.session!.requireupdate = 1;
    } else {
      data = req.session!.myvillagers;
    }
    return res.json({code: 'villagers00', comment: 'success', data: encrypt(JSON.stringify(data))})
  } else {
    if (req.session?.myvillagers == null) {
      req.session!.myvillagers = resize([], 14, null)
      req.session!.myvillagersguest = true;
    }
    return res.json({code: 'villagers00', comment: 'success', data: encrypt(JSON.stringify(req.session!.myvillagers))});
  }
});

router.post('/react/my/set', validateReact, async (req, res) => {
  const body = JSON.parse(decrypt(req.body.data));
  if (!validateCode(body.code as string)) return {code: 500, comment: 'Internal Server Error.'}
  if (req.user) {
    const db = MyVillagers.getInstance();

    if (req.session!.myvillagers == null) {
      req.session!.myvillagers =  resize([], 14, null)
    }
    if (getLengthWithoutNull(req.session!.myvillagers) >= 14)
      return res.json({code: 'villagers01', comment: res.__('ts.villagers.my.full')});

    const existData: string[] = req.session!.myvillagers
    if (existData.includes(body.code)) return res.json({code: 'villager01', comment: res.__('ts.villagers.my.alreadyexists')})
    pushToNull(existData, body.code);
    await db.setMyVillager((req.user as UserDocument).id, existData);
    req.session!.requireupdate = 4;
  } else {
    if (req.session!.myvillagers == null) {
      req.session!.myvillagers = resize([], 14, null);
    }
    const arr = (req.session!.myvillagers) as string[];
    if (getLengthWithoutNull(req.session!.myvillagers) >= 14)
      return res.json({code: 'villagers01', comment: res.__('ts.villagers.my.full')});
    if (arr.includes(body.code)) return res.json({code: 'villager01', comment: res.__('ts.villagers.my.alreadyexists')})
    pushToNull(arr, body.code);
    req.session!.myvillagers = arr;
    req.session!.myvillagersguest = true;
  }
  return res.json({code: 'villagers00', comment: res.__('ts.villagers.my.added')})
});

router.delete('/react/my/set', validateReact, (req, res) => {
  try {
    const body = JSON.parse(decrypt(req.body.data));
    if (!validateCode(body.code as string)) return {code: 500, comment: 'Internal Server Error.'}
    if (req.session!.myvillagers == null) {
      return res.json({code: 'villagers02', comment: res.__('ts.villagers.targetnotexists')})
    }
    const villagersArray = req.session!.myvillagers as string[]
    const targetIndex = villagersArray.indexOf(body.code);
    if (targetIndex > -1) {
      villagersArray.splice(targetIndex, 1);
    } else {
      return res.json({code: 'villagers02', comment: res.__('ts.villagers.targetnotexists')})
    }
    req.session!.myvillagers =  resize(villagersArray, 14, null)
    if (req.user) {
      const db = MyVillagers.getInstance();
      db.setMyVillager((req.user as UserDocument).id, villagersArray);
    }
    return res.json({code: 'villagers00', comment: res.__('ts.villagers.deletesuccess')})
  } catch (e) {
    logger.error(e.message, e);
    return res.json({code: 500, comment: internalError})
  }
});

router.post('/getvillager', validateReact, validateLoggedIn, (req, res) => {
  const code = decrypt(req.body.code as string);
  if (!validateCode(code)) {
    return res.json({code: 500, comment: internalError});
  }
  const villager = villagers.find(v => v.filename === code)
  if (villager != null) {
    return res.json({data: encrypt(JSON.stringify(villager))})
  } else {
    return res.json({code: 500, comment: internalError});
  }
});

router.post('/search', validateReact, (req, res) => {
  const decrypted: string = decrypt(req.body.data)
  if (decrypted === '' || decrypted.length <= 1) {
    return res.json({data: encrypt('')});
  }
  const result = villagers.filter(v => {
    return v.translations.korean.includes(decrypted) ||
        v.translations.english.toLowerCase().includes(decrypted) ||
        v.translations.japanese.includes(decrypted)
  });
  return res.json({data: encrypt(JSON.stringify(result))});
});

export default router;
