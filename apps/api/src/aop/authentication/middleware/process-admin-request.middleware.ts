import { Injectable, InternalServerErrorException, NestMiddleware, UnauthorizedException } from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';
import { RoleEnum } from '../../../subdomains/auth/domain/enums/role.enum';
import { IamService } from '../../../subdomains/auth/application/services/iam.service';

@Injectable()
export class ProcessAdminRequestMiddleware implements NestMiddleware {
  constructor(private readonly iamService: IamService) {}

  async use(request: Request, response: Response, next: NextFunction): Promise<void> {
    const { decodedToken } = response.locals;

    if (!decodedToken) {
      next(new UnauthorizedException('Invalid Token'));
      return;
    }

    const { role} = decodedToken;

    const adminRoles = [RoleEnum.ADMIN];
    if(!adminRoles.includes(role)) {
      throw new UnauthorizedException('User is not an admin');
    }

    next();
  }
}
