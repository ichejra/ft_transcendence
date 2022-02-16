import { Controller, Get, Post, UseGuards, Request } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AppService } from './app.service';
import { IntraAuthGuard } from './auth/intra-auth.guard';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}
}
