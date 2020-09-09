/**
 * @packageDocumentation
 * @hidden
 */

import axios from 'axios';
import moment from 'moment';
import {encrypt} from '@shared/Encryption';
import logger from '@shared/Logger';

interface PhraseDatabase {
    language: string;
    untranslated: number;
}

class Phrase {
    static data: PhraseDatabase[] = [];

    static refresh(): void {
        this.data = [];
        axios.get('https://api.phrase.com/v2/projects/f250fe4162fc824277e23a528175df66/translations?per_page=1000', {
            auth: {
                username: '84157125322782f83c687b233df20f1a8c8a4ebc300ee0c480bfd5498b418aa3',
                password: ''
            }
        }).then(r => {
            for (const [key, value] of Object.entries(r.data)) {
                console.log(JSON.stringify(r.data, null, 4))
            }
            return;
        }).catch(e => {
            logger.error(e)
            return;
        })
    }
}

export default Phrase;