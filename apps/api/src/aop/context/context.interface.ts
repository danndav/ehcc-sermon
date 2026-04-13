import { UserReadModel } from '../../subdomains/auth/domain/read-models/user.read-model';
import { ErrorReporter } from '../observability/error-reporter';
import { Logger } from '../observability/logger';

declare global {
  namespace Express {
    interface Request {
      context: CustomerContext | AdminContext | PublicContext | UserContext;
    }
  }
}

export interface CustomerContext {
  traceId: string;
  customerId: string;
  currentUser: UserReadModel;
  errorReporter: ErrorReporter;
  logger: Logger;

  data(): Record<string, unknown>;
}

export interface UserContext {
  traceId: string;
  currentUser: UserReadModel;
  errorReporter: ErrorReporter;
  logger: Logger;

  data(): Record<string, unknown>;
}

export interface PublicContext {
  traceId: string;
  currentUser: UserReadModel | null;
  errorReporter: ErrorReporter;
  logger: Logger;

  data(): Record<string, unknown>;
}

export interface AdminContext {
  traceId: string;
  currentUser: UserReadModel;
  errorReporter: ErrorReporter;
  logger: Logger;

  data(): Record<string, unknown>;
}

export interface CustomerEventContext {
  traceId?: string;
  customerId: string;
  userId: string;
}

export interface AdminEventContext {
  traceId: string;
  userId: string;
}
