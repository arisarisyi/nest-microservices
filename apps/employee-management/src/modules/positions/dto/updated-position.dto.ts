import { IsString, IsNotEmpty, IsOptional } from 'class-validator';
import { Transform } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export class EditPositionDto {
  @ApiProperty({
    type: 'string',
    example: 'd12345',
    description: 'Unique identifier for the position',
  })
  @IsNotEmpty()
  @IsString()
  id: string;

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
    example: 'ADM',
    description: 'Optional alias for the position',
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
