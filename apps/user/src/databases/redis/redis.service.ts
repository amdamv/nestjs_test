import { Injectable, Logger, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import Redis from 'ioredis';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class RedisService implements OnModuleInit, OnModuleDestroy {
  logger = new Logger(RedisService.name);
  private client: Redis;

  constructor(private readonly configService: ConfigService) {}

  onModuleInit() {
    this.client = new Redis({
      host: this.configService.get('REDIS_HOST', 'localhost'),
      port: this.configService.get('REDIS_PORT', 6379),
      password: this.configService.get('REDIS_PASSWORD'),
    });

    this.client.on('connect', () => this.logger.log('[Redis] Connected'));
    this.client.on('error', (err) => this.logger.log('[Redis] Error:', err));
  }

  onModuleDestroy() {
    return this.client.quit();
  }

  async set(key: string, value: string, ttlSecond?: number): Promise<void> {
    if (ttlSecond) {
      await this.client.set(key, value, 'EX', ttlSecond);
    } else {
      await this.client.set(key, value);
    }
  }

  async setObject(key: string, value: unknown, ttlSecond?: number) {
    const serialized = JSON.stringify(value);
    return await this.set(key, serialized, ttlSecond);
  }

  async get(key: string): Promise<string | null> {
    return this.client.get(key);
  }

  async getObject<T>(key: string): Promise<T | null> {
    const data = await this.get(key);
    if (!data) {
      return null;
    }
    return JSON.parse(data) as T;
  }

  async del(key: string): Promise<number> {
    return this.client.del(key);
  }

  async exists(key: string): Promise<boolean> {
    return (await this.client.exists(key)) === 1;
  }

  async expire(key: string, seconds: number): Promise<boolean> {
    return (await this.client.expire(key, seconds)) === 1;
  }

  async hset(key: string, field: string, value: string): Promise<void> {
    await this.client.hset(key, field, value);
  }

  async hget(key: string, field: string): Promise<string | null> {
    return this.client.hget(key, field);
  }

  async hdel(key: string, field: string): Promise<number> {
    return this.client.hdel(key, field);
  }

  async hgetall(key: string): Promise<Record<string, string>> {
    return this.client.hgetall(key);
  }

  async hexists(key: string, field: string): Promise<boolean> {
    return (await this.client.hexists(key, field)) === 1;
  }

  getClient(): Redis {
    return this.client;
  }
}
