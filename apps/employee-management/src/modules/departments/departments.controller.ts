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
import { DepartmentsService } from './departments.service';
import { GetDeptDto } from './dto/get-department.dto';
import { EditDepartmentDto } from './dto/updated-department.dto';
import { CreatedDepartmentDto } from './dto/created-department.dto';
import { DestroyDepartmentDto } from './dto/delated-department.dto';
import { ResponseInterceptor } from '../../common/interceptors/response.interceptor';

@ApiTags('Department')
@Controller('/department')
@UseInterceptors(ResponseInterceptor)
export class DepartmentsController {
  constructor(private readonly depertmentService: DepartmentsService) {}

  @Get('/list')
  @ApiOperation({
    description: 'API Department List',
  })
  public async department(@Query() query: GetDeptDto) {
    const { dept } = query;
    const result = await this.depertmentService.getDepartment(dept);
    return result;
  }

  @Put('/edit')
  @ApiOperation({
    description: 'API Department Edit',
  })
  public async departmentEdit(@Body() body: EditDepartmentDto) {
    const result = await this.depertmentService.updateDepartment(body);
    return result;
  }

  @Post('/new')
  @ApiOperation({
    description: 'API Department Created',
  })
  public async departmentCreated(@Body() body: CreatedDepartmentDto) {
    const result = await this.depertmentService.createdDepartment(body);
    return result;
  }

  @Delete('/destroy')
  @ApiOperation({
    description: 'API Department Remove',
  })
  public async departmentRemove(@Body() body: DestroyDepartmentDto) {
    const result = await this.depertmentService.destroyDeparment(body);
    return result;
  }
}
