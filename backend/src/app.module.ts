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

dotenv.config();
@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, envFilePath: '../.env' }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.POSTGRES_HOST,
      port: parseInt(<string>process.env.POSTGRES_PORT),
      username: process.env.POSTGRES_USER,
      password: process.env.POSTGRES_PASSWORD,
      database: process.env.POSTGRES_DB,
      entities: [
        User,
        UserFriends,
        Channel,
        UserChannel,
        Game
      ],
      synchronize: true,
    }),
    UsersModule,
    AuthModule,
    ServeStaticModule.forRoot({
      rootPath: process.env.DESTINATION
    }),
    ChannelsModule,
    GameModule,
    MailModule
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
