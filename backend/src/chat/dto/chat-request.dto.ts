import { IsString, IsOptional, IsArray } from 'class-validator';

export class ChatRequestDto {
  @IsString()
  message: string;

  @IsOptional()
  @IsArray()
  history?: any[] = [];

  @IsOptional()
  @IsString()
  chatId?: string;

  @IsOptional()
  @IsString()
  userId?: string;
}