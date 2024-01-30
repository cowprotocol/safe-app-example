import React, { useCallback, useMemo } from 'react'
import { Container, Button, Grid, Link, Typography } from '@mui/material'
import { useSafeAppsSDK } from '@safe-global/safe-apps-react-sdk'
import { CowSwapWidget } from './CowSwapWidget'
import { ethers } from 'ethers'
import { SafeAppProvider } from '@safe-global/safe-apps-provider'
import { EthereumProvider, JsonRpcRequest } from '@cowprotocol/widget-react'
import SafeAppsSDK, { SafeInfo } from '@safe-global/safe-apps-sdk'

class SafeProvider implements EthereumProvider {
  safeAppProvider: SafeAppProvider

  constructor(safe: SafeInfo, sdk: SafeAppsSDK) {
    this.safeAppProvider = new SafeAppProvider(safe, sdk)
  }

  on(event: string, args: unknown): void {
    this.on(event, args)
  }
  request<T>(params: JsonRpcRequest): Promise<T> {
    return this.request(params)
  }
  enable(): Promise<void> {
    return this.safeAppProvider.connect()
  }
}

const SafeApp = (): React.ReactElement => {
  const { sdk, safe } = useSafeAppsSDK()
  const web3Provider = useMemo(() => new SafeProvider(safe, sdk), [sdk, safe])

  if (safe && sdk) {
    sdk.wallet.requestPermissions
  }

  const submitTx = useCallback(async () => {
    try {
      const { safeTxHash } = await sdk.txs.send({
        txs: [
          {
            to: safe.safeAddress,
            value: '0',
            data: '0x',
          },
        ],
      })
      console.log({ safeTxHash })
      const safeTx = await sdk.txs.getBySafeTxHash(safeTxHash)
      console.log({ safeTx })
    } catch (e) {
      console.error(e)
    }
  }, [safe, sdk])

  return (
    <Container>
      <Grid container direction="column" rowSpacing={2} alignItems="center">
        <Grid item>
          <Typography variant="h3">Safe: {safe.safeAddress}</Typography>
        </Grid>
        <Grid item>
          <Button variant="contained" color="primary" onClick={submitTx}>
            Send Transaction
          </Button>
        </Grid>
      </Grid>

      <CowSwapWidget provider={web3Provider} />
    </Container>
  )
}

export default SafeApp
