import { Module } from '@nestjs/common';
import { PrismaService } from './prisma.service';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { ServeStaticModule } from '@nestjs/serve-static';

@Module({
  imports: [
    UsersModule,
    AuthModule,
    ServeStaticModule.forRoot({
      rootPath: process.env.DESTINATION
    })
  ],
  controllers: [],
  providers: [ PrismaService ],
})
export class AppModule {}
