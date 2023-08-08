import { OnApplicationShutdown, OnModuleDestroy } from '@nestjs/common';
import { Injectable } from '@nestjs/common';
import Redis from 'ioredis';

@Injectable()
export class RedisService implements OnModuleDestroy, OnApplicationShutdown {
  constructor(private readonly redisClient: Redis) {}

  async onModuleDestroy() {
    this.redisClient.disconnect();
  }

  async onApplicationShutdown() {
    this.redisClient.disconnect();
  }
}
