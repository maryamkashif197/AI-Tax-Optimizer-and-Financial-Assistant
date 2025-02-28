import { MiddlewareConsumer, Module } from '@nestjs/common'
import { MongooseModule } from '@nestjs/mongoose'
import { AuthenticationLog, AuthenticationLogSchema } from 'src/authenticationlog/model/authenticationLog.schema'
import { AuthenticationLogService } from './authenticationlog.service';
import { AuthenticationLogController} from './authenticationlog.controller';

@Module({
    imports:[
        MongooseModule.forFeature([{
            name: AuthenticationLog.name,
            schema: AuthenticationLogSchema
        }])
    ],
    controllers:[AuthenticationLogController],
    providers:[AuthenticationLogService],
    exports:[AuthenticationLogService]
})


export class AuthenticationLogModule {}