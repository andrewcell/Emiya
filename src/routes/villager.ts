import { Request, Response, Router} from 'express';
import {validateLoggedIn, validateReact} from '@shared/validation';
import {decrypt, encrypt} from '@shared/Encryption';
import MyVillagers, {VillagerStorage} from '@interfaces/MyVillagersDatabase';
import {UserDocument} from '@shared/User';
import {internalError} from '@shared/constants';
import logger from '@shared/Logger';
import {villagers} from 'animal-crossing';
import MyVillagersDatabase from '@interfaces/MyVillagersDatabase';
import {dataBody, codeBody} from '@interfaces/Body';
import regex from 'xregexp';

const router = Router();

const validateCode = (code: string): boolean => {
  return villagers.find(v => v.filename === code) != null;
}

declare module 'express-session' {
  interface SessionData {
    myVillagers: string[];
    group: string;
    groups: string[];
    requireUpdate: boolean;
    storage: VillagerStorage;
  }
}

router.get(['/', '/:param'], (req: Request, res: Response) => {
  const title = res.__('global.title.subtitle', res.__('villagers.title'))
  res.render('villagers/main', {locale: (req.cookies as {locale: string}).locale, title});
});

router.get('/react/villagers', validateReact, ((req, res) => {
  const json = JSON.stringify(villagers);
  const data = encrypt(json);

  return res.json({code: 200, comment: 'success', data, locale: (req.cookies as {locale: string}).locale});
}));

type getVillagersData = [string, string[], string[], VillagerStorage];

router.get('/react/my/get', validateReact, validateLoggedIn, async (req, res) => {
  const db = MyVillagers.getInstance();
  const user = req.user as UserDocument;
  let storage: getVillagersData = ['', [], [], {}];
  if (req.session != null) {
    if (req.session.myVillagers == null || req.session.group == null || req.session.requireUpdate) {
      storage = await db.getMyVillagers(user.id);
      req.session.myVillagers = storage[1];
      req.session.group = storage[0];
      req.session.groups = storage[2];
      req.session.requireUpdate = false;
      req.session.storage = storage[3];
    } else {
      storage = [req.session.group, req.session.myVillagers, req.session.groups, req.session.storage] as getVillagersData;
    }
    // const responseData: VillagerStorage = {};
    // responseData[storage[0]] = storage[1];
    // responseData.groups = storage[2];
    return res.json({code: 'villagers00', comment: 'success', data: encrypt(JSON.stringify(storage))})
  }
});

router.post('/react/my/set', validateReact, validateLoggedIn, async (req, res) => {
  const code = (JSON.parse(decrypt((req.body as dataBody).data)) as codeBody).code;
  if (!validateCode(code)) return {code: 500, comment: 'Internal Server Error.'}
  const db = MyVillagers.getInstance();
  if (req.session != null) {
    const { myVillagers } = req.session;
    if (myVillagers == null) return
    if (myVillagers.length >= 14) {
      return res.json({code: 'villagers01', comment: res.__('ts.villagers.my.full')});
    }
    if (myVillagers.includes(code)) return res.json({
      code: 'villager01',
      comment: res.__('ts.villagers.my.alreadyexists')
    })
    myVillagers.push(code);
    await db.setMyVillager((req.user as UserDocument).id, myVillagers);
    return res.json({code: 'villagers00', comment: res.__('ts.villagers.my.added')})
  }
});

router.post('/react/my/delete', validateReact, (req, res) => {
  try {
    const code = (JSON.parse(decrypt((req.body as dataBody).data)) as codeBody).code;
    if (!validateCode(code)) return {code: 500, comment: 'Internal Server Error.'}
    if (req.session != null) {
      if (req.session.myVillagers == null) {
        return res.json({code: 'villagers02', comment: res.__('ts.villagers.targetnotexists')})
      }
      const { myVillagers } = req.session;
      const targetIndex = myVillagers.indexOf(code);
      if (targetIndex > -1) {
        myVillagers.splice(targetIndex, 1);
      } else {
        return res.json({code: 'villagers02', comment: res.__('ts.villagers.targetnotexists')})
      }
      const db = MyVillagers.getInstance();
      void db.setMyVillager((req.user as UserDocument).id, myVillagers);
      return res.json({code: 'villagers00', comment: res.__('ts.villagers.deletesuccess')})
    }
  } catch (e: unknown) {
    if (e instanceof Error) {
      logger.error(e.message, e);
    }
    return res.json({code: 500, comment: internalError})
  }
});

router.post('/getvillager', validateReact, validateLoggedIn, (req, res) => {
  const code = decrypt((req.body as codeBody).code);
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
  const decrypted: string = decrypt((req.body as dataBody).data)
  if (decrypted === '' || decrypted.length <= 1) {
    return res.json({data: encrypt('')});
  }
  const result = villagers.filter(v => {
    return v.translations.kRko.includes(decrypted) ||
        v.translations.uSen.toLowerCase().includes(decrypted) ||
        v.translations.jPja.includes(decrypted)
  });
  return res.json({data: encrypt(JSON.stringify(result))});
});

router.put('/group', validateLoggedIn, (req, res) => {
  const groupName: string = decrypt((req.body as dataBody).data);
  if (req.session != null && req.user != null) {
    const userTyped = req.user as UserDocument;
    void MyVillagersDatabase.getInstance().changeGroup(userTyped._id, groupName)
        .then(myVillagers => {
          if (req.session != null) {
            req.session.group = groupName;
            req.session.myVillagers = myVillagers;
            req.session.requireUpdate = true;
            return res.json({code: 'group00', comment: '', data: encrypt(JSON.stringify(myVillagers))})
          }
        })
  }
});

router.post('/groupmgmt', validateLoggedIn, validateReact, async (req, res) => {
  if (req.user) {
    const storage = await MyVillagersDatabase.getInstance().getStorage((req.user as UserDocument)._id)
    return res.json({data: encrypt(JSON.stringify(storage))});
  } else {
    return res.json({})
  }
});

router.post('/creategroup', validateLoggedIn, validateReact, async (req, res) => {
  const failed = {code: 'group01', comment: 'failed'};
  if (req.user) {
    const user = req.user as UserDocument;
    const groupName: string = decrypt((req.body as dataBody).data);
    if (!/^[ㄱ-ㅎ|가-힣|a-z|A-Z|0-9|\*]+$/.test(groupName)) {
      return res.json(failed);
    }
    const addGroupSuccess = await MyVillagersDatabase.getInstance().addGroup(user._id, groupName);
    if (req.session != null) req.session.requireUpdate = true;
    if (addGroupSuccess) {
      return res.json({code: 'group00', comment: 'success'})
    } else {
      return res.json(failed);
    }
  }
});

router.post('/deletegroup', validateLoggedIn, validateReact, async (req, res) => {
  const groupName = regex.replace(decrypt((req.body as dataBody).data), regex('[^\\p{Ll}\\p{Lu}\\p{Lt}\\p{Lm}\\p{Nd}\\p{Lo}\'\\- _]'), '', 'all').trim()
  if (req.user) {
    const r = await MyVillagersDatabase.getInstance().deleteGroup((req.user as UserDocument)._id, groupName);
    if (r[0] !== '') {
      const code = (r[1]) ? 'group02' : 'group00';
      if (req.session != null) req.session.requireUpdate = true;
      return res.json({code, comment: 'success', data: r[0]});
    } else {
      return res.json({code: 'group01', comment: 'failed', data: ''});
    }
  }
});

export default router;
