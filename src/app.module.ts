import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { ConfigModule } from '@nestjs/config';
import { AppService } from './app.service';
import { BotModule } from './bot/bot.module';
import { AdminModule } from './admin/admin.module';

@Module({
  imports: [ConfigModule.forRoot({ isGlobal: true, }), BotModule, AdminModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
