import { Controller, Get, Param, Post, Patch, Query, Body, UseGuards } from '@nestjs/common';
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
  @ApiQuery({ name: 'page', required: false, description: 'Page number (default: 1)' })
  @ApiQuery({ name: 'limit', required: false, description: 'Items per page (default: 20)' })
  @ApiResponse({ status: 200, description: 'Paginated list of users' })
  async listUsers(@Query('page') page = 1, @Query('limit') limit = 20) {
    return this.userAdminService.listUsers(page, limit);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get user details' })
  @ApiParam({ name: 'id', description: 'User UUID' })
  @ApiResponse({ status: 200, description: 'User details returned' })
  @ApiResponse({ status: 404, description: 'User not found' })
  async getUserById(@Param('id') id: string) {
    return this.userAdminService.getUserById(id);
  }

  @Patch(':id/role')
  @ApiOperation({ summary: 'Change user role' })
  @ApiParam({ name: 'id', description: 'User UUID' })
  @ApiResponse({ status: 200, description: 'Role updated successfully' })
  @ApiResponse({ status: 404, description: 'User not found' })
  async updateRole(@Param('id') id: string, @Body() body: { role: RoleEnum }) {
    return this.userAdminService.updateRole(id, body.role);
  }

  @Post(':id/suspend')
  @ApiOperation({ summary: 'Suspend a user account' })
  @ApiParam({ name: 'id', description: 'User UUID' })
  @ApiResponse({ status: 201, description: 'User suspended successfully' })
  @ApiResponse({ status: 404, description: 'User not found' })
  async suspendUser(@Param('id') id: string) {
    return this.userAdminService.suspendUser(id);
  }

  @Post(':id/unsuspend')
  @ApiOperation({ summary: 'Unsuspend a user account' })
  @ApiParam({ name: 'id', description: 'User UUID' })
  @ApiResponse({ status: 201, description: 'User unsuspended successfully' })
  @ApiResponse({ status: 404, description: 'User not found' })
  async unsuspendUser(@Param('id') id: string) {
    return this.userAdminService.unsuspendUser(id);
  }
}
