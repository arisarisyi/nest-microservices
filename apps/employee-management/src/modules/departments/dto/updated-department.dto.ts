import { IsString, IsNotEmpty, IsOptional } from 'class-validator';
import { Transform } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export class EditDepartmentDto {
  @ApiProperty({
    type: 'string',
    example: 'd12345',
    description: 'Unique identifier for the department',
  })
  @IsNotEmpty()
  @IsString()
  id: string;

  @ApiProperty({
    type: 'string',
    example: 'Human Resources',
    description: 'The name of the department',
  })
  @IsNotEmpty()
  @Transform(({ value }) => value.trim().toUpperCase())
  @IsString()
  department: string;

  @ApiProperty({
    type: 'string',
    example: 'HR',
    description: 'Optional alias for the department',
    required: false,
  })
  @IsOptional()
  @Transform(({ value }) => value.trim().toUpperCase())
  @IsString()
  alias: string;

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
