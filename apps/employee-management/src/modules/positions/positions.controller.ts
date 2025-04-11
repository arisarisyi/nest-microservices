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
import { PositionsService } from './positions.service';
import { GetPositionsDto } from './dto/get-position.dto';
import { EditPositionDto } from './dto/updated-position.dto';
import { CreatedPositionDto } from './dto/created-position.dto';
import { DestroyPositionDto } from './dto/deleted-position.dto';
import { ResponseInterceptor } from '../../common/interceptors/response.interceptor';

@ApiTags('Position')
@Controller('/position')
@UseInterceptors(ResponseInterceptor)
export class PositionsController {
  constructor(private readonly positionService: PositionsService) {}

  @Get('/list')
  @ApiOperation({
    description: 'API Position',
  })
  public async position(@Query() query: GetPositionsDto) {
    const { position } = query;
    const resutl = await this.positionService.getPosition(position);
    return resutl;
  }

  @Put('/edit')
  @ApiOperation({
    description: 'API Position Edit',
  })
  public async positionEdit(@Body() body: EditPositionDto) {
    const result = await this.positionService.updatePosition(body);
    return result;
  }

  @Post('/new')
  @ApiOperation({
    description: 'API Position Created',
  })
  public async positionCreated(@Body() body: CreatedPositionDto) {
    const result = await this.positionService.createdPosition(body);
    return result;
  }

  @Delete('/destroy')
  @ApiOperation({
    description: 'API Position Remove',
  })
  public async positionRemove(@Body() body: DestroyPositionDto) {
    const result = await this.positionService.destroyPosition(body);
    return result;
  }
}
