import { Module } from '@nestjs/common';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { ServeStaticModule } from '@nestjs/serve-static';
import { TypeOrmModule } from '@nestjs/typeorm'
import { ConfigModule } from '@nestjs/config';
import { User } from './users/entities/user.entity';
import { Channel } from './channels/entities/channel.entity';
import { UserChannel } from './channels/entities/user-channel.entity';
import { UserFriends } from './users/entities/user-friends.entity';
import * as dotenv from 'dotenv';
import { ChannelsModule } from './channels/channels.module';
import { GameModule } from './game/game.module';
import { Game } from './game/entities/game.entity';
import { Message } from './channels/messages/entities/message.entity';
import { JwtModule } from '@nestjs/jwt';
import { EventsModule } from './events/events.module';

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
        Message,
      ],
      synchronize: true,
    }),
    UsersModule,
    AuthModule,
    ServeStaticModule.forRoot({ rootPath: process.env.DESTINATION }),
    ChannelsModule,
    GameModule,
    EventsModule
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
