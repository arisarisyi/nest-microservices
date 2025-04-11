import { IsString, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class GetDivisionDto {
  @ApiProperty({ type: 'string' })
  @IsNotEmpty()
  @IsString()
  divisi: string;
}
