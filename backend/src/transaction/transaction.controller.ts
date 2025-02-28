import { Controller, Get, Delete, Body, Param, UseGuards, Req, Patch, Res, Post } from "@nestjs/common";
import { TransactionService } from "../transaction/transaction.service";
import { Transaction } from "./model/transaction.schema";
import { CreateTransactionDto, UpdateTransactionDto, } from "./dtos/transaction.dto";
import { Request, Response } from "express";
import { AuthGuard } from "src/Auth/guards/authentication.guard";

@UseGuards(AuthGuard)
@Controller("transaction")
export class TransactionController {
  constructor(private readonly transactionService: TransactionService) {}

  @Post()
  async create(@Body() createTransactionDto: CreateTransactionDto, @Req() req: Request): Promise<Transaction> {
    return this.transactionService.create(createTransactionDto, req["user"].userid);
  }

  @Get()
  async findAll(@Req() request:Request): Promise<Transaction[]> {
    return this.transactionService.findAll(request["user"].userid);
  }

  @Get(":id")
  async findOne(@Param("id") id: string, @Req() req: Request): Promise<Transaction> {
    return this.transactionService.findOne(id, req["user"].userid);
  }

  @Patch(":id")
  async update(@Param("id") id: string, @Body() updateTransactionDto: UpdateTransactionDto, @Req() req: Request): Promise<Transaction> {
    return this.transactionService.update(id, updateTransactionDto, req);
  }

  @Delete(":id")
  async delete(@Param("id") id: string, @Req() req: Request): Promise<void> {
    return this.transactionService.delete(id, req);
  }
}
