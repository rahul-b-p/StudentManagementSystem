import { createClient } from '@redis/client';
import { loggers } from './winston';

const redisClient = createClient({
    url: 'redis://:your_secure_password@127.0.0.1:6379',
});


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