import { Injectable } from '@nestjs/common';
import { Player } from '../entity/player';

import { EthersContract, InjectContractProvider, Contract, Network } from 'nestjs-ethers';
import * as ABI from '../abi/ABI-GoodGhostingWhitelisted';

import * as dotenv from 'dotenv';

@Injectable()
export class AppService {

  private ethersContract: EthersContract;

  constructor( 
    @InjectContractProvider()
    private readonly contract: EthersContract ) 
  {
    dotenv.config();
    this.ethersContract = contract;
  }

  getHello(): string {
    return 'Hello World!';
  }

  async getNetwork() : Promise<Network> {
    const contract: Contract = this.ethersContract.create(
      '0xc69a569405EAE312Ca13C2eD85a256FbE4992A35',
      ABI.default,
    );
    return contract.provider.getNetwork();
  }

  getPlayer(): Player {

    return new Player ({
      addr: "testaddress",
      withdrawn: false,
      canRejoin: true,
      mostRecentSegmentPaid: 0,
      amountPaid: 0
    });
  }

  getCurrentSegment(): number {
    return 0;
  }
}
