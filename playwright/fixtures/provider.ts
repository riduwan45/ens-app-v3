/* eslint-disable import/no-extraneous-dependencies */
import { BigNumber } from '@ethersproject/bignumber/lib/bignumber'
import { ethers } from 'ethers'

export type Provider = ReturnType<typeof createProvider>

class ExtendedProvider extends ethers.providers.JsonRpcProvider {
  async mine() {
    return this.send('evm_mine', [])
  }

  async increaseTime(seconds: number) {
    return this.send('evm_increaseTime', [seconds])
  }

  async setAutomine(active: boolean) {
    if (!active)
      console.warn(
        'You are disabled automine in a test. Make sure this test is not running in parrallel mode or it could effect the results of other tests',
      )
    return this.send('evm_setAutomine', [active])
  }

  async getBlockNumber() {
    const num = await this.send('eth_blockNumber', [])
    return BigNumber.from(num).toNumber()
  }

  async getBlockTimestamp() {
    const currentBlock = await this.send('eth_blockNumber', [])
    const block = await this.send('eth_getBlockByNumber', [currentBlock, false])
    return BigNumber.from(block.timestamp).toNumber()
  }
}

export const createProvider = (stateful = true) => {
  const apiKey = process.env.NEXT_PUBLIC_INFURA_KEY || 'cfa6ae2501cc4354a74e20432507317c'
  const rpcUrl = stateful ? `https://goerli.infura.io/v3/${apiKey}` : 'http://localhost:8545'
  const chainId = stateful ? 5 : 1337
  return new ExtendedProvider(rpcUrl, chainId)
}
