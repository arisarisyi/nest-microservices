import { IsString, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class GetTenanTypeDto {
  @ApiProperty({ type: 'string' })
  @IsNotEmpty()
  @IsString()
  type: string;
}
