import { ApiProperty } from '@nestjs/swagger';

export class BranchOutputDto {
  @ApiProperty({ example: 1 })
  id: number;

  @ApiProperty({ example: 'HQ' })
  code: string | null;

  @ApiProperty({ example: 'Enthronement Assembly Headquarters' })
  name: string | null;

  @ApiProperty({ example: 'Lagos Mainland, Nigeria' })
  location: string | null;

  @ApiProperty({ example: 'Nigeria' })
  country: string | null;

  @ApiProperty({ example: 'Lagos', nullable: true })
  state: string | null;

  @ApiProperty({ example: 'Lagos Mainland', nullable: true })
  city: string | null;

  @ApiProperty({ example: true })
  isActive: boolean;
}
