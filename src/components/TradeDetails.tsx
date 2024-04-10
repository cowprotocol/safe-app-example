import { OnTradeParamsPayload } from '@cowprotocol/events'
import { TokenInfo } from '@cowprotocol/widget-lib'

import QuestionMark from '@mui/icons-material/QuestionMark'
import Check from '@mui/icons-material/Check'

import { Alert, Chip, IconButton } from '@mui/material'
import Tooltip from '@mui/material/Tooltip'
import { Box } from '@mui/system'

export interface TradeDetailsProps {
  tradeParams?: OnTradeParamsPayload
}

export function TradeDetails({ tradeParams }: TradeDetailsProps) {
  if (!tradeParams) {
    return
  }

  const {
    inputCurrency,
    outputCurrency,
    inputCurrencyAmount,
    outputCurrencyAmount,
    orderType,
    orderKind,
    inputCurrencyBalance,
    inputCurrencyFiatAmount,
    outputCurrencyBalance,
    outputCurrencyFiatAmount,
    recipient,
    slippageAdjustedSellAmount,
  } = tradeParams // TODO: Types are not being inferred correctly, we should review it in the library

  return (
    <Box sx={{ my: 2 }}>
      <Alert icon={<Check fontSize="inherit" />} severity="success">
        <strong>Trade details</strong> <DetailsTooltip />:
        <ul>
          <OrderType orderKind={orderKind} orderType={orderType} />
          <Currency label="Sell" currency={inputCurrency} />
          <Amount label="Sell amount" amount={inputCurrencyAmount} />
          <Currency label="Buy" currency={outputCurrency} />
          <Amount label="Buy amount" amount={outputCurrencyAmount} />
          <Recipient recipient={recipient} />
          <Amount label="Sell amount (after slippage)" amount={slippageAdjustedSellAmount} />
        </ul>
        <strong>Balances</strong>:
        <ul>
          <Balance label="Sell balance" amount={inputCurrencyBalance} fiatAmount={inputCurrencyFiatAmount} />
          <Balance label="Buy balance" amount={outputCurrencyBalance} fiatAmount={outputCurrencyFiatAmount} />
        </ul>
      </Alert>
    </Box>
  )
}

function Currency({ currency, label }: { currency?: TokenInfo; label: string }) {
  if (!currency) {
    return
  }

  const { symbol, address, logoURI } = currency
  return (
    <li>
      {logoURI && <img src={logoURI} />}
      <strong>{label}</strong>: <Chip label={symbol} variant="outlined" /> &nbsp; (<code>{address}</code>)
    </li>
  )
}

function Amount({ amount, label }: { amount?: bigint; label: string }) {
  if (!amount) {
    return
  }

  return (
    <li>
      <strong>{label}</strong> &nbsp; {amount.toString()}
    </li>
  )
}

function OrderType({ orderKind, orderType }: { orderKind: string; orderType: string }) {
  return (
    <li>
      <strong>Order Type</strong> &nbsp;{' '}
      <Chip label={orderType + ': ' + (orderKind === 'buy' ? 'Buy order' : 'Sell order')} color="info" />
    </li>
  )
}

function Recipient({ recipient }: { recipient?: string }) {
  if (!recipient) {
    return
  }

  return (
    <li>
      <strong>Recipient</strong>:{recipient}
    </li>
  )
}

function Balance({ label, amount, fiatAmount }: { label: string; amount?: bigint; fiatAmount?: bigint }) {
  if (!amount) {
    return
  }

  return (
    <li>
      <strong>{label}</strong>: {amount.toString()} &nbsp;{' '}
      {fiatAmount ? <>${(Number(fiatAmount) * 1e-18).toFixed(2)}</> : ''}
    </li>
  )
}

export function DetailsTooltip() {
  return (
    <Tooltip title="Use this info, to set your own fee based on the market">
      <IconButton size="small">
        <QuestionMark />
      </IconButton>
    </Tooltip>
  )
}
