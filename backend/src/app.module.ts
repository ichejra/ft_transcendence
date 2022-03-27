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

dotenv.config();
@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: `.env`
    }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.TYPEORM_HOST,
      port: parseInt(<string>process.env.TYPEORM_PORT),
      username: process.env.TYPEORM_USERNAME,
      password: process.env.TYPEORM_PASSWORD,
      database: process.env.TYPEORM_DATABASE,
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
