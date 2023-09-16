import Redis from 'ioredis';
import RedisMock from 'ioredis-mock';
import * as dotenv from 'dotenv';

dotenv.config();

const url = `${process.env.CACHE_URL}`;

function getRedisClient(): Redis {
  if (process.env.NODE_ENV === 'test') {
    const redisClient = new RedisMock(url);

    return redisClient;
  }

  const redisClient = new Redis(url);
  return redisClient;
}

const redisClient = getRedisClient();

export { redisClient };
