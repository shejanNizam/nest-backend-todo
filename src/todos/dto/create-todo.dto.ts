// src/todos/dto/create-todo.dto.ts
import { IsBoolean, IsOptional, IsString, MinLength } from 'class-validator';

export class CreateTodoDto {
  @IsString()
  @MinLength(1)
  title: string;

  @IsOptional()
  @IsBoolean()
  completed?: boolean;
}
