import { IsEnum, IsNotEmpty, IsOptional, IsString, IsNumber } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { NoteProgrammeTypeEnum } from '../../../../domain/enums/note-programme-type.enum';

export class CreateTypedServiceNoteDto {
  @ApiProperty({ enum: NoteProgrammeTypeEnum })
  @IsEnum(NoteProgrammeTypeEnum)
  programmeType: NoteProgrammeTypeEnum;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  specialProgrammeName?: string;

  @ApiProperty({ description: 'Service date in YYYY-MM-DD format' })
  @IsNotEmpty()
  @IsString()
  serviceDate: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  typedContent: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsNumber()
  branchId?: number;
}
