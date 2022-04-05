import { Controller, Get, Req } from '@nestjs/common';
import { AppService } from './app.service';
import { Request } from 'express';

import { Player } from '../entity/player';
import { Network } from 'nestjs-ethers';


@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {
  }

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Get('player')
  async getPlayer(@Req() request: Request) : Promise<Player> {
    return this.appService.getPlayer();
  }

  @Get('segment')
  async getCurrentSegment(@Req() request: Request): Promise<number> {
    return this.appService.getCurrentSegment();
  } 

  @Get('network')
  async getNetwork(): Promise<Network> {
    return this.appService.getNetwork();
  }
}
