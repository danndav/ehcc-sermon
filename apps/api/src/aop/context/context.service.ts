import { ForbiddenException, MethodNotAllowedException, UnauthorizedException } from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';

import { UserReadModel } from '../../subdomains/auth/domain/read-models/user.read-model';
import { CustomerContextImpl } from './context.class';
import { AdminContext, CustomerContext as IContext, CustomerEventContext } from './context.interface';

const findUser = async (): Promise<UserReadModel | null> => {
  throw new MethodNotAllowedException('Not implemented'); // Move to iam-service
};

export class ContextService {
  static async recreateContextFromEvent(data: CustomerEventContext): Promise<IContext> {
    const { customerId, traceId, userId } = data;

    if (!customerId) {
      throw new ForbiddenException('Unknown company');
    }

    if (!userId) {
      throw new UnauthorizedException('Unknown user ID');
    }

    const currentUser = await findUser();

    if (!currentUser) {
      throw new UnauthorizedException('Unknown user');
    }

    const effectiveTraceId = traceId ?? uuidv4();

    return new CustomerContextImpl(effectiveTraceId, customerId, currentUser);
  }

  static recreateContextFromAdmin(adminContext: AdminContext, user: UserReadModel, companyId: string): IContext {
    return new CustomerContextImpl(adminContext.traceId ?? uuidv4(), companyId, user);
  }
}
