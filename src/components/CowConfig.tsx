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
        console.log('partnerFee', partnerFee)
        // newParams.partnerFee = {
        //   bps: Number(value),
        //   recipient: '0x79063d9173C09887d536924E2F6eADbaBAc099f5',
        // }
        break
      default:
        console.warn('Unhandled input name', name)
        return
    }

    updateParams(newParams)
  }

  const handleChainChange = (event: SelectChangeEvent) => {
    const chainId = Number(event.target.value)
    console.log('chain change', chainId)
    updateParams({ ...params, chainId })
  }

  const handleTradeTypeChange = (event: SelectChangeEvent) => {
    const newParams = { ...params }
    newParams.tradeType = event.target.value as TradeType
    newParams.enabledTradeTypes = params.enabledTradeTypes || []
    if (!newParams.enabledTradeTypes.includes(newParams.tradeType)) {
      newParams.enabledTradeTypes.push(newParams.tradeType)
    }
    console.log('[anx] oldParams', params)
    console.log('[anx] newParams', newParams)
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

  return (
    <Paper>
      <FormControl>
        <InputLabel id="demo-simple-select-label">Chain</InputLabel>
        <Select labelId="select-chain" id="select-chain" value={chainId} label="Chain Id" onChange={handleChainChange}>
          <MenuItem value={1}>Mainnet</MenuItem>
          <MenuItem value={100}>Gnosis Chain</MenuItem>
          <MenuItem value={11155111}>Sepolia</MenuItem>
        </Select>
      </FormControl>
      {/* <TextField label="Sell token" name="sellToken" value={sellToken} onChange={handleChange} /> */}
      <Autocomplete
        disablePortal
        options={TOKENS}
        value={sellToken}
        sx={{ width: 200, margin: '10px 0' }}
        onChange={(event: any, newValue: string | null) => {
          updateParams({
            ...params,
            sell: { asset: newValue || 'USDC', amount: params.sell?.amount || '100000' },
          })
        }}
        renderInput={(params) => <TextField {...params} label="Sell token" />}
      />
      {/* <TextField label="Buy token" name="buyToken" value={buyToken} onChange={handleChange} /> */}
      <Autocomplete
        disablePortal
        options={TOKENS}
        value={buyToken}
        sx={{ width: 200, margin: '10px 0' }}
        onChange={(event: any, newValue: string | null) => {
          updateParams({
            ...params,
            buy: { asset: newValue || 'COW' },
          })
        }}
        renderInput={(params) => <TextField {...params} label="Buy token" />}
      />
      <TextField label="Sell amount" name="sellAmount" value={sellAmount} onChange={handleChange} />
      {/* <TextField label="Buy amount" name="buyAmount" value={buyAmount} onChange={handleChange} /> */}
      <TextField
        label="Partner Fee (Bips)"
        name="partnerFee"
        value={partnerFee}
        onChange={handleChange}
        type="number"
      />
      <FormControl sx={{ width: '100px' }}>
        <InputLabel id="demo-simple-select-label">Default trade type</InputLabel>
        <Select
          labelId="select-chain"
          id="select-chain"
          value={tradeType}
          label="Chain Id"
          onChange={handleTradeTypeChange}
        >
          <MenuItem value={TradeType.SWAP}>Swap</MenuItem>
          <MenuItem value={TradeType.LIMIT}>Limit</MenuItem>
          <MenuItem value={TradeType.ADVANCED}>Twap</MenuItem>
        </Select>
      </FormControl>
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
    </Paper>
  )
}
