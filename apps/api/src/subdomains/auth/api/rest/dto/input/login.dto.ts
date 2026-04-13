import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class LoginRequestDto {
  @ApiProperty({ example: 'john@example.com', description: 'Email or phone number' })
  @IsString()
  @IsNotEmpty()
  identifier: string;

  @ApiProperty({ example: 'securePass123' })
  @IsString()
  @IsNotEmpty()
  password: string;
}
