import {
  CowSwapWidgetParams,
  TradeType,
  EthereumProvider,
  CowSwapWidget as CowSwapWidgetImpl,
} from '@cowprotocol/widget-react'
import { useEffect, useState } from 'react'

const DEFAULT_COW_SWAP_PARAMS: CowSwapWidgetParams = {
  appCode: 'Safe CoW Swap DEMO', // Name of your app (max 50 characters)
  width: '450px', // Width in pixels (or 100% to use all available space)
  height: '640px',
  chainId: 1, // 1 (Mainnet), 5 (Goerli), 100 (Gnosis)
  tokenLists: [
    // All default enabled token lists. Also see https://tokenlists.org
    'https://tokens.coingecko.com/uniswap/all.json',
    'https://files.cow.fi/tokens/CowSwap.json',
  ],
  tradeType: TradeType.SWAP, // TradeType.SWAP, TradeType.LIMIT or TradeType.ADVANCED
  sell: {
    // Sell token. Optionally add amount for sell orders
    asset: 'USDC',
    amount: '100000',
  },
  buy: {
    // Buy token. Optionally add amount for buy orders
    asset: 'COW',
    amount: '0',
  },
  enabledTradeTypes: [
    // TradeType.SWAP, TradeType.LIMIT and/or TradeType.ADVANCED
    TradeType.SWAP,
    TradeType.LIMIT,
    TradeType.ADVANCED,
  ],
  theme: 'dark', // light/dark or provide your own color palette
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
