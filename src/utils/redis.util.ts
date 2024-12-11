import { createClient } from '@redis/client';
import { loggers } from './winston.util';

const redisClient = createClient();


(async () => {
    if (!redisClient.isOpen) {
        try {
            await redisClient.connect();
            loggers.info('Connected to Redis');
        } catch (err) {
            loggers.error('Failed to connect to Redis:', err);
        }
    }
})();

export default redisClient;