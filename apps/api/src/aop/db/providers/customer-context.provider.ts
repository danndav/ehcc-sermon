import { REQUEST } from '@nestjs/core';
import type { Request } from 'express';

import { CustomerContext } from '../../context/context.interface';

export const customerContextProvider = {
  inject: [REQUEST],
  provide: 'BASE_CUSTOMER_REPOSITORY_CONTEXT',
  useFactory: (req: Request) => {
    const { context } = req;

    if (!context) {
      throw new Error('Context not set for base repository');
    }

    return context as CustomerContext;
  },
};
