import { Injectable, NestMiddleware, UnauthorizedException } from '@nestjs/common';
import { NextFunction, Response } from 'express';
import { Request as ExpressJwtRequest } from 'express-jwt';

import { IamService } from '../../../subdomains/auth/application/services/iam.service';

@Injectable()
export class ProcessCustomerRequestMiddleware implements NestMiddleware {
  constructor(private readonly iamService: IamService) {}

  async use(request: ExpressJwtRequest, response: Response, next: NextFunction): Promise<void> {
    const { decodedToken } = response.locals;

    if (!decodedToken) {
      next(new UnauthorizedException('Invalid Token'));
      return;
    }

    const { email, eaNumber, role } = decodedToken;

    let user = null;
    if (eaNumber) {
      user = await this.iamService.findUserByEaNumber(eaNumber);
    } else if (email) {
      user = await this.iamService.findUserByEmail(email);
    }

    if (!user) {
      throw new UnauthorizedException('User not found');
    }

    (request as any).user = { ...user, role };
    response.locals.user = { ...user, role };

    next();
  }
}
