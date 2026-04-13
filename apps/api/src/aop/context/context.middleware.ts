import { ForbiddenException, UnauthorizedException } from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';
import { v4 as uuidv4 } from 'uuid';

import { ErrorReporter } from '../observability/error-reporter';
import { Logger } from '../observability/logger';
import { AdminContextImpl, CustomerContextImpl, UserContextImpl, PublicContextImpl } from './context.class';

export const createCustomerContext = (request: Request, response: Response, next: NextFunction): void => {
  let traceId;

  try {
    traceId = request.headers['x-trace-id'] as string;
    const currentUser = response.locals?.user ?? {};
    const companyId = currentUser?.companyId;

    if (!currentUser) {
      throw new UnauthorizedException('Unknown user');
    }

    if (!companyId) {
      throw new ForbiddenException('Unknown company in CustomerContext');
    }

    request.context = new CustomerContextImpl(traceId || uuidv4(), companyId, currentUser);
  } catch (error: unknown) {
    const logger = new Logger(false, traceId || uuidv4());
    const errorReporter = new ErrorReporter(false, traceId || uuidv4());

    logger.error(String(error));
    errorReporter.report();
  } finally {
    next();
  }
};

export const createUserContext = (request: Request, response: Response, next: NextFunction): void => {
  let traceId;

  try {
    traceId = request.headers['x-trace-id'] as string;
    const currentUser = response.locals?.user ?? {};

    if (!currentUser) {
      throw new UnauthorizedException('Unknown user');
    }

    request.context = new UserContextImpl(traceId || uuidv4(), currentUser);
  } catch (error: unknown) {
    const logger = new Logger(false, traceId || uuidv4());
    const errorReporter = new ErrorReporter(false, traceId || uuidv4());

    logger.error(String(error));
    errorReporter.report();
  } finally {
    next();
  }
};

export const createPublicContext = (request: Request, response: Response, next: NextFunction): void => {
  let traceId;

  try {
    traceId = request.headers['x-trace-id'] as string;
    const currentUser = response.locals?.user ?? null;

    // For public endpoints, we create a context even without a user
    request.context = new PublicContextImpl(traceId || uuidv4(), currentUser);
  } catch (error: unknown) {
    const logger = new Logger(false, traceId || uuidv4());
    const errorReporter = new ErrorReporter(false, traceId || uuidv4());

    logger.error(String(error));
    errorReporter.report();
  } finally {
    next();
  }
};

export const createAdminContext = (request: Request, response: Response, next: NextFunction): void => {
  let traceId;

  try {
    traceId = request.headers['x-trace-id'] as string;
    const adminUser = response.locals?.user ?? {};

    if (!adminUser) {
      throw new UnauthorizedException('No admin user');
    }

    request.context = new AdminContextImpl(traceId || uuidv4(), adminUser);
  } catch (error: unknown) {
    const logger = new Logger(true, traceId || uuidv4());
    const errorReporter = new ErrorReporter(true, traceId || uuidv4());

    logger.error(String(error));
    errorReporter.report();
  } finally {
    next();
  }
};
