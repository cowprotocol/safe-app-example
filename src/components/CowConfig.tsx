import {
  Autocomplete,
  Checkbox,
  FormControl,
  FormControlLabel,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  SelectChangeEvent,
  TextField,
  Grid,
} from '@mui/material'
import { CowSwapWidgetParams, TradeType } from '@cowprotocol/widget-react'

const TOKENS = ['USDC', 'COW', 'WETH', 'DAI']

export interface CowConfigProps {
  params: CowSwapWidgetParams
  updateParams: (config: CowSwapWidgetParams) => void
}

export function CowConfig(props: CowConfigProps) {
  const { updateParams, params } = props

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target

    const newParams = {
      ...params,
    }

    switch (name) {
      // case 'sellToken':
      //   newParams.sell = { ...params.sell, asset: value }
      //   break
      case 'sellAmount':
        newParams.sell = { asset: params.sell?.asset || 'USDC', amount: value }
        break
      // case 'buyToken':
      //   newParams.buy = { ...params.buy, asset: value }
      //   break
      // NOTE: For simplicity, only sell orders
      // case 'buyAmount':
      //   newParams.buy = { asset: params.buy?.asset || 'COW', amount: value }
      //   break
      case 'partnerFee':
        newParams.partnerFee = {
          bps: Number(value),
          recipient: '0x79063d9173C09887d536924E2F6eADbaBAc099f5',
        }
        break
      default:
        console.warn('Unhandled input name', name)
        return
    }

    updateParams(newParams)
  }

  const handleTradeTypeChange = (event: SelectChangeEvent) => {
    const newParams = { ...params }
    newParams.tradeType = event.target.value as TradeType
    newParams.enabledTradeTypes = params.enabledTradeTypes || []
    if (!newParams.enabledTradeTypes.includes(newParams.tradeType)) {
      newParams.enabledTradeTypes.push(newParams.tradeType)
    }
    updateParams(newParams)
  }

  const handleCheck = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = event.target

    const tradeType: TradeType = (() => {
      switch (name) {
        case 'enableSwaps':
          return TradeType.SWAP
        case 'enableLimit':
          return TradeType.LIMIT
        case 'enableTwap':
          return TradeType.ADVANCED
        default:
          console.warn('Unhandled input name', name)
          return TradeType.SWAP
      }
    })()

    const enabledTradeTypes = params.enabledTradeTypes?.filter((type) => type !== tradeType) || []
    if (checked) {
      enabledTradeTypes.push(tradeType)
    }

    const newParams = { ...params, enabledTradeTypes }
    if (enabledTradeTypes.length === 1) {
      newParams.tradeType = enabledTradeTypes[0]
    }
    updateParams(newParams)
  }

  const { sell, buy, partnerFee, enabledTradeTypes, chainId, tradeType } = params
  const [sellToken, sellAmount] = sell ? [sell.asset, sell.amount] : [undefined, undefined]
  const [buyToken, _buyAmount] = buy ? [buy.asset, buy.amount] : [undefined, undefined]
  const { bps, recipient } = partnerFee || {}

  return (
    <Paper>
      <Grid container spacing={2}>
        {/* Sell + Buy + Amount */}
        <Grid item xs={12} md={6}>
          <Grid container spacing={2}>
            {/* Sell */}
            <Grid item xs={4}>
              {/* <TextField label="Sell token" name="sellToken" value={sellToken} onChange={handleChange} /> */}
              <Autocomplete
                fullWidth
                disablePortal
                options={TOKENS}
                value={sellToken}
                onChange={(event: any, newValue: string | null) => {
                  updateParams({
                    ...params,
                    sell: { asset: newValue || 'USDC', amount: params.sell?.amount || '100000' },
                  })
                }}
                renderInput={(params) => <TextField {...params} label="Sell token" />}
              />
            </Grid>

            {/* Buy */}
            <Grid item xs={4}>
              {/* <TextField label="Buy token" name="buyToken" value={buyToken} onChange={handleChange} /> */}
              <Autocomplete
                disablePortal
                options={TOKENS}
                value={buyToken}
                onChange={(event: any, newValue: string | null) => {
                  updateParams({
                    ...params,
                    buy: { asset: newValue || 'COW' },
                  })
                }}
                renderInput={(params) => <TextField {...params} label="Buy token" />}
              />
            </Grid>

            {/* Amount */}
            <Grid item xs={4}>
              <TextField label="Sell amount" name="sellAmount" value={sellAmount} onChange={handleChange} fullWidth />
              {/* <TextField label="Buy amount" name="buyAmount" value={buyAmount} onChange={handleChange} /> */}
            </Grid>
          </Grid>
        </Grid>

        {/* Partner Fee + Trade Types  */}
        <Grid item xs={12} md={2}>
          {/* Partner Fee */}
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                label="Partner Fee (Bips)"
                name="partnerFee"
                fullWidth
                value={bps}
                onChange={handleChange}
                type="number"
              />
            </Grid>
          </Grid>
        </Grid>

        {/* Default trade type  */}
        <Grid item xs={12} md={10}>
          <Grid container spacing={2}>
            {/* Trade Types */}
            <Grid item xs={3} md={3} lg={2}>
              <FormControl fullWidth>
                <InputLabel id="trade-type">Trade type</InputLabel>
                <Select
                  labelId="select-trade=type"
                  id="select-trade-type"
                  value={tradeType}
                  label="Trade types"
                  onChange={handleTradeTypeChange}
                >
                  <MenuItem value={TradeType.SWAP}>Swap</MenuItem>
                  <MenuItem value={TradeType.LIMIT}>Limit</MenuItem>
                  <MenuItem value={TradeType.ADVANCED}>Twap</MenuItem>
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={9} md={9} lg={10}>
              <FormControlLabel
                control={<Checkbox onChange={handleCheck} checked={enabledTradeTypes?.includes(TradeType.SWAP)} />}
                label="Enable Swaps"
                name="enableSwaps"
              />
              <FormControlLabel
                control={<Checkbox onChange={handleCheck} checked={enabledTradeTypes?.includes(TradeType.LIMIT)} />}
                label="Enable Limit"
                name="enableLimit"
              />

              <FormControlLabel
                control={<Checkbox onChange={handleCheck} checked={enabledTradeTypes?.includes(TradeType.ADVANCED)} />}
                label="Enable TWAP"
                name="enableTwap"
              />
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </Paper>
  )
}
