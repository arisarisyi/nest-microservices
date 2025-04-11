import { IsString, IsNotEmpty, IsOptional } from 'class-validator';
import { Transform } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export class EditDivisionDto {
  @ApiProperty({
    type: 'string',
    example: 'd12345',
    description: 'Unique identifier for the division',
  })
  @IsNotEmpty()
  @IsString()
  id: string;

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
    example: 'PRO',
    description: 'Optional alias for the division',
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
