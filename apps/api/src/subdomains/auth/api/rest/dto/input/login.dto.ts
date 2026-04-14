import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsOptional, IsEmail, MinLength } from 'class-validator';

export class CheckIdentifierDto {
  @ApiProperty({ example: 'EA/0039 or john@example.com', description: 'EA number or email' })
  @IsString()
  @IsNotEmpty()
  identifier: string;
}

export class LoginDto {
  @ApiProperty({ example: 'EA/0039', description: 'EA number or email address' })
  @IsString()
  @IsNotEmpty()
  identifier: string;

  @ApiProperty({ example: 'mypassword123' })
  @IsString()
  @IsNotEmpty()
  password: string;
}

export class SetPasswordDto {
  @ApiProperty({ example: 'EA/0039', description: 'EA number or email to identify user' })
  @IsString()
  @IsNotEmpty()
  identifier: string;

  @ApiProperty({ example: 'mypassword123' })
  @IsString()
  @MinLength(6)
  password: string;

  @ApiProperty({ example: 'john@example.com', required: false, description: 'Optional email to add to account' })
  @IsOptional()
  @IsEmail()
  email?: string;
}

export class RegisterDto {
  @ApiProperty({ example: 'John Doe' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ example: 'john@example.com' })
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty({ example: 'mypassword123' })
  @IsString()
  @MinLength(6)
  password: string;
}
