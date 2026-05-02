import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import { createServer } from 'http';
import { Server as SocketIOServer } from 'socket.io';
import type { Express } from 'express';

import { logger } from './utils/logger.js';
import { errorHandler } from './middleware/errorHandler.js';
import { tenantMiddleware } from './middleware/tenant.js';
import { authMiddleware } from './middleware/auth.js';
import { corsConfig } from './config/cors.js';

// Routes
import authRoutes from './routes/auth.routes.js';
import productRoutes from './routes/products.routes.js';
import stockRoutes from './routes/stocks.routes.js';
import transactionRoutes from './routes/transactions.routes.js';
import recipeRoutes from './routes/recipes.routes.js';
import userRoutes from './routes/users.routes.js';
import tenantRoutes from './routes/tenants.routes.js';
import reportsRoutes from './routes/reports.routes.js';
import adminRoutes from './routes/admin.routes.js';

export function createApp(): Express {
  const app = express();

  // Trust proxy - for deployment behind reverse proxy
  app.set('trust proxy', 1);

  // Security Middleware
  app.use(helmet());
  app.use(cors(corsConfig));

  // Logging Middleware
  app.use(morgan('combined', { stream: { write: (msg) => logger.info(msg) } }));

  // Body Parser Middleware
  app.use(express.json({ limit: '10mb' }));
  app.use(express.urlencoded({ limit: '10mb', extended: true }));

  // Health Check Endpoint
  app.get('/health', (req, res) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
  });

  // API Version Info
  app.get('/api/version', (req, res) => {
    res.json({
      version: process.env.APP_VERSION || '1.0.0',
      name: process.env.APP_NAME || 'Postaco',
      environment: process.env.NODE_ENV || 'development'
    });
  });

  // API Routes
  const apiRouter = express.Router();

  // Public Routes (no auth required)
  apiRouter.use('/auth', authRoutes);

  // Protected Routes (auth required)
  apiRouter.use(authMiddleware);

  // Tenant Context Middleware
  apiRouter.use(tenantMiddleware);

  // Protected API Routes
  apiRouter.use('/products', productRoutes);
  apiRouter.use('/stocks', stockRoutes);
  apiRouter.use('/transactions', transactionRoutes);
  apiRouter.use('/recipes', recipeRoutes);
  apiRouter.use('/users', userRoutes);
  apiRouter.use('/reports', reportsRoutes);

  // Admin Routes
  apiRouter.use('/admin', adminRoutes);

  // Tenant Routes (for owner/admin)
  apiRouter.use('/tenants', tenantRoutes);

  // Register API Router
  app.use('/api', apiRouter);

  // 404 Handler
  app.use((req, res) => {
    res.status(404).json({
      success: false,
      message: 'Route not found',
      path: req.path,
      method: req.method
    });
  });

  // Error Handler (must be last)
  app.use(errorHandler);

  return app;
}

export function attachWebSocket(httpServer: ReturnType<typeof createServer>): SocketIOServer {
  const io = new SocketIOServer(httpServer, {
    cors: corsConfig,
    transports: ['websocket', 'polling']
  });

  // Middleware for Socket.io authentication
  io.use((socket, next) => {
    const token = socket.handshake.auth.token;
    if (!token) {
      return next(new Error('Authentication required'));
    }
    // Verify token here
    next();
  });

  // Connection Handler
  io.on('connection', (socket) => {
    logger.info(`Client connected: ${socket.id}`);

    // Join tenant room
    socket.on('join-tenant', (tenantId: string) => {
      socket.join(`tenant:${tenantId}`);
      logger.info(`Socket ${socket.id} joined tenant ${tenantId}`);
    });

    // Disconnect Handler
    socket.on('disconnect', () => {
      logger.info(`Client disconnected: ${socket.id}`);
    });
  });

  return io;
}
