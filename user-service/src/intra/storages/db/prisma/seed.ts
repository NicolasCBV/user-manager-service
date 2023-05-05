import { Prisma, PrismaClient, User } from '@prisma/client';
import { generateRandomCharacters } from '../../../helpers/generateRandomCharacters';
import { randomUUID } from 'node:crypto';
import { logger } from '../../../../config/logger';
import { hash } from 'bcrypt';

const prisma = new PrismaClient();

const launchUsers = async () => {
  const simulateDatabase: Prisma.Prisma__UserClient<User, never>[] = [];

  for (let i = 0; i < 100; i++) {
    const id = randomUUID();
    const characters = generateRandomCharacters(15);

    const operation = prisma.user.create({
      data: {
        id,
        email: `${characters}@email.com`,
        name: `user ${characters}`,
        description: `${characters} description`,
        password: await hash('123456', 10),
        imageUrl: `user ${characters} photo`,
      },
    });

    simulateDatabase.push(operation);
  }
  return simulateDatabase;
};

async function run() {
  await prisma.user.deleteMany();

  const userPackQueries = [];

  for (let i = 0; i < 3; i++) {
    userPackQueries.push(launchUsers());
  }

  for await (const userPackQuery of userPackQueries) {
    await Promise.all(userPackQuery);
  }
}

run()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (err) => {
    logger.error(err);
    await prisma.$disconnect();
    process.exit(1);
  });
