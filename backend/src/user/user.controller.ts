import { Controller, Get, Delete, Body, Param, UseGuards, Req, Patch, Res } from "@nestjs/common";
import { UserService } from "../user/user.service";
import { User } from "./model/user.schema";
import { Role, Roles } from "src/Auth/decorators/roles.decorator";
import { authorizationGuard } from "src/Auth/guards/authorization.guard";
import { updateUserDto, UserDto } from "./dtos/user.dto";
import { Request, Response } from "express";
import { AuthGuard } from "src/Auth/guards/authentication.guard";

@UseGuards(AuthGuard)
@Controller("user")
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  async findAll(): Promise<UserDto[]> {
    return this.userService.findAll();
  }
  
  @Get("/me")
  @UseGuards(authorizationGuard)
  async getMyDetails(@Req() request: Request) {
    return await this.userService.getMyDetails(request);
  }

  @Get(":id")
  async findOne(@Param("id") id: string, @Req() req: Request): Promise<User> {
    return this.userService.findOne(id, req);
  }

  @Patch(":id")
  async update(@Param("id") id: string, @Body() updateUserDto: updateUserDto, @Req() req: Request): Promise<User> {
    return this.userService.update(id, updateUserDto, req);
  }

  @Delete(":id")
  async delete(@Param("id") id: string, @Req() req: Request): Promise<void> {
    return this.userService.delete(id, req);
  }
}
