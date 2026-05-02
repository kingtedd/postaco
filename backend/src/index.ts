import { createServer } from 'http';
import dotenv from 'dotenv';
import { createApp, attachWebSocket } from './app.js';
import { logger } from './utils/logger.js';
import { prisma } from './config/database.js';

// Load environment variables
dotenv.config();

async function startServer() {
  try {
    const app = createApp();
    const httpServer = createServer(app);
    const io = attachWebSocket(httpServer);

    // Test database connection
    await prisma.$connect();
    logger.info('Database connected successfully');

    // Make io available to app
    app.locals.io = io;

    const PORT = process.env.PORT || 5000;
    const NODE_ENV = process.env.NODE_ENV || 'development';

    httpServer.listen(PORT, () => {
      logger.info(`
        ╔════════════════════════════════════════╗
        ║   Postaco API Server Started           ║
        ╠════════════════════════════════════════╣
        ║ Environment: ${NODE_ENV.padEnd(25)} ║
        ║ Port:       ${PORT.toString().padEnd(25)} ║
        ║ URL:        http://localhost:${PORT.toString().padEnd(18)} ║
        ╚════════════════════════════════════════╝
      `);
    });

    // Handle graceful shutdown
    process.on('SIGTERM', async () => {
      logger.info('SIGTERM received, shutting down gracefully...');
      httpServer.close(async () => {
        await prisma.$disconnect();
        process.exit(0);
      });
    });

    process.on('SIGINT', async () => {
      logger.info('SIGINT received, shutting down gracefully...');
      httpServer.close(async () => {
        await prisma.$disconnect();
        process.exit(0);
      });
    });
  } catch (error) {
    logger.error('Failed to start server:', error);
    process.exit(1);
  }
}

startServer();
