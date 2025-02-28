import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { ConfigModule } from "@nestjs/config";
import { UserModule } from "./user/user.module";
import { AuthenticationLogModule } from "./authenticationlog/authenticationlog.module";
import { AuthModule } from "./Auth/auth.module";
import { APP_FILTER } from "@nestjs/core";
import { ChatModule } from './chat/chat.module';
import { UnauthorizedExceptionFilter } from "./Auth/middleware/UnauthorizedExceptionFilter";
import { TransactionModule } from "./transaction/transaction.module";

@Module({
  imports: [
    MongooseModule.forRoot(process.env.MONGO_URI), // Use an env variable instead of hardcoding credentials
    UserModule,
    AuthenticationLogModule,
    AuthModule,
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    ChatModule,
    TransactionModule
  ],
  providers: [
    {
      provide: APP_FILTER,
      useClass: UnauthorizedExceptionFilter,
    },
  ],
  controllers: [],
})
export class AppModule {}
