import { UserReadModel } from '../../subdomains/auth/domain/read-models/user.read-model';
import { ErrorReporter } from '../observability/error-reporter';
import { Logger } from '../observability/logger';
import { AdminContext as IAdminContext, CustomerContext as IContext, UserContext, PublicContext } from './context.interface';

export class CustomerContextImpl implements IContext {
  readonly traceId: string;

  readonly customerId: string;

  readonly currentUser: UserReadModel;

  readonly errorReporter: ErrorReporter;

  readonly logger: Logger;

  constructor(traceId: string, companyId: string, currentUser: UserReadModel) {
    this.traceId = traceId;
    this.customerId = companyId;
    this.currentUser = currentUser;
    this.errorReporter = new ErrorReporter(false, traceId);
    this.logger = new Logger(false, traceId, {
      companyId,
      currentUserId: currentUser.id,
    });
  }

  data(): Record<string, unknown> {
    return {
      customerId: this.customerId,
      isAdmin: false,
      traceId: this.traceId,
      userId: this.currentUser.id,
    };
  }
}


export class UserContextImpl implements UserContext {
  readonly traceId: string;

  readonly currentUser: UserReadModel;

  readonly errorReporter: ErrorReporter;

  readonly logger: Logger;

  constructor(traceId: string, currentUser: UserReadModel) {
    this.traceId = traceId;
    this.currentUser = currentUser;
    this.errorReporter = new ErrorReporter(false, traceId);
    this.logger = new Logger(false, traceId, {
      currentUserId: currentUser.id,
    });
  }

  data(): Record<string, unknown> {
    return {
      isAdmin: false,
      traceId: this.traceId,
      userId: this.currentUser.id,
    };
  }
}

export class PublicContextImpl implements PublicContext {
  readonly traceId: string;

  readonly currentUser: UserReadModel | null;

  readonly errorReporter: ErrorReporter;

  readonly logger: Logger;

  constructor(traceId: string, currentUser: UserReadModel | null) {
    this.traceId = traceId;
    this.currentUser = currentUser;
    this.errorReporter = new ErrorReporter(false, traceId);
    this.logger = new Logger(false, traceId, {
      currentUserId: currentUser?.id || 'anonymous',
    });
  }

  data(): Record<string, unknown> {
    return {
      isAdmin: false,
      traceId: this.traceId,
      userId: this.currentUser?.id || null,
    };
  }
}

export class AdminContextImpl implements IAdminContext {
  readonly traceId: string;

  readonly currentUser: UserReadModel;

  readonly errorReporter: ErrorReporter;

  readonly logger: Logger;

  constructor(traceId: string, currentUser: UserReadModel) {
    this.traceId = traceId;
    this.currentUser = currentUser;
    this.errorReporter = new ErrorReporter(true, traceId);
    this.logger = new Logger(true, traceId, {
      currentUserId: currentUser.id,
    });
  }

  data(): Record<string, unknown> {
    return {
      isAdmin: true,
      traceId: this.traceId,
      userId: this.currentUser.id,
    };
  }
}
