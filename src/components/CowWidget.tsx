import { CowSwapWidgetParams, TradeType, EthereumProvider, CowSwapWidget } from '@cowprotocol/widget-react'

import { useMemo } from 'react'
import { Box } from '@mui/material'

const DEFAULT_COW_PARAMS: CowSwapWidgetParams = {
  appCode: 'CoW Widget - Safe App',
  width: '100%',
  height: '640px',
  // tokenLists: ['https://tokens.coingecko.com/uniswap/all.json', 'https://files.cow.fi/tokens/CowSwap.json'],
  env: 'dev',
  // env: 'local',
  enabledTradeTypes: [TradeType.LIMIT, TradeType.SWAP, TradeType.ADVANCED],
  tradeType: TradeType.SWAP,
}

export interface CowWidgetProps {
  provider: EthereumProvider
  params: CowParams
}

export type CowParams = Pick<
  CowSwapWidgetParams,
  'interfaceFeeBips' | 'sell' | 'buy' | 'chainId' | 'enabledTradeTypes' | 'tradeType'
>

export function CowWidget(props: CowWidgetProps) {
  const { provider, params } = props

  const cowParams = useMemo(() => {
    const newParams = {
      ...DEFAULT_COW_PARAMS,
      ...params,
      provider,
    }
    console.log('cowParams changed', newParams)
    return newParams
  }, [provider, params])

  return (
    <Box sx={{ height: '100%' }}>
      <CowSwapWidget params={cowParams} />
    </Box>
  )
}
