import { Request, Response, Router} from 'express';
import {items, villagers} from 'animal-crossing';
import {dataBody} from '@interfaces/Body';
import {decrypt} from '@shared/Encryption';
import {Item} from 'animal-crossing/lib/types/Item';
import {Villager} from 'animal-crossing/lib/types/Villager';

const router = Router();

type localeInfo = {
    language: string;
    name: string;
}

type searchResult = {
    result: localeInfo[];
    image: string | undefined | null;
    name: string;
}

const getName = (e: Item | Villager, language: string): string => {
    if (e.translations == null) {
        return e.name
    } else {
        switch (language) {
            case 'ko_KR':
                return e.translations.korean
            case 'ja_JP':
                return e.translations.japanese
            default:
                return e.name
        }
    }
}

const getLocaleInfo = (e: Villager | Item): localeInfo[] => {
    if (e.translations != null) {
        return [
            {language: 'jp', name: e.translations.japanese},
            {language: 'kr', name: e.translations.korean},
            {language: 'en', name: e.translations.english},
            {language: 'zh', name: e.translations.chineseTraditional},
            {language: 'ru', name: e.translations.russian}
        ]
    } else {
        return []
    }
}

const getItemImage = (i: Item): string | null => {
    const image = (i.image || i.framedImage || i.inventoryImage || i.closetImage || i.albumImage || i.storageImage || null)
    if (image == null && i.variations != null) {
        const vi = (i.variations[0].image || i.variations[0].closetImage || i.variations[0].storageImage);
        if (vi != null) {
            return vi
        }
    }
    return image;
}

const getLetterLimit = (language: string): number => {
    switch (language) {
        case 'ko_KR':
            return 2
        case 'ja_JP':
            return 3
        case 'en_US':
        default:
            return 4
    }
}

router.post('/', (req: Request, res: Response) => {
    const search = decrypt((req.body as dataBody).data).replace(/[\{\}\[\]\/?.,;:|\)*~`!^\-_+<>@\#$%&\\\=\(\'\"]/gi, '')
    if (search === '') { return res.json([]) }
    if (search.length < getLetterLimit(req.language)) { return res.json([]) }
    const villagerResult = villagers.filter(v => {
        if (v.translations != null) {
            return v.name.toLowerCase().includes(search) ||
                v.translations.korean.includes(search) ||
                v.translations.japanese.includes(search) ||
                v.translations?.chineseTraditional.includes(search)
        } else {
            return false
        }
    });
    const result = items.filter(i => {
        if (i.translations != null) {
            return i.name.toLowerCase().includes(search.toLowerCase()) ||
                i.translations?.korean.includes(search) ||
                i.translations?.chineseTraditional.includes(search) ||
                i.translations?.french.includes(search.toLowerCase()) ||
                i.translations?.german.includes(search.toLowerCase()) ||
                i.translations?.russian.includes(search.toLowerCase()) ||
                i.translations?.japanese.includes(search)
        } else {
            return false;
        }
    });
    const responseBody: searchResult[] = []
    villagerResult.map(v => {
        if (v.translations != null) {
            const locales: localeInfo[] = getLocaleInfo(v)
            const name = getName(v, req.language)
            responseBody.push({result: locales, name, image: v.iconImage});
        }
    });
    result.map(i => {
        if (i.translations != null) {
            const locales: localeInfo[] = getLocaleInfo(i)
            const name = getName(i, req.language)
            responseBody.push({result: locales, name, image: getItemImage(i)});
        }
    });
    return res.json(responseBody)
});
export default router;