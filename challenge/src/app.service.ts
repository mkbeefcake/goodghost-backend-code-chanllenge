import { Injectable } from '@nestjs/common';
import { HttpException } from '@nestjs/common';
import { HttpStatus } from '@nestjs/common';

import { Player } from '../entity/player';

import { EthersContract, InjectContractProvider, Contract, Network, InjectSignerProvider, EthersSigner, Wallet, BigNumber } from 'nestjs-ethers';
import * as ABI from '../abi/ABI-GoodGhostingWhitelisted';
import * as DAI_ABI from '../abi/ABI-dai';

import * as dotenv from 'dotenv';

@Injectable()
export class AppService {

  private ethersContract : EthersContract;
  private ethersSigner : EthersSigner;

  // private wallet: Wallet;
  // private contract: Contract;
  // private daiContract : Contract;

  constructor( 
    @InjectContractProvider()
    private readonly _contract: EthersContract,
    @InjectSignerProvider()
    private readonly _signer: EthersSigner) 
  {
    dotenv.config();
    
    this.ethersContract = _contract;
    this.ethersSigner = _signer;

    // this.wallet = _signer.createWallet(
    //   process.env.PRIVATE_KEY,
    // );

    // this.contract = _contract.create(
    //   '0xc69a569405EAE312Ca13C2eD85a256FbE4992A35',
    //   ABI.default,
    //   this.wallet
    // );

    // this.daiContract = _contract.create(
    //   '0x04DF6e4121c27713ED22341E7c7Df330F56f289B', // KOVAN DAI CONTRACT
    //   DAI_ABI.default,
    //   this.wallet
    // );

    // this.setEventHandler();
  }

  setEventHandler() {

    // this.daiContract.on("Approval", (from, to, value) => {
    //   console.log(`DAI Approved: ${from} - ${to} : ${value}`);
    // })

    // this.contract.on("JoinedGame", (from, allowance) => {
    //   console.log(`GoodGhosting JoinedGame: ${from} : ${allowance}`);
    // })
    
  }

  async getPlayer(address: string): Promise<Player> {

    try {

      let wallet : Wallet = this.ethersSigner.createWallet(
        process.env.PRIVATE_KEY,
      );

      let contract : Contract = this.ethersContract.create(
        '0xc69a569405EAE312Ca13C2eD85a256FbE4992A35',
        ABI.default,
        wallet
      );

      // console.log("Address: ", address);
      const player = await contract.players(address);    

      return new Player ({
        addr: player.addr,
        withdrawn: player.withdrawn,
        canRejoin: player.canRejoin,
        mostRecentSegmentPaid: player.mostRecentSegmentPaid.toString(),
        amountPaid: player.amountPaid.toString()
      });
    }
    catch(error) {
      throw new HttpException(JSON.stringify(error), HttpStatus.FORBIDDEN);
    }
  }

  async getCurrentSegment(): Promise<number> {
    try {
      let wallet : Wallet = this.ethersSigner.createWallet(
        process.env.PRIVATE_KEY,
      );

      let contract : Contract = this.ethersContract.create(
        '0xc69a569405EAE312Ca13C2eD85a256FbE4992A35',
        ABI.default,
        wallet
      );

      const segment: BigNumber = await contract.getCurrentSegment();
      return segment.toNumber();
    }
    catch (error) {
      throw new HttpException(JSON.stringify(error), HttpStatus.FORBIDDEN);
    }
  }

  async calculateSegment(): Promise<number> {

    try {
      let wallet : Wallet = this.ethersSigner.createWallet(
        process.env.PRIVATE_KEY,
      );

      let contract : Contract = this.ethersContract.create(
        '0xc69a569405EAE312Ca13C2eD85a256FbE4992A35',
        ABI.default,
        wallet
      );

      const blockNumber = await contract.provider.getBlockNumber();
      const timestamp = (await contract.provider.getBlock(blockNumber)).timestamp;
      // console.log(`BlockNumber : ${blockNumber}, Block timestamp: ${timestamp}`);
      
      const firstSegmentStart = await contract.firstSegmentStart();
      const segmentLength = await contract.segmentLength();
      // console.log(`First Segment Start : ${firstSegmentStart}, SegmentLength: ${segmentLength}`);

      const getCurrentSegment = Math.floor((timestamp - firstSegmentStart) / segmentLength);
      return getCurrentSegment;
    }
    catch (error) {
      throw new HttpException(JSON.stringify(error), HttpStatus.FORBIDDEN);
    }
  }


  // not working yet....
  async join() : Promise<string> {
    let wallet : Wallet = this.ethersSigner.createWallet(
      process.env.PRIVATE_KEY,
    );

    let contract : Contract = this.ethersContract.create(
      '0xc69a569405EAE312Ca13C2eD85a256FbE4992A35',
      ABI.default,
      wallet
    );

    let daiContract : Contract = this.ethersContract.create(
      '0x04DF6e4121c27713ED22341E7c7Df330F56f289B', // KOVAN DAI CONTRACT
      DAI_ABI.default,
      wallet
    );

    const gasPrice : BigNumber =  await contract.provider.getGasPrice();

    console.log("Wallet: ", await wallet.getAddress());
    console.log('GasPrice:', gasPrice);

    // const estimatedGas: BigNumber = await this.contract.estimateGas.joinGame();
    // return Promise.resolve({
    //   gasPrice: gasPrice,
    //   estimatedGas: estimatedGas
    // }.toString());

    // ----------
    // approve dai contract to spend DAI
    const daiBalance = await daiContract.balanceOf(await wallet.getAddress());
    console.log('current dai: ', daiBalance);
    
    if (daiBalance.lt(BigNumber.from('1000000000000000000'))) {
      console.log('Not enough DAI for this account');
      return Promise.reject("Not enough DAI for this account");
    }
    
    const tx = await daiContract.approve('0xc69a569405EAE312Ca13C2eD85a256FbE4992A35', BigNumber.from('1100000000000000000'));
    console.log('Tx for DAI is created');
    const approval = await tx.wait();
    console.log('Tx for DAI is completed');

    // ---------
    // try to join game
    const txJoin = await contract.joinGame({ gasLimit: 2500000, gasPrice: gasPrice});
    console.log('Tx Join is created');
    const join = await txJoin.wait()
    console.log('Tx Join: ', join);

    return Promise.resolve('OK');
  }

}
