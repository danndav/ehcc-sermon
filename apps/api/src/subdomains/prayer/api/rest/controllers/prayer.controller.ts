import { Controller, UseGuards } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { AuthGuard } from '../../../../../aop/authentication/guards/auth.guard';
import { RolesGuard } from '../../../../../aop/authentication/guards/roles.guard';

@ApiTags('Prayer')
@UseGuards(AuthGuard, RolesGuard)
@Controller('prayer')
export class PrayerController {
  constructor() {}
}
