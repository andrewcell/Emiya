import './LoadEnv'; // Must be the first import
import app from '@server';
import logger from '@shared/Logger';

// Start the server
const port = Number(process.env.PORT || 3000);
const host = 'localhost' // (process.env.HOST || '0.0.0.0');
app.listen(port, host, () => {
    logger.info(`Emiya listening on ${host}:${port}`);
});
