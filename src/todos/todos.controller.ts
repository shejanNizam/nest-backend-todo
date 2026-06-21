// src/todos/todos.controller.ts
import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { GetUser } from '../auth/decorators/get-user.decorator';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { ResponseMessage } from '../common/decorators/response-message.decorator';
import { CreateTodoDto } from './dto/create-todo.dto';
import { UpdateTodoDto } from './dto/update-todo.dto';
import { TodosService } from './todos.service';

@Controller('todos')
@UseGuards(JwtAuthGuard) // every route below now requires a valid token
export class TodosController {
  constructor(private todosService: TodosService) {}

  @Post()
  @ResponseMessage('Todo created successfully')
  create(@GetUser('userId') userId: string, @Body() dto: CreateTodoDto) {
    return this.todosService.create(userId, dto);
  }

  @Get()
  @ResponseMessage('Todos retrieved successfully')
  findAll(@GetUser('userId') userId: string) {
    return this.todosService.findAll(userId);
  }

  @Get(':id')
  @ResponseMessage('Todo retrieved successfully')
  findOne(@GetUser('userId') userId: string, @Param('id') id: string) {
    return this.todosService.findOne(userId, id);
  }

  @Patch(':id')
  @ResponseMessage('Todo updated successfully')
  update(
    @GetUser('userId') userId: string,
    @Param('id') id: string,
    @Body() dto: UpdateTodoDto,
  ) {
    return this.todosService.update(userId, id, dto);
  }

  @Delete(':id')
  @ResponseMessage('Todo deleted successfully')
  remove(@GetUser('userId') userId: string, @Param('id') id: string) {
    return this.todosService.remove(userId, id);
  }
}
