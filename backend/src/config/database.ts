import { PrismaClient } from '@prisma/client';
import { logger } from '../utils/logger.js';

// Create Prisma Client with logging
const prisma = new PrismaClient({
  log: [
    { emit: 'event', level: 'query' },
    { emit: 'event', level: 'error' },
    { emit: 'event', level: 'warn' }
  ]
});

// Event Listeners
prisma.$on('query', (e: any) => {
  if (process.env.LOG_LEVEL === 'debug') {
    logger.debug(`Query: ${e.query}`);
    logger.debug(`Params: ${e.params}`);
    logger.debug(`Duration: ${e.duration}ms`);
  }
});

prisma.$on('error', (e: any) => {
  logger.error('Database error:', e);
});

prisma.$on('warn', (e: any) => {
  logger.warn('Database warning:', e);
});

export { prisma };
