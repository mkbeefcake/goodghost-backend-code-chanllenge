import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';

import { EthersModule, KOVAN_NETWORK } from 'nestjs-ethers';

@Module({
  imports: [
    EthersModule.forRoot({
      network: KOVAN_NETWORK,
      infura: {
        projectId: '90f4e1ae98eb4a03a44ab47b5a111ba2',
        projectSecret: 'ed8c5558116443e59359cfbd0e272bf0'
      },
      useDefaultProvider: true
    })
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
