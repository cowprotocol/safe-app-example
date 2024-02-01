import React, { useCallback, useMemo } from 'react'
import { Container, Button, Grid, Link, Typography, Paper, Box } from '@mui/material'
import { useSafeAppsSDK } from '@safe-global/safe-apps-react-sdk'
import { CowSwapWidget } from './CowSwapWidget'
import { SafeProvider, SafeProvider2 } from './SafeProvider'

const SafeApp = (): React.ReactElement => {
  const { sdk, safe } = useSafeAppsSDK()
  // const web3Provider = useMemo(() => new SafeProvider2(safe, sdk), [sdk, safe])
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
    <Paper elevation={0}>
      {/*
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
      </Container>
      */}
      <Box sx={{ height: '100%' }}>
        <CowSwapWidget provider={web3Provider} />
      </Box>
    </Paper>
  )
}

export default SafeApp
