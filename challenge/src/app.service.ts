import { Injectable } from '@nestjs/common';
import { Player } from '../entity/player';

@Injectable()
export class AppService {
  getHello(): string {
    return 'Hello World!';
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
