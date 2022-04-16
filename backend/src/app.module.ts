import { Module } from '@nestjs/common';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { ServeStaticModule } from '@nestjs/serve-static';
import { TypeOrmModule } from '@nestjs/typeorm'
import { ConfigModule, ConfigService } from '@nestjs/config';
import { User } from './users/entities/user.entity';
import { Channel } from './chat/channels/entities/channel.entity';
import { UserChannel } from './chat/channels/entities/user-channel.entity';
import { UserFriends } from './users/entities/user-friends.entity';
import * as dotenv from 'dotenv';
import { GameModule } from './game/game.module';
import { Game } from './game/entities/game.entity';
import { EventsModule } from './events/events.module';
import { ChatModule } from './chat/chat.module';
import { DirectMessage } from './chat/messages/entities/direct-messages.entity';
import { MessageChannel } from './chat/messages/entities/message-channel.entity';
import * as Joi from 'joi';

dotenv.config();
@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: `.env`,
      validationSchema: Joi.object({
        POSTGRES_HOST: Joi.string().required(),
        POSTGRES_PORT: Joi.number().required(),
        POSTGRES_USERNAME: Joi.string().required(),
        POSTGRES_PASSWORD: Joi.string().required(),
        POSTGRES_DATABASE: Joi.string().required(),
        HOST: Joi.string().required(),
        PORT: Joi.number().required(),
        APP_NAME: Joi.string().required(),
        BACKEND_URL: Joi.string().required(),
        CLIENT_ID: Joi.string().required(),
        SECRET: Joi.string().required(),
        CALLBACK_URL: Joi.string().required(),
        JWT_SECRET: Joi.string().required(),
        JWT_EXPIRESIN: Joi.string(),
        FRONTEND_URL: Joi.string().required(),
        HOME_PAGE: Joi.string().required(),
        COMPLETE_INFO: Joi.string().required(),
        VERIFY_PAGE: Joi.string().required(),
      })
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get('POSTGRES_HOST'),
        port: configService.get('POSTGRES_PORT'),
        username: configService.get('POSTGRES_USERNAME'),
        password: configService.get('POSTGRES_PASSWORD'),
        database: configService.get('POSTGRES_DATABASE'),
        entities: [
          User,
          UserFriends,
          Channel,
          UserChannel,
          Game,
          MessageChannel,
          DirectMessage
        ],
        synchronize: true,
      })
    }),
    UsersModule,
    AuthModule,
    ServeStaticModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => [
        { 
          rootPath: configService.get('DESTINATION'),
        },
      ]
    }),
    ChatModule,
    GameModule,
    EventsModule,
  ],
})
export class AppModule { }
