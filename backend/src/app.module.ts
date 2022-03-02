import { Module } from '@nestjs/common';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { ServeStaticModule } from '@nestjs/serve-static';
import { TypeOrmModule } from '@nestjs/typeorm'
import { ConfigModule } from '@nestjs/config';
import { UserEntity } from './users/entities/user.entity';
import { ChannelEntity } from './channels/entities/channel.entity';
import { UserChannelEntity } from './channels/entities/user-channel.entity';
import { GameModule } from './game/game.module';
import { Game } from './game/entities/game.entity';

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
        UserEntity,
        ChannelEntity,
        UserChannelEntity,
        Game
      ],
      synchronize: true,
    }),
    UsersModule,
    AuthModule,
    ServeStaticModule.forRoot({
      rootPath: process.env.DESTINATION
    }),
    GameModule
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
