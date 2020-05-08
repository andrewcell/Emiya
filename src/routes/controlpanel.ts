import { Request, Response, Router} from 'express';
import { LogJson } from '@interfaces/logJson'
import { readFileSync } from 'fs';
import { fileExistsSync } from 'tsconfig-paths/lib/filesystem'
import path from 'path'
import { Reader, AsnResponse, CityResponse, CountryResponse } from 'maxmind';
import { getDataPath } from '@shared/functions'

const router = Router();

router.get('/downloadlog', (req: Request, res: Response) => {
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

export default router;