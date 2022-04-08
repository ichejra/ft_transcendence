import { Module } from '@nestjs/common';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { ServeStaticModule } from '@nestjs/serve-static';
import { TypeOrmModule } from '@nestjs/typeorm'
import { ConfigModule } from '@nestjs/config';
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
import * as Joi from 'Joi';

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
        POSTGRES_DATABASE: Joi.string().required()
      })
    }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.POSTGRES_HOST,
      port: parseInt(<string>process.env.POSTGRES_PORT),
      username: process.env.POSTGRES_USERNAME,
      password: process.env.POSTGRES_PASSWORD,
      database: process.env.POSTGRES_DATABASE,
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
    }),
    UsersModule,
    AuthModule,
    ServeStaticModule.forRoot({
      rootPath: process.env.DESTINATION
    }),
    ChatModule,
    GameModule,
    EventsModule,
  ],
})
export class AppModule { }
