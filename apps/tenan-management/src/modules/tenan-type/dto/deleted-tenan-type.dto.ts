import { IsString, IsNotEmpty } from 'class-validator';
import { Transform } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export class DestroyTypeDto {
  @ApiProperty({
    type: 'string',
    example: 'd12345',
    description: 'Unique identifier for the type',
  })
  @IsNotEmpty()
  @IsString()
  id: string;
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
