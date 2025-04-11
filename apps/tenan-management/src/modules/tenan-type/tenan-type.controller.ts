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
import { TenanTypeService } from './tenan-type.service';
import { GetTenanTypeDto } from './dto/get-tenan-type.dto';
import { EditTypeDto } from './dto/updated-tenan-type.dto';
import { CreatedTypeDto } from './dto/created-tenan-type.dto';
import { DestroyTypeDto } from './dto/deleted-tenan-type.dto';
import { ResponseInterceptor } from '../../common/interceptors/response.interceptor';

@ApiTags('Tenan Type')
@Controller('/tenan-type')
@UseInterceptors(ResponseInterceptor)
export class TenanTypeController {
  constructor(private readonly tenanTypeService: TenanTypeService) {}

  @Get('/list')
  @ApiOperation({
    description: 'API Tenan Type',
  })
  public async tenanType(@Query() query: GetTenanTypeDto) {
    const { type } = query;
    const result = await this.tenanTypeService.getTenanType(type);
    return result;
  }

  @Get('/all-list')
  @ApiOperation({
    description: 'API Tenan All Type',
  })
  public async allType() {
    const result = await this.tenanTypeService.getAllType();
    return result;
  }

  @Put('/edit')
  @ApiOperation({
    description: 'API Tenan Type Edit',
  })
  public async tenanTypeEdit(@Body() body: EditTypeDto) {
    const result = await this.tenanTypeService.updateTenanType(body);
    return result;
  }

  @Post('/new')
  @ApiOperation({
    description: 'API Tenan Type Created',
  })
  public async tananTypeCreated(@Body() body: CreatedTypeDto) {
    const result = await this.tenanTypeService.createdTenanType(body);
    return result;
  }

  @Delete('/destroy')
  @ApiOperation({
    description: 'API Tenan Type Remove',
  })
  public async tenanTypeRemove(@Body() body: DestroyTypeDto) {
    const result = await this.tenanTypeService.destroyTenanType(body);
    return result;
  }
}
