// src/todos/todos.service.ts
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateTodoDto } from './dto/create-todo.dto';
import { UpdateTodoDto } from './dto/update-todo.dto';
import { Todo, TodoDocument } from './schemas/todo.schema';

@Injectable()
export class TodosService {
  constructor(@InjectModel(Todo.name) private todoModel: Model<TodoDocument>) {}

  create(userId: string, dto: CreateTodoDto) {
    return this.todoModel.create({ ...dto, owner: userId });
  }

  findAll(userId: string) {
    return this.todoModel.find({ owner: userId }).exec();
  }

  async findOne(userId: string, id: string) {
    const todo = await this.todoModel.findOne({ _id: id, owner: userId });
    if (!todo) throw new NotFoundException('Todo not found');
    return todo;
  }

  async update(userId: string, id: string, dto: UpdateTodoDto) {
    const todo = await this.todoModel.findOneAndUpdate(
      { _id: id, owner: userId },
      dto,
      { returnDocument: 'after' },
    );
    if (!todo) throw new NotFoundException('Todo not found');
    return todo;
  }

  async remove(userId: string, id: string) {
    const todo = await this.todoModel.findOneAndDelete({
      _id: id,
      owner: userId,
    });
    if (!todo) throw new NotFoundException('Todo not found');
    return { deleted: true };
  }
}
