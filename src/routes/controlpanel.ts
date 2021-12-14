import { Request, Response, Router} from 'express';
import { LogJson } from '@interfaces/logJson'
import { readFileSync } from 'fs';
import { fileExistsSync } from 'tsconfig-paths/lib/filesystem'
import path from 'path'
import { Reader, AsnResponse, CityResponse, CountryResponse } from 'maxmind';
import { getDataPath } from '@shared/functions'
import { validateAdmin } from '@shared/validation';
import User, {UserDocument} from '@shared/User';
import moment from 'moment';
import {Mail} from '@shared/Mail';
import {SendGrid} from '@shared/SendGrid';
const router = Router();

router.get(['/', '/:param'], validateAdmin, (req, res) => {
  return res.render('vue', { script: 'cp' });
})

router.get('/downloadlog', validateAdmin, (req: Request, res: Response) => {
  if (!fileExistsSync('logArray.json')) {
    return res.render('downloadlog', { data: false });
  }
  let asn;
  let city;
  let country;
  if (fileExistsSync(path.join(__dirname, '../data/GeoLite2-ASN.mmdb'))) {
    asn = new Reader<AsnResponse>(readFileSync(getDataPath('GeoLite2-ASN.mmdb')));
  }
  if (fileExistsSync(getDataPath('GeoLite2-City.mmdb'))) {
    city = new Reader<CityResponse>(readFileSync(getDataPath('GeoLite2-City.mmdb')));
  }
  if (fileExistsSync(getDataPath('GeoLite2-Country.mmdb'))) {
    country = new Reader<CountryResponse>(readFileSync(getDataPath('GeoLite2-Country.mmdb')));
  }

  const logArray: LogJson = JSON.parse(readFileSync('logArray.json').toString());
  res.render('downloadlog', { data: logArray.data.reverse(), asn, city, country });
});

router.get('/users', validateAdmin, (req, res) => {
  User.find((err, users) => {
    return res.render('users', {users, moment});
  });
});

router.get('/sendmail/:username', validateAdmin, (req, res) => {
  const username = req.params.username;
  User.findOne({username}, (err: never, user: UserDocument) => {
    if (user != null) {
      const html = `<h5>서버와 API 간의 오류로 인해 메일이 정상적으로 전송되지 않았던게 확인되어 가입 메일이 재전송되었습니다. 여전히 인증을 원한다면 이 링크를 클릭하세요: </h5><a href="https://dodo.ij.rs/admin/verify/${user.verifyHash}">https://dodo.ij.rs/admin/verify/${user.verifyHash}</a>`
      SendGrid.send(user.email, '[DodoSeki] 서버 오류로 재전송된 가입 인증 메일입니다.', html)
          .then(() => {
            return res.json({})
          });
    }
  })

})

export default router;
