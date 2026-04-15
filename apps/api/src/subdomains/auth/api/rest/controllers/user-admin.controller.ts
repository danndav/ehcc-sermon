import { Controller, Get, Param, Post, Patch, Query, Body, UseGuards, ParseIntPipe } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiParam, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from '../../../../../aop/authentication/guards/auth.guard';
import { RolesGuard } from '../../../../../aop/authentication/guards/roles.guard';
import { Roles } from '../../../../../aop/authentication/decorators/roles.decorator';
import { RoleEnum, DATA_ROLES, SYSTEM_ROLES } from '../../../domain/enums/role.enum';
import { UserAdminService } from '../../../application/services/user-admin.service';

@ApiTags('Admin — Users')
@ApiBearerAuth()
@Controller('admin/users')
@UseGuards(AuthGuard, RolesGuard)
@Roles(...DATA_ROLES)
export class UserAdminController {
  constructor(private readonly userAdminService: UserAdminService) {}

  @Get()
  @ApiOperation({ summary: 'List all users (paginated, searchable)' })
  @ApiQuery({ name: 'page', required: false })
  @ApiQuery({ name: 'limit', required: false })
  @ApiQuery({ name: 'search', required: false })
  @ApiQuery({ name: 'role', required: false })
  @ApiResponse({ status: 200, description: 'Paginated list of users' })
  async listUsers(
    @Query('page') page = 1,
    @Query('limit') limit = 20,
    @Query('search') search?: string,
    @Query('role') role?: string,
  ) {
    return this.userAdminService.listUsers(Number(page), Number(limit), {
      search: search || undefined,
      role: role && role !== 'all' ? role : undefined,
    });
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get user details' })
  @ApiParam({ name: 'id', description: 'User ID' })
  async getUserById(@Param('id', ParseIntPipe) id: number) {
    return this.userAdminService.getUserById(id);
  }

  @Patch(':id/role')
  @Roles(...SYSTEM_ROLES)
  @ApiOperation({ summary: 'Change user role (super admin only)' })
  async updateRole(@Param('id', ParseIntPipe) id: number, @Body() body: { role: RoleEnum }) {
    return this.userAdminService.updateRole(id, body.role);
  }

  @Post('set-role-by-ea')
  @Roles(...SYSTEM_ROLES)
  @ApiOperation({ summary: 'Set user role by EA number (super admin only)' })
  async setRoleByEaNumber(@Body() body: { eaNumber: string; role: RoleEnum }) {
    return this.userAdminService.setRoleByEaNumber(body.eaNumber, body.role);
  }

  @Post(':id/suspend')
  @Roles(...SYSTEM_ROLES)
  @ApiOperation({ summary: 'Suspend a user account (super admin only)' })
  async suspendUser(@Param('id', ParseIntPipe) id: number) {
    return this.userAdminService.suspendUser(id);
  }

  @Post(':id/unsuspend')
  @Roles(...SYSTEM_ROLES)
  @ApiOperation({ summary: 'Unsuspend a user account (super admin only)' })
  async unsuspendUser(@Param('id', ParseIntPipe) id: number) {
    return this.userAdminService.unsuspendUser(id);
  }
}
