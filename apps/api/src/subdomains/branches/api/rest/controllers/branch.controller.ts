import { Controller, Get, Param, ParseIntPipe } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Public } from '../../../../../aop/constants';
import { BranchService } from '../../../application/services/branch.service';
import { BranchOutputDto } from '../dto/output/branch.output.dto';

@ApiTags('Branches')
@Controller('branches')
export class BranchController {
  constructor(private readonly branchService: BranchService) {}

  @Public()
  @Get()
  @ApiOperation({ summary: 'Get all active branches' })
  @ApiResponse({ status: 200, type: [BranchOutputDto] })
  async findAll(): Promise<BranchOutputDto[]> {
    return this.branchService.findAll();
  }

  @Public()
  @Get(':id')
  @ApiOperation({ summary: 'Get a branch by ID' })
  @ApiResponse({ status: 200, type: BranchOutputDto })
  async findById(@Param('id', ParseIntPipe) id: number): Promise<BranchOutputDto> {
    return this.branchService.findById(id);
  }
}
