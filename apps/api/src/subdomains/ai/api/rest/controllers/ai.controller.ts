import { Controller, UseGuards } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { AuthGuard } from '../../../../../aop/authentication/guards/auth.guard';
import { RolesGuard } from '../../../../../aop/authentication/guards/roles.guard';

@ApiTags('AI')
@UseGuards(AuthGuard, RolesGuard)
@Controller('ai')
export class AiController {
  constructor() {}
}
