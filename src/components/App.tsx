import React, { useCallback, useMemo, useState } from 'react'
import { Paper } from '@mui/material'
import { useSafeAppsSDK } from '@safe-global/safe-apps-react-sdk'
import { CowWidget } from './CowWidget'
import { SafeProvider } from '../SafeProvider'
import { CowConfig } from './CowConfig'
import { CowSwapWidgetParams, TradeType } from '@cowprotocol/widget-react'

const APP_CODE = 'CoW Widget - Safe App'

const DEFAULT_COW_PARAMS: CowSwapWidgetParams = {
  appCode: APP_CODE,
  width: '100%',
  height: '640px',
  standaloneMode: false, // Dapp mode, we handle the Ethereum provider
  // baseUrl: { environment: 'dev' },
  // baseUrl: { environment: 'local' },
  baseUrl: 'https://swap-dev-git-fee-labels-cowswap.vercel.app',

  // tokenLists: ['https://tokens.coingecko.com/uniswap/all.json', 'https://files.cow.fi/tokens/CowSwap.json'],

  disableToastMessages: true,
  disablePostedOrderConfirmationModal: true,
  hideLogo: true,
  hideNetworkSelector: true,
  partnerFee: {
    bps: 50,
    recipient: '0x79063d9173C09887d536924E2F6eADbaBAc099f5',
  },
  images: {
    emptyOrders: 'https://swap.cow.fi/assets/meditating-cow-v2-AePIJBpI.svg',
  },
  sounds: {
    orderError: null,
    orderExecuted: null,
    postOrder: null,
  },
  chainId: 1,
  sell: {
    asset: 'USDC',
    amount: '100000',
  },
  buy: {
    asset: 'COW',
    amount: '0',
  },
  enabledTradeTypes: [TradeType.SWAP, TradeType.LIMIT, TradeType.ADVANCED],
  tradeType: TradeType.SWAP,
}

const SafeApp = (): React.ReactElement => {
  const { sdk, safe } = useSafeAppsSDK()
  const web3Provider = useMemo(() => new SafeProvider(safe, sdk), [sdk, safe])
  const [params, setParams] = useState<CowSwapWidgetParams>(DEFAULT_COW_PARAMS)
  const updateWidgetParams = useCallback((params: CowSwapWidgetParams) => {
    setParams(params)
  }, [])

  return (
    <Paper elevation={0} sx={{ p: 2 }}>
      <h1>Your Safe App</h1>

      <CowConfig params={params} updateParams={updateWidgetParams} />
      <CowWidget provider={web3Provider} params={params} />
    </Paper>
  )
}

export default SafeApp
