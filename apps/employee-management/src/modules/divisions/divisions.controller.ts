import {
  Controller,
  Query,
  Get,
  Put,
  Body,
  Post,
  Delete,
  UseInterceptors,
} from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { DivisionsService } from './divisions.service';
import { GetDivisionDto } from './dto/get-division.dto';
import { EditDivisionDto } from './dto/updated-division.dto';
import { CreatedDivisionDto } from './dto/created-division.dto';
import { DestroyDivisionDto } from './dto/deleted-division.dto';
import { ResponseInterceptor } from '../../common/interceptors/response.interceptor';

@ApiTags('Division')
@Controller('/divisions')
@UseInterceptors(ResponseInterceptor)
export class DivisionsController {
  constructor(private readonly divisionsService: DivisionsService) {}

  @Get('/list')
  @ApiOperation({
    description: 'API Division',
  })
  public async division(@Query() query: GetDivisionDto) {
    const { divisi } = query;
    const result = await this.divisionsService.getDivision(divisi);
    return result;
  }

  @Put('/edit')
  @ApiOperation({
    description: 'API Division Edit',
  })
  public async divisionEdit(@Body() body: EditDivisionDto) {
    const result = await this.divisionsService.updatedDivision(body);
    return result;
  }

  @Post('/new')
  @ApiOperation({
    description: 'API Division Created',
  })
  public async divisonCreated(@Body() body: CreatedDivisionDto) {
    const result = await this.divisionsService.createdDivision(body);
    return result;
  }

  @Delete('/destroy')
  @ApiOperation({
    description: 'API Division Remove',
  })
  public async divisionRemove(@Body() body: DestroyDivisionDto) {
    const result = await this.divisionsService.destroyDivision(body);
    return result;
  }
}
