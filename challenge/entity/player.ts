import { Exclude } from 'class-transformer';

export class Player {
  addr: string;
  withdrawn: boolean;
  canRejoin: boolean;
  mostRecentSegmentPaid: number;  
  amountPaid: number;

  constructor(partial: Partial<Player>) {
    Object.assign(this, partial);
  }
}
