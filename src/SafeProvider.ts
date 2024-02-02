import { SafeAppProvider } from '@safe-global/safe-apps-provider'
import { EthereumProvider, JsonRpcRequest } from '@cowprotocol/widget-react'
import SafeAppsSDK, { SafeInfo } from '@safe-global/safe-apps-sdk'
import { ethers } from 'ethers'
import { Web3Provider } from 'ethers/providers'

type CallbackFunction = (...args: any[]) => void

function isCallbackFunction(args: unknown): args is CallbackFunction {
  return typeof args === 'function'
}

function transformToCallback(args: unknown): CallbackFunction | null {
  if (isCallbackFunction(args)) {
    return args
  }
  return null
}

export class SafeProvider implements EthereumProvider {
  safeAppProvider: SafeAppProvider

  constructor(safe: SafeInfo, sdk: SafeAppsSDK) {
    // console.log('[COW] constructor', safe, sdk)
    this.safeAppProvider = new SafeAppProvider(safe, sdk)
  }

  on(event: string, args: unknown): void {
    // console.log('[COW] on', event, args)
    this.safeAppProvider.on(event, transformToCallback(args) ?? (() => {}))
  }

  async request<T>(params: JsonRpcRequest): Promise<T> {
    if (params.method === 'eth_sendTransaction') {
      console.log('[COW-App] eth_sendTransaction', params)
      const result = await this.safeAppProvider.request(params)
      console.log('[COW-App] eth_sendTransaction result', result)
      return result
    }

    return this.safeAppProvider.request(params)
  }
  async enable(): Promise<void> {
    console.log('[COW-App] enable')
    return this.safeAppProvider.connect()
  }
}
