import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { ConfigModule } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { AppService } from './app.service';
import { BotModule } from './bot/bot.module';
import { JwtStrategy } from './admin/jwt.strategy';
import { AdminModule } from './admin/admin.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, }), 
    PassportModule, 
    JwtModule.register({ 
      secret: process.env.JWT_SECRET, 
      signOptions: { 
        expiresIn: '60m' 
      }, 
    }),

    BotModule, 
    AdminModule
  ],
  controllers: [AppController],
  providers: [AppService, JwtStrategy],
})
export class AppModule {}
