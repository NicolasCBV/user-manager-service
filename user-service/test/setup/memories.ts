import { redisClient } from "@infra/storages/cache/redis/redisClient";
import { dataSource } from "@infra/storages/db/typeorm/database.provider"
import { prisma } from '@infra/storages/db/prisma/prismaClient';
import { exclude } from "@root/tsconfig-excludes.json"

beforeEach(async () => {
  await redisClient.flushall();
  const entities = dataSource.entityMetadatas;

  const isPrisma = exclude.find((item) => item === '**/*typeorm*');
  if(!isPrisma)
    for(let entitie of entities) {
      const repo = dataSource.getRepository(entitie.name);
      await repo.clear();
    }
  else
    await prisma.user.deleteMany({});
})
