import { MiddlewareConsumer, Module } from '@nestjs/common'
import { MongooseModule } from '@nestjs/mongoose'
import { Transaction, TransactionSchema } from 'src/transaction/model/transaction.schema'
import { TransactionController } from './transaction.controller'
import { TransactionService } from './transaction.service'

@Module({
    imports:[
        MongooseModule.forFeature([{
            name: Transaction.name,
            schema: TransactionSchema
        }]),
    ],
    controllers:[TransactionController],
    providers:[TransactionService],
    exports:[TransactionService]
})


export class TransactionModule {}