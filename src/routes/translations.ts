import { Request, Response, Router} from 'express';
import {creatures, items, npcs, reactions, recipes, villagers} from 'animal-crossing';
import {dataBody} from '@interfaces/Body';
import {decrypt} from '@shared/Encryption';
import {Item} from 'animal-crossing/lib/types/Item';
import {Villager} from 'animal-crossing/lib/types/Villager';
import {Creature} from 'animal-crossing/lib/types/Creature';
import {Npc} from 'animal-crossing/lib/types/NPC';
import {Recipe} from 'animal-crossing/lib/types/Recipe';
import {Reaction} from 'animal-crossing/lib/types/Reaction';
import regex from 'xregexp';

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

type Entry = Item | Villager | Creature | Npc | Recipe | Reaction;

const getName = (e: Entry, language: string): string => {
    if (e.translations == null) {
        return e.name
    } else {
        switch (language) {
            case 'ko_KR':
                return e.translations.kRko
            case 'ja_JP':
                return e.translations.jPja
            default:
                return e.name
        }
    }
}

const getLocaleInfo = (e: Entry): localeInfo[] => {
    if (e.translations != null) {
        return [
            {language: 'jp', name: e.translations.jPja},
            {language: 'kr', name: e.translations.kRko},
            {language: 'en', name: e.translations.uSen},
            {language: 'zh', name: e.translations.tWzh},
            {language: 'ru', name: e.translations.eUru}
        ]
    } else {
        return []
    }
}

const getItemImage = (i: Entry): string | null => {
    const image: string | null = null;
    if ('image' in i && i.image != null) return i.image
    if ('framedImage' in i && i.framedImage != null) return i.framedImage
    if ('inventoryImage' in i && i.inventoryImage != null) return i.inventoryImage
    if ('closetImage' in i && i.closetImage != null) return i.closetImage
    if ('albumImage' in i && i.albumImage != null) return i.albumImage
    if ('storageImage' in i && i.storageImage != null) return i.storageImage
    if ('variations' in i && i.variations != null) {
        const vi = (i.variations[0].image || i.variations[0].closetImage || i.variations[0].storageImage);
        if (vi != null) {
            return vi
        }
    }
    if ('iconImage' in i) {
        return i.iconImage
    }
    return image;
}

const getLetterLimit = (language: string): number => {
    switch (language) {
        case 'ko_KR':
        default:
            return 2
        /* case 'ja_JP':
            return 3
        case 'en_US':
        default:
            return 3 */
    }
}

const searchVillager = (keyword: string): Villager[] => {
    return villagers.filter(v => {
        if (v.translations != null) {
            return v.name.toLowerCase().includes(keyword.toLowerCase()) ||
                v.translations.kRko.includes(keyword) ||
                v.translations.jPja.includes(keyword) ||
                v.translations?.tWzh.includes(keyword) ||
                v.translations.eUru.includes(keyword.toLowerCase())
        } else {
            return false
        }
    });
}

const searchItem = (keyword: string): Item[] => {
    return items.filter(i => {
        if (i.translations != null) {
            return i.name.toLowerCase().includes(keyword.toLowerCase()) ||
                i.translations?.kRko.includes(keyword) ||
                i.translations?.tWzh.includes(keyword) ||
                i.translations?.eUfr.includes(keyword.toLowerCase()) ||
                i.translations?.eUde.includes(keyword.toLowerCase()) ||
                i.translations?.eUru.includes(keyword.toLowerCase()) ||
                i.translations?.jPja.includes(keyword)
        } else {
            return false;
        }
    });
}

const searchCreature = (keyword: string): Creature[] => {
    return creatures.filter(c => {
        if (c.translations != null) {
            return c.name.toLowerCase().includes(keyword.toLowerCase()) ||
                c.translations.kRko.includes(keyword) ||
                c.translations.jPja.includes(keyword) ||
                c.translations.tWzh.includes(keyword) ||
                c.translations.eUru.includes(keyword.toLowerCase())
        } else {
            return false;
        }
    })
}

const searchNpc = (keyword: string): Npc[] => {
    return npcs.filter(n => {
        return n.name.toLowerCase().includes(keyword.toLowerCase()) ||
            n.translations.kRko.includes(keyword) ||
            n.translations.jPja.includes(keyword) ||
            n.translations.tWzh.includes(keyword) ||
            n.translations.eUru.includes(keyword.toLowerCase())
    });
}

const getResult = (arr: Entry[], language: string): searchResult[] => {
    const rst: searchResult[] = [];
    arr.forEach((e: Entry) => {
        if (e.translations != null) {
            const locales: localeInfo[] = getLocaleInfo(e)
            const name = getName(e, language)
            const image = getItemImage(e);
            rst.push({result: locales, name, image});
        }
    });
    return rst;
}


router.post('/', (req: Request, res: Response) => {
    const body = JSON.parse(decrypt((req.body as dataBody).data)) as {keyword: string; method: number}
    const search = regex.replace(body.keyword, regex('[^\\p{Ll}\\p{Lu}\\p{Lt}\\p{Nd}\\p{Nl}\\p{No}\\p{Lm}\\p{Lo}\'\\- _]'), '', 'all').trim()
    if (search === '') { return res.json([]) }
    if (search.length < getLetterLimit(req.language)) { return res.json([]) }

    const l = req.language;
    switch (body.method) {
        case 1:
            return res.json(getResult(searchItem(search), l));
        case 2:
            return res.json(getResult(searchVillager(search), l));
        case 3:
            return res.json(getResult(searchCreature(search), l));
        case 4:
            return res.json(getResult(searchNpc(search), l));
        case 5:
            return res.json(getResult(recipes.filter(r => {
                if (r.translations == null) return r.name.toLowerCase().includes(search.toLowerCase());
                return r.name.toLowerCase().includes(search.toLowerCase()) ||
                    r.translations.kRko.includes(search) ||
                    r.translations.jPja.includes(search) ||
                    r.translations.tWzh.includes(search) ||
                    r.translations.eUru.includes(search.toLowerCase())
            }), l))
        case 6:
            return res.json(getResult(reactions.filter(r => {
                if (r.translations == null) return r.name.toLowerCase().includes(search.toLowerCase());
                return r.name.toLowerCase().includes(search.toLowerCase()) ||
                    r.translations.kRko.includes(search) ||
                    r.translations.jPja.includes(search) ||
                    r.translations.tWzh.includes(search) ||
                    r.translations.eUru.includes(search.toLowerCase())
            }), l))

        case 0:
        default:
            return res.json(getResult(searchItem(search), l).concat(getResult(searchVillager(search), l)).concat(getResult(searchCreature(search), l)));
    }
});
export default router;