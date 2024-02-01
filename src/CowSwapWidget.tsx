import {
  CowSwapWidgetParams,
  TradeType,
  EthereumProvider,
  CowSwapWidget as CowSwapWidgetImpl,
} from '@cowprotocol/widget-react'
import { useEffect, useState } from 'react'

const DEFAULT_COW_SWAP_PARAMS: CowSwapWidgetParams = {
  appCode: 'Safe CoW Swap DEMO', 
  width: '100%', 
  height: '640px',
  chainId: 1, 
  tokenLists: [
    'https://tokens.coingecko.com/uniswap/all.json',
    'https://files.cow.fi/tokens/CowSwap.json',
  ],
  sell: {
    asset: 'USDC',
    amount: '100000',
  },
  buy: {
    asset: 'COW',
    amount: '0',
  },
  env: 'dev',
  enabledTradeTypes: [
    TradeType.LIMIT,
    TradeType.SWAP,
    TradeType.ADVANCED,
  ],
  tradeType: TradeType.LIMIT,
  interfaceFeeBips: '50', // 0.5% - COMING SOON! Fill the form above if you are interested
}

export function CowSwapWidget(props: { provider: EthereumProvider }) {
  const { provider } = props
  const [params, setParams] = useState<CowSwapWidgetParams>(DEFAULT_COW_SWAP_PARAMS)
  useEffect(() => {
    setParams((params) => ({
      ...params,
      provider,
    }))
  }, [provider])
  return <CowSwapWidgetImpl params={params} />
}
