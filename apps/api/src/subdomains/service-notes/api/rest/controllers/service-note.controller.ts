import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Query,
  Req,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiConsumes, ApiOperation, ApiQuery, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from '../../../../../aop/authentication/guards/auth.guard';
import { RolesGuard } from '../../../../../aop/authentication/guards/roles.guard';
import { Roles } from '../../../../../aop/authentication/decorators/roles.decorator';
import { WORKER_ROLES } from '../../../../auth/domain/enums/role.enum';
import { ServiceNoteService } from '../../../application/services/service-note.service';
import { CreateTypedServiceNoteDto } from '../dto/input/create-service-note.dto';
import { NoteProgrammeTypeEnum } from '../../../domain/enums/note-programme-type.enum';
import { Request } from 'express';

@ApiTags('Service Notes')
@UseGuards(AuthGuard, RolesGuard)
@Roles(...WORKER_ROLES)
@Controller('service-notes')
export class ServiceNoteController {
  constructor(private readonly service: ServiceNoteService) {}

  @Post()
  @ApiOperation({ summary: 'Submit a typed service note' })
  async submitTyped(@Body() dto: CreateTypedServiceNoteDto, @Req() req: Request) {
    const userId = (req as any).context?.currentUser?.id;
    const branchId = (req as any).context?.currentUser?.branchId;
    return this.service.submitTypedNote(userId, {
      ...dto,
      branchId: dto.branchId || branchId || undefined,
    });
  }

  @Post('upload')
  @ApiOperation({ summary: 'Submit a service note with file upload' })
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(FileInterceptor('file'))
  async submitUpload(
    @UploadedFile() file: Express.Multer.File,
    @Body() body: { programmeType: string; specialProgrammeName?: string; serviceDate: string; branchId?: string },
    @Req() req: Request,
  ) {
    const userId = (req as any).context?.currentUser?.id;
    const userBranchId = (req as any).context?.currentUser?.branchId;
    return this.service.submitUploadNote(
      userId,
      {
        programmeType: body.programmeType as NoteProgrammeTypeEnum,
        specialProgrammeName: body.specialProgrammeName,
        serviceDate: body.serviceDate,
        branchId: body.branchId ? Number(body.branchId) : userBranchId || undefined,
      },
      {
        buffer: file.buffer,
        originalname: file.originalname,
        mimetype: file.mimetype,
        size: file.size,
      },
    );
  }

  @Get('my')
  @ApiOperation({ summary: 'Get my submissions (paginated)' })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  async getMySubmissions(
    @Req() req: Request,
    @Query('page') page?: string,
    @Query('limit') limit?: string,
  ) {
    const userId = (req as any).context?.currentUser?.id;
    return this.service.getMySubmissions(userId, {
      page: page ? Number(page) : undefined,
      limit: limit ? Number(limit) : undefined,
    });
  }

  @Get('my/current-week')
  @ApiOperation({ summary: 'Get my submissions for the current week' })
  async getMyCurrentWeek(@Req() req: Request) {
    const userId = (req as any).context?.currentUser?.id;
    return this.service.getMyCurrentWeek(userId);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete my submission' })
  async deleteMySubmission(@Param('id') id: string, @Req() req: Request) {
    const userId = (req as any).context?.currentUser?.id;
    await this.service.deleteMySubmission(id, userId);
    return { deleted: true };
  }
}
