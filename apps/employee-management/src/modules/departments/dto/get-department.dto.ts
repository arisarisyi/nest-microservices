import { IsString, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class GetDeptDto {
  @ApiProperty({ type: 'string' })
  @IsNotEmpty()
  @IsString()
  dept: string;
}
