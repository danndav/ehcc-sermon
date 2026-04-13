import { Controller, UseGuards } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { AuthGuard } from '../../../../../aop/authentication/guards/auth.guard';
import { RolesGuard } from '../../../../../aop/authentication/guards/roles.guard';

@ApiTags('Subscriptions')
@UseGuards(AuthGuard, RolesGuard)
@Controller('subscriptions')
export class SubscriptionController {
  constructor() {}
}
