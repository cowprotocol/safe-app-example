import React, { useCallback, useMemo, useState } from 'react'
import { Paper } from '@mui/material'
import { useSafeAppsSDK } from '@safe-global/safe-apps-react-sdk'
import { CowParams, CowWidget } from './CowWidget'
import { SafeProvider } from '../SafeProvider'
import { CowConfig } from './CowConfig'
import { TradeType } from '@cowprotocol/widget-react'

const SafeApp = (): React.ReactElement => {
  const { sdk, safe } = useSafeAppsSDK()
  const web3Provider = useMemo(() => new SafeProvider(safe, sdk), [sdk, safe])
  const [params, setParams] = useState<CowParams>({
    chainId: 1,
    sell: {
      asset: 'USDC',
      amount: '100000',
    },
    buy: {
      asset: 'COW',
      amount: '0',
    },
    interfaceFeeBips: '50',
    enabledTradeTypes: [TradeType.SWAP, TradeType.LIMIT, TradeType.ADVANCED],
    tradeType: TradeType.SWAP,
  })
  const updateWidgetParams = useCallback((params: CowParams) => {
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
