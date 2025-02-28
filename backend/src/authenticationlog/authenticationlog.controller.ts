import { Controller, Get, Post, Delete, Body, Param, UseGuards, UseInterceptors, Patch, Res } from '@nestjs/common';
import { AuthenticationLogService } from './authenticationlog.service';
import { AuthenticationLog } from './model/authenticationLog.schema';
import { Role, Roles } from 'src/Auth/decorators/roles.decorator';
import { authorizationGuard } from 'src/Auth/guards/authorization.guard';
import { Response } from 'express';
import { CreateAuthenticationLogDto, UpdateAuthenticationLogDto } from './dtos/authenticationlog.dto';
import { AuthGuard } from 'src/Auth/guards/authentication.guard';

@Roles(Role.Admin)
@UseGuards(AuthGuard)
@UseGuards(authorizationGuard)
@Controller('logs')
export class AuthenticationLogController {
    constructor(
        private readonly authenticationlogService: AuthenticationLogService,
    ) { }

    @Post()
    async create(@Body() createAuthenticationLogDto: CreateAuthenticationLogDto): Promise<AuthenticationLog> {
        return this.authenticationlogService.create(createAuthenticationLogDto)
    }

    @Get()
    async findAll(): Promise<AuthenticationLog[]> {
        return this.authenticationlogService.findAll();
    }

    @Get(':id')
    async findOne(@Param('id') id: string): Promise<AuthenticationLog> {
        return this.authenticationlogService.findOne(id);
    }

    @Patch(':id')
    async update(
        @Param('id') id: string,
        @Body() updateAuthenticationLogDto: UpdateAuthenticationLogDto,
    ): Promise<AuthenticationLog> {
        return this.authenticationlogService.update(id,updateAuthenticationLogDto);
    }

    @Delete(':id')
    async delete(@Param('id') id: string): Promise<void> {
        return this.authenticationlogService.delete(id);
    }
}
