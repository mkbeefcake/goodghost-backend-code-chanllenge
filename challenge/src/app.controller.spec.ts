import { Test, TestingModule } from '@nestjs/testing';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { EthersModule, KOVAN_NETWORK } from 'nestjs-ethers';
import { doesNotMatch } from 'assert';


describe('AppController', () => {
  let appController: AppController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
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
    }).compile();

    appController = app.get<AppController>(AppController);
  });

  describe('root', () => {
    it('should return "Hello World!"', () => {
      expect(appController.getHello()).toBe('Hello World!');

      // let player: Player = new Player ({
      //   addr: "0x1d5160326ee05f1a12eaD33B4101A9B1E75C5152",
      //   withdrawn:false,
      //   canRejoin: false,
      //   mostRecentSegmentPaid: "0",
      //   amountPaid: "1000000000000000000",
      // });

      // let retPlayer = await appController.getPlayer("0x1d5160326ee05f1a12eaD33B4101A9B1E75C5152");

      // // appController.getPlayer("0x1d5160326ee05f1a12eaD33B4101A9B1E75C5152").then(retPlayer => {
      // //   expect(retPlayer).toBe(player);
      // // })
      // // .catch(err => {
      // //   console.log(err);
      // // });

    });    
  });

});
