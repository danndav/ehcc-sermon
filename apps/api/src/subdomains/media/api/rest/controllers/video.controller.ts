import { Controller, Get, Param, Req, UseGuards } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from '../../../../../aop/authentication/guards/auth.guard';
import { RolesGuard } from '../../../../../aop/authentication/guards/roles.guard';
import { Public } from '../../../../../aop/constants';
import { VideoStreamService } from '../../../application/services/video-stream.service';
import { VideoUploadService } from '../../../application/services/video-upload.service';
import { Request } from 'express';
import { RoleEnum } from '../../../../auth/domain/enums/role.enum';

@ApiTags('Videos')
@UseGuards(AuthGuard, RolesGuard)
@Controller('videos')
export class VideoController {
  constructor(
    private readonly streamService: VideoStreamService,
    private readonly uploadService: VideoUploadService,
  ) {}

  @Get(':sermonId/stream')
  @ApiOperation({ summary: 'Get stream URL for a sermon video (signed for paid, public for free)' })
  async getStreamUrl(
    @Param('sermonId') sermonId: string,
    @Req() req: Request,
  ) {
    const user = (req as any).context?.currentUser;
    const isSubscriber = user?.role === RoleEnum.SUBSCRIBER || user?.role === RoleEnum.ADMIN;

    // We need to know if the sermon is free — in a real flow the controller
    // would look up the sermon. For now, we pass isFree from query or default to true.
    const isFree = (req.query as any).isFree === 'true';

    return this.streamService.getStreamUrl(sermonId, { isFree, isSubscriber });
  }

  @Get(':sermonId/status')
  @ApiOperation({ summary: 'Get video transcoding status' })
  async getStatus(@Param('sermonId') sermonId: string) {
    return this.uploadService.getStatus(sermonId);
  }

  @Get(':sermonId/thumbnail')
  @Public()
  @ApiOperation({ summary: 'Get thumbnail URL for a sermon' })
  async getThumbnail(@Param('sermonId') sermonId: string) {
    const url = await this.streamService.getThumbnailUrl(sermonId);
    return { url };
  }
}
