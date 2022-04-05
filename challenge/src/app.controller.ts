import { Controller, Get, Req } from '@nestjs/common';
import { AppService } from './app.service';
import { Request } from 'express';

import { Player } from '../entity/player';
import { BigNumber, Network } from 'nestjs-ethers';
import { Param } from '@nestjs/common';
import { HttpException } from '@nestjs/common';
import { HttpStatus } from '@nestjs/common';


@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {
  }

  @Get('player/:address')
  async getPlayer(@Param('address') address) : Promise<Player> {
    return this.appService.getPlayer(address);
  }

  @Get('segment')
  async getCurrentSegment(): Promise<number> {
    return this.appService.getCurrentSegment();
  } 
 
  @Get('join')
  async join(): Promise<string> {
    return this.appService.join();
  }

}
