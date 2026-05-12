import { Request, Response, NextFunction } from 'express';
import { logger } from '../utils/logger.js';

declare global {
  namespace Express {
    interface Request {
      tenantId?: string;
    }
  }
}

export function tenantMiddleware(req: Request, res: Response, next: NextFunction) {
  try {
    // Get tenant ID from user (set by auth middleware)
    if (req.user?.tenantId) {
      req.tenantId = req.user.tenantId;
    }

    // Override with header if provided (for testing or specific cases)
    const tenantIdHeader = req.headers['x-tenant-id'] as string;
    if (tenantIdHeader) {
      // Validate that user belongs to this tenant
      if (req.user && req.user.tenantId !== tenantIdHeader) {
        logger.warn(
          `Tenant ID mismatch: user ${req.user.id} tried to access tenant ${tenantIdHeader}`
        );
        return res.status(403).json({
          success: false,
          message: 'Tenant access denied'
        });
      }
      req.tenantId = tenantIdHeader;
    }

    // Ensure tenant ID exists
    if (!req.tenantId) {
      return res.status(400).json({
        success: false,
        message: 'Tenant ID is required'
      });
    }

    return next();
  } catch (error) {
    logger.error('Tenant middleware error:', error);
    return res.status(500).json({
      success: false,
      message: 'Tenant middleware error'
    });
  }
}
