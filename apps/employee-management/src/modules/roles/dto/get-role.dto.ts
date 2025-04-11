import { IsInt, IsString, IsNotEmpty, Min, IsOptional } from 'class-validator';
import { Type, Transform } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export class GetRoleDto {
  @ApiProperty({
    type: 'string',
    example: 'TYPE A',
    description: 'The name of the type',
    required: false,
  })
  @IsOptional()
  @Transform(({ value }) => value.trim().toUpperCase())
  @IsString()
  type: string;

  @ApiProperty({
    type: 'string',
    example: 'OPERATOR',
    description: 'The name of the position',
    required: false,
  })
  @IsOptional()
  @IsString()
  position: string;

  @ApiProperty({
    type: 'string',
    example: 'PRODUCTION',
    description: 'The name of the division',
    required: false,
  })
  @IsOptional()
  @Transform(({ value }) => value.trim().toUpperCase())
  @IsString()
  division: string;

  @ApiProperty({
    type: 'string',
    example: 'PRODUCTION',
    description: 'The name of the department',
    required: false,
  })
  @IsOptional()
  @Transform(({ value }) => value.trim().toUpperCase())
  @IsString()
  department: string;

  @ApiProperty({
    type: 'number',
    example: 1,
    description: 'Page number, minimum value is 1',
    required: true,
  })
  @IsNotEmpty()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page?: number;

  @ApiProperty({
    type: 'number',
    example: 10,
    description: 'Limit per page, minimum value is 1',
    required: true,
  })
  @IsNotEmpty()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  limit?: number;
}
