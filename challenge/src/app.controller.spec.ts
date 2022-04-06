import { Test, TestingModule } from '@nestjs/testing';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { EthersModule, KOVAN_NETWORK } from 'nestjs-ethers';
import { Player } from '../entity/player';
import { HttpException } from '@nestjs/common';
import { HttpStatus } from '@nestjs/common';

jest.setTimeout(10000);

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
    test('should return the information about player("0x1d5160326ee05f1a12eaD33B4101A9B1E75C5152")', async () => {

      let player: Player = new Player ({
        addr: "0x1d5160326ee05f1a12eaD33B4101A9B1E75C5152",
        withdrawn:false,
        canRejoin: false,
        mostRecentSegmentPaid: "0",
        amountPaid: "1000000000000000000",
      });

      let retPlayer = await appController.getPlayer("0x1d5160326ee05f1a12eaD33B4101A9B1E75C5152");
      expect(retPlayer).toStrictEqual(player);
    });

    test('should return the information (zero address contained) about player("0xfe6fac10d38E2e701f0fd96E4Fc0bD486286188e")', async () => {

      let player: Player = new Player ({
        addr: "0x0000000000000000000000000000000000000000",
        withdrawn:false,
        canRejoin: false,
        mostRecentSegmentPaid: "0",
        amountPaid: "0",
      });

      let retPlayer = await appController.getPlayer("0xfe6fac10d38E2e701f0fd96E4Fc0bD486286188e");
      expect(retPlayer).toStrictEqual(player);
    });

    test('should return BAD information about the player("0x1d5160326ee05f1a12eaD33B4101A9B1E75C5151")', async () => {

      let player: Player = new Player ({
        addr: "0x1d5160326ee05f1a12eaD33B4101A9B1E75C5152",
        withdrawn:false,
        canRejoin: false,
        mostRecentSegmentPaid: "0",
        amountPaid: "1000000000000000000",
      });

      try {
        let retPlayer = await appController.getPlayer("0x1d5160326ee05f1a12eaD33B4101A9B1E75C5151");
      }
      catch (err) {
        let error = {
          reason: "bad address checksum",
          code: "INVALID_ARGUMENT",
          argument: "address",
          value: "0x1d5160326ee05f1a12eaD33B4101A9B1E75C5151"
        };

        let exception : HttpException = new HttpException(
          JSON.stringify(error), 
          HttpStatus.FORBIDDEN
        );
        
        expect(err).toStrictEqual(exception);
      }
    });

    test('should return 0 for current_segment', async () => {
      let currentSegment = await appController.getCurrentSegment();
      let curruentSegmentFromContract = await appController.getCurrentSegmentFromContract();
      expect(currentSegment).toBe(curruentSegmentFromContract);
    });


  });



});
