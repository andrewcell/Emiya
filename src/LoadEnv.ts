import dotenv from 'dotenv';
import commandLineArgs from 'command-line-args';
import logger from '@shared/Logger';

// Setup command line options
const options = commandLineArgs([
    {
    name: 'env',
        alias: 'e',
        defaultValue: 'production',
        type: String,
    },
]);

try {
    // Set the env file
    const result2 = dotenv.config({
        path: `./env/${options.env}.env`,
    });
    if (result2.error) {
        throw result2.error;
    }   
} catch (e) {
    logger.error('env not found', e);
}


