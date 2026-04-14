import { Controller, Get, Param, Post, Patch, Query, Body, UseGuards, ParseIntPipe } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiParam, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from '../../../../../aop/authentication/guards/auth.guard';
import { RolesGuard } from '../../../../../aop/authentication/guards/roles.guard';
import { Roles } from '../../../../../aop/authentication/decorators/roles.decorator';
import { RoleEnum } from '../../../domain/enums/role.enum';
import { UserAdminService } from '../../../application/services/user-admin.service';

@ApiTags('Admin — Users')
@ApiBearerAuth()
@Controller('admin/users')
@UseGuards(AuthGuard, RolesGuard)
@Roles(RoleEnum.ADMIN)
export class UserAdminController {
  constructor(private readonly userAdminService: UserAdminService) {}

  @Get()
  @ApiOperation({ summary: 'List all users (paginated)' })
  @ApiQuery({ name: 'page', required: false })
  @ApiQuery({ name: 'limit', required: false })
  @ApiResponse({ status: 200, description: 'Paginated list of users' })
  async listUsers(@Query('page') page = 1, @Query('limit') limit = 20) {
    return this.userAdminService.listUsers(page, limit);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get user details' })
  @ApiParam({ name: 'id', description: 'User ID' })
  async getUserById(@Param('id', ParseIntPipe) id: number) {
    return this.userAdminService.getUserById(id);
  }

  @Patch(':id/role')
  @ApiOperation({ summary: 'Change user role' })
  async updateRole(@Param('id', ParseIntPipe) id: number, @Body() body: { role: RoleEnum }) {
    return this.userAdminService.updateRole(id, body.role);
  }

  @Post(':id/suspend')
  @ApiOperation({ summary: 'Suspend a user account' })
  async suspendUser(@Param('id', ParseIntPipe) id: number) {
    return this.userAdminService.suspendUser(id);
  }

  @Post(':id/unsuspend')
  @ApiOperation({ summary: 'Unsuspend a user account' })
  async unsuspendUser(@Param('id', ParseIntPipe) id: number) {
    return this.userAdminService.unsuspendUser(id);
  }
}
