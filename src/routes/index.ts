import { Request, Response, Router} from 'express';
import {readSync, readFileSync, existsSync, writeFileSync} from 'fs';
import path from 'path';

import {Villager} from '@interfaces/villagerData';
import {DownloadKey} from '@interfaces/downloadKey';
import {Log, LogJson} from '@interfaces/logJson';

import {Session} from 'inspector';

const downloadKey = new Map<string, DownloadKey>();

const mibo: Villager[] = JSON.parse(readFileSync(path.join(__dirname, '../data/miibo.json')).toString()).data;
const welcome: Villager[] = JSON.parse(readFileSync(path.join(__dirname, '../data/wel.json')).toString()).data;
const figure: Villager[] = JSON.parse(readFileSync(path.join(__dirname, '../data/figure.json')).toString()).data;

const ipSession = new Map<string, number>();

const tryParseInt = (str: any, defaultValue: string) => {
    let retValue: any = defaultValue;
    if(str !== null) {
        if(str.length > 0) {
            if (!isNaN(str)) {
                retValue = parseInt(str);
            }
        }
    }
    return retValue;
}
const save = (name: string, ip: string, key: string) => {
    if (!existsSync('log.json')) {
        writeFileSync('log.json', '{}');
    }
    if (!existsSync('logArray.json')) {
        writeFileSync('logArray.json', '{"data": []}');
    }
    const log = JSON.parse(readFileSync('log.json').toString());
    const logArray: LogJson = JSON.parse(readFileSync('logArray.json').toString());
    let count = 1;
    if (log[name] != null && log[name] !== null) {
        count = count + log[name]
    }
    const arr = name.split('-');
    logArray.data.push({
        cardNumber: arr[0].toString().trim(), name: arr[1].trim(), nameKor: arr[2].trim(), now: new Date().toLocaleString(), ip, key
    });
    log[name] = count;
    writeFileSync('log.json', JSON.stringify(log, null ,4));
    writeFileSync('logArray.json', JSON.stringify(logArray, null ,4));
}

const ranking = (name: string, ip: string, key: string, sp: any, req: Request): void => {
    if (sp) return;
    const filename = 'ranking.json';
    if (!existsSync(filename)) {
        writeFileSync(filename, '{}');
    }
    const rankingData = JSON.parse(readFileSync(filename).toString());
    const arr = name.split('-');
    const cardNumber = arr[0].toString().trim()
    if (!(req.session!.cnumber >= 1 || ipSession.get(ip)! >= 5) || ipSession.get(ip) === null) {
        if (rankingData[name] == null) {
            rankingData[name] = 1;
        } else {
            rankingData[name] =  rankingData[name] + 1;
        }
        // (name in rankingData) ? rankingData[name]++ : rankingData[name] = 1;
        if (ipSession.get(ip) != null) {
            ipSession.set(ip, ipSession.get(ip) as number + 1);
        } else {
            ipSession.set(ip, 1);
        }
        req.session!.cnumber = 1;
    }
    writeFileSync(filename, JSON.stringify(rankingData, null, 4));
}

const makeId = (length: number): string => {
    let result = '';
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    const charactersLength = characters.length;
    for (let i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
}

mibo.forEach((ambo) => {
    const cardNumber = Number(ambo.number);
    if (cardNumber !== -1) {
        const randomKey = makeId(32)
        let sp = false;
        if (ambo.personality === null || ambo.personality === ['', '']) {
            sp = true;
        }
        downloadKey.set(randomKey, {
            file: ambo.file,
            name: cardNumber + ' - ' + ambo.name + ' - ' + ambo.name_kor,
            sp
        });
        ambo.file = randomKey;
    }
});

welcome.forEach((ambo) => {
    const randomKey = makeId(64);
    downloadKey.set(randomKey, {
        file: ambo.file,
        name: ambo.number + ' - ' + ambo.name + ' - ' + ambo.name_kor
    });
    ambo.file = randomKey;
})

figure.forEach((ambo) => {
    const randomKey = makeId(128);
    downloadKey.set(randomKey, {
        file: ambo.file,
        name: ambo.number + ' - ' + ambo.name + ' - ' + ambo.name_kor,
        fi: true
    });
    ambo.file = randomKey;
})

const router = Router();

router.get('/', (req: Request, res: Response) => {
    res.render('index', { title: 'NTAG215', miibo: mibo, welcome, figures: figure});
});

router.get(['/category', '/category/:id'], (req: Request, res: Response) => {
    if (typeof req.params.id !== 'undefined' && req.params.id === 'welcome') {
        res.render('category', { title: 'NTAG215', miibo: welcome, category: 'welcome' })
    } else {
        let id = Number(req.params.id);
        if (typeof req.params.id === 'undefined') id = 1;
        const newData: Villager[] = [];
        mibo.forEach((ambo) => {
            const cardNumber = Number(ambo.number);
            if (cardNumber !== -1) {
                if (cardNumber >= ((id - 1) * 100) + 1 && cardNumber <= (100 * (id))) {
                    newData.push(ambo)
                }
            }
        });
        res.render('category', { title: 'NTAG215', miibo: newData, category: id })
    }
});

router.get('/data/:key', ((req: Request, res: Response) => {
    const ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
    const key = req.params.key;
    if (key == null || !downloadKey.has(key)) {
        return res.render('error', { notfound: true });
    } else {
        const realFile = downloadKey.get(key);
        if (realFile == null) {
            return res.render('error', { notfound: true });
        } else {
            if (ip != null) {
                save(realFile.name, ip as string, key);
            }
            ranking(realFile.name, ip as string, key, realFile.sp, req);
            if (realFile.file === 'no') {
                return res.render('error', {notyet: true});
            } else {
                let link = 'src/data/Cards/';
                if (realFile.fi === true) {
                    link = 'src/data/Figures/';
                }
                res.download(path.resolve(link + realFile.file), realFile.name + '.bin');
            }
        }
    }
}));

interface Ranking {
    name: string;
    count: number;
}

interface RankingPublic {
    image: string;
    cardNumber: string | number;
    name: string;
    nameKor: string;
    count: number;
}

router.get('/menu', (req: Request, res: Response) => {
    const log = JSON.parse(readFileSync('ranking.json').toString());
    const array: RankingPublic[] = [];
    Object.entries(log).forEach(([key, count]) => {
        const data = key.split('-');
        let cardNumber = tryParseInt(data[0], data[0]);
        let image = 'cards';
        if (typeof cardNumber === 'string') {
            cardNumber = cardNumber.replace(/\s/g, '');
            image = 'welcome';
        }
        const name = data[1].replace(/\s/g, '');
        const nameKor = data[2].replace(/\s/g, '');
        array.push({image, cardNumber, name, nameKor, count: (count as number)})
    });
    const sortedArray: RankingPublic[] = array.sort((obj1, obj2) => {
        if (obj1.count > obj2.count) {
            return 1;
        }
        if (obj1.count < obj2.count) {
            return -1;
        }
        return 0;
    })
    res.render('ranking', {data: sortedArray.reverse()})
    // res.render('menu');
});


export default router;
