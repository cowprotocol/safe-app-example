import React, { useCallback, useMemo, useState } from 'react'
import { useSafeAppsSDK } from '@safe-global/safe-apps-react-sdk'
import { SafeProvider } from '../SafeProvider'
import { CowConfig } from './CowConfig'
import { CowSwapWidget, CowSwapWidgetParams, TradeType } from '@cowprotocol/widget-react'
import { CowEvents, CowEventListeners } from '@cowprotocol/events'

import { Paper, Chip, Snackbar, Box } from '@mui/material'

const APP_CODE = 'CoW Widget - Safe App'

const BASE_URL = window.location.origin

// Check the widget configuration settings at https://docs.cow.fi/cow-protocol/tutorials/widget
const DEFAULT_COW_PARAMS: CowSwapWidgetParams = {
  appCode: APP_CODE,
  width: '100%',
  height: '640px',
  standaloneMode: false, // Dapp mode, we handle the Ethereum provider
  baseUrl: 'https://dev.swap.cow.fi',

  // tokenLists: ['https://tokens.coingecko.com/uniswap/all.json', 'https://files.cow.fi/tokens/CowSwap.json'],

  // You can disable the toast messages and confirmation modal (if you want to handle them yourself, see event handling in https://docs.cow.fi/cow-protocol/tutorials/widget#events-handling)
  disableToastMessages: true,
  disablePostedOrderConfirmationModal: true,
  hideNetworkSelector: true,

  // You can optionally set your partner fee. See https://docs.cow.fi/cow-protocol/tutorials/widget#partner-fee
  partnerFee: {
    bps: 50,
    recipient: '0x79063d9173C09887d536924E2F6eADbaBAc099f5',
  },

  // Optionally customize the images and sounds
  images: {
    emptyOrders: BASE_URL + '/images/pig.png',
  },
  sounds: {
    orderError: BASE_URL + '/sounds/error.mp3',
    orderExecuted: BASE_URL + '/sounds/executed.mp3',
    postOrder: BASE_URL + '/sounds/posted.mp3',
  },

  // Initial trade parameters
  sell: {
    asset: 'USDC',
    amount: '100000',
  },
  buy: {
    asset: 'COW',
    amount: '0',
  },

  // Theming
  theme: {
    // Configure your theme here: https://widget.cow.fi, also see the docs https://docs.cow.fi/cow-protocol/tutorials/widget#custom-theme
    baseTheme: 'light',
    primary: '#fa24d7',
    paper: '#ffe5f6',
    text: '#560001',
    // Derived colors. Pick yours or check the derived colors in the widget configuration page (click on "more options")
    background: '#303030',
    danger: '#f44336',
    warning: '#F8D06B',
    alert: '#DB971E',
    info: '#428dff',
    success: '#00D897',
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

  const [toasts, setToasts] = useState<String[]>([])
  const toast = toasts.length > 0 ? toasts[0] : undefined

  const openToast = (message: string) => {
    setToasts((t) => [...t, message])
  }

  const handleClose = (event: React.SyntheticEvent | Event, reason?: string) => {
    if (reason === 'clickaway') {
      return
    }

    setToasts((t) => t.slice(1))
  }

  const listeners = useMemo<CowEventListeners>(() => {
    return [
      {
        event: CowEvents.ON_TOAST_MESSAGE,
        handler: (event) => {
          console.info('🍞 New toast message:', event)
          openToast(event.message)
        },
      },
    ]
  }, [openToast])

  return (
    <Paper elevation={0} sx={{ p: 2 }}>
      <h1>🐷 Your Safe App</h1>

      <CowConfig params={params} updateParams={updateWidgetParams} />

      <Snackbar
        open={toasts.length > 0}
        autoHideDuration={6000}
        onClose={handleClose}
        message={
          toast ? (
            <>
              <Chip label="YOUR CUSTOM MESSAGES" color="secondary" variant="outlined" />
              &nbsp;
              {toast}
            </>
          ) : undefined
        }
      />

      <Box sx={{ padding: '10px' }}>
        <CowSwapWidget params={params} provider={web3Provider} listeners={listeners} />
      </Box>
    </Paper>
  )
}

export default SafeApp
