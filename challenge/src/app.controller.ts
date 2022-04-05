import { Controller, Get, Req } from '@nestjs/common';
import { AppService } from './app.service';
import { Request } from 'express';

import { Player } from '../entity/player';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Get('player')
  getPlayer(@Req() request: Request) : Player {
    return this.appService.getPlayer();
  }

  @Get('segment')
  getCurrentSegment(@Req() request: Request): number {
    return this.appService.getCurrentSegment();
  } 
}
