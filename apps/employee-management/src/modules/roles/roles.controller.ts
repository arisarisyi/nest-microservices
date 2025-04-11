import {
  Body,
  Controller,
  Delete,
  Get,
  Post,
  Put,
  Query,
  UseInterceptors,
} from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { RolesService } from './roles.service';
import { GetRoleDto } from './dto/get-role.dto';
import { EditRoleDto } from './dto/updated-role.dto';
import { CreatedRoleDto } from './dto/created-role.dto';
import { DestroyRoleDto } from './dto/deleted-role.dto';
import { ResponseInterceptor } from '../../common/interceptors/response.interceptor';

@ApiTags('Role')
@Controller('/role')
@UseInterceptors(ResponseInterceptor)
export class RolesController {
  constructor(private readonly rolesService: RolesService) {}

  @Get('/list')
  @ApiOperation({
    description: 'API Role List',
  })
  public async role(@Query() query: GetRoleDto) {
    const { page, limit, type, position, department, division } = query;
    const result = await this.rolesService.getRole(
      page,
      limit,
      type,
      position,
      department,
      division,
    );
    return result;
  }
  @Put('/edit')
  @ApiOperation({
    description: 'API Role Edit',
  })
  public async roleEdit(@Body() body: EditRoleDto) {
    const result = await this.rolesService.updatedRole(body);
    return result;
  }

  @Post('/new')
  @ApiOperation({
    description: 'API Role Created',
  })
  public async roleCreated(@Body() body: CreatedRoleDto) {
    const result = await this.rolesService.createdRole(body);
    return result;
  }

  @Delete('remove')
  @ApiOperation({
    description: 'API Role Remove',
  })
  public async roleRemove(@Body() body: DestroyRoleDto) {
    const result = await this.rolesService.destroyRole(body);
    return result;
  }
}
