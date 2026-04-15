import { Body, Controller, Get, Param, ParseIntPipe, Patch, Post, UseGuards } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from '../../../../../aop/authentication/guards/auth.guard';
import { RolesGuard } from '../../../../../aop/authentication/guards/roles.guard';
import { Roles } from '../../../../../aop/authentication/decorators/roles.decorator';
import { RoleEnum } from '../../../../auth/domain/enums/role.enum';
import { BranchService } from '../../../application/services/branch.service';
import { CreateBranchInputDto } from '../dto/input/create-branch.input.dto';
import { UpdateBranchInputDto } from '../dto/input/update-branch.input.dto';

@ApiTags('Admin / Branches')
@UseGuards(AuthGuard, RolesGuard)
@Roles(RoleEnum.ADMIN)
@Controller('admin/branches')
export class BranchAdminController {
  constructor(private readonly branchService: BranchService) {}

  @Get()
  @ApiOperation({ summary: 'Get all branches (admin)' })
  async findAll() {
    return this.branchService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get branch by ID (admin)' })
  async findById(@Param('id', ParseIntPipe) id: number) {
    return this.branchService.findById(id);
  }

  @Post()
  @ApiOperation({ summary: 'Create a new branch' })
  async create(@Body() dto: CreateBranchInputDto) {
    return this.branchService.create(dto);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a branch' })
  async update(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateBranchInputDto) {
    return this.branchService.update(id, dto);
  }
}
