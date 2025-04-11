import { IsString, IsNotEmpty, IsOptional } from 'class-validator';
import { Transform } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export class CreatedTypeDto {
  @ApiProperty({
    type: 'string',
    example: 'TYPE S',
    description: 'The name of the type',
  })
  @IsNotEmpty()
  @Transform(({ value }) => value.trim().toUpperCase())
  @IsString()
  type: string;

  @ApiProperty({
    type: 'string',
    example: 'SS',
    description: 'The code of the type',
  })
  @IsNotEmpty()
  @Transform(({ value }) => value.trim().toUpperCase())
  @IsString()
  code: string;

  @ApiProperty({
    type: 'string',
    example: 'Class S',
    description: 'Optional alias for the type',
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
