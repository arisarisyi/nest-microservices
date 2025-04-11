import { IsString, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class GetPositionsDto {
  @ApiProperty({
    type: 'string',
    example: 'all',
    description: 'The name of the position',
  })
  @IsNotEmpty()
  @IsString()
  position: string;
}
