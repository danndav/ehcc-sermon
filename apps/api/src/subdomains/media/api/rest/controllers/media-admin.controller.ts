import { Controller, UseGuards } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { AuthGuard } from '../../../../../aop/authentication/guards/auth.guard';
import { RolesGuard } from '../../../../../aop/authentication/guards/roles.guard';
import { Roles } from '../../../../../aop/authentication/decorators/roles.decorator';
import { RoleEnum } from '../../../../auth/domain/enums/role.enum';

@ApiTags('Admin / Media')
@UseGuards(AuthGuard, RolesGuard)
@Roles(RoleEnum.ADMIN)
@Controller('admin/media')
export class MediaAdminController {
  constructor() {}
}
