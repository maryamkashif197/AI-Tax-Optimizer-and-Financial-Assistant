import { Controller, Post, Get, Body, Param, HttpException, HttpStatus, Req, UseGuards, Delete } from '@nestjs/common';
import { ChatService } from './chat.service';
import { ChatRequestDto } from './dto/chat-request.dto';
import { ChatResponseDto } from './dto/chat-response.dto';
import { Request } from 'express';
import { AuthGuard } from 'src/Auth/guards/authentication.guard';

@UseGuards(AuthGuard)
@Controller('api/chat')
export class ChatController {
  constructor(private chatService: ChatService) {}

  @Post()
  async chat(@Body() chatRequestDto: ChatRequestDto, @Req() request: Request): Promise<ChatResponseDto> {
    try {
      return await this.chatService.sendMessage(
        chatRequestDto.message, 
        request["user"].userid
      );
    } catch (error) {
      throw new HttpException('Failed to process chat request', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  // reset chat history
  @Delete('reset')
  async resetChatHistory(@Req() request: Request) {
    try {
      return await this.chatService.resetChatHistory(request["user"].userid);
    } catch (error) {
      throw new HttpException('Failed to reset chat history', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Get()
  async getChatHistory(@Req() request: Request) {
    try {
      return { history: await this.chatService.getChatHistory(request["user"].userid) };
    } catch (error) {
      throw new HttpException('Failed to get chat history', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}