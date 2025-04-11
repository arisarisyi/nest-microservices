import { IsString, IsNotEmpty, IsOptional } from 'class-validator';
import { Transform } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export class CreatedDepartmentDto {
  @ApiProperty({
    type: 'string',
    example: 'HUMAN RESOURCES',
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
