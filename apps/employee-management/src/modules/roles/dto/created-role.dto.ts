import { IsString, IsNotEmpty } from 'class-validator';
import { Transform } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export class CreatedRoleDto {
  @ApiProperty({
    type: 'string',
    example: 'TYPE A',
    description: 'The name of the type',
  })
  @IsNotEmpty()
  @Transform(({ value }) => value.trim().toUpperCase())
  @IsString()
  type: string;

  @ApiProperty({
    type: 'string',
    example: 'ADMIN',
    description: 'The name of the position',
  })
  @IsNotEmpty()
  @Transform(({ value }) => value.trim().toUpperCase())
  @IsString()
  position: string;

  @ApiProperty({
    type: 'string',
    example: 'PRODUCTION',
    description: 'The name of the division',
  })
  @IsNotEmpty()
  @Transform(({ value }) => value.trim().toUpperCase())
  @IsString()
  division: string;

  @ApiProperty({
    type: 'string',
    example: 'HCGA',
    description: 'The name of the department',
  })
  @IsNotEmpty()
  @Transform(({ value }) => value.trim().toUpperCase())
  @IsString()
  department: string;

  @ApiProperty({
    type: 'string',
    example: 'CSR ADMIN',
    description: 'The name of the role',
  })
  @IsNotEmpty()
  @Transform(({ value }) => value.trim().toUpperCase())
  @IsString()
  role: string;

  @ApiProperty({
    type: 'string',
    example: '23007362',
    description: 'NRP Employee',
  })
  @IsNotEmpty()
  @Transform(({ value }) => value.trim().toUpperCase())
  @IsString()
  nrp: string;
}
