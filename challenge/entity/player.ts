import { Exclude } from 'class-transformer';
import { BigNumber } from 'nestjs-ethers';

export class Player {
  addr: string;
  withdrawn: boolean;
  canRejoin: boolean;
  mostRecentSegmentPaid: string;  
  amountPaid: string;

  constructor(partial: Partial<Player>) {
    Object.assign(this, partial);
  }
}
