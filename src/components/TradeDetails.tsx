import { OnTradeParamsPayload, AtomsAndUnits } from '@cowprotocol/events'
import { TokenInfo } from '@cowprotocol/widget-lib'

import QuestionMark from '@mui/icons-material/QuestionMark'
import Check from '@mui/icons-material/Check'

import { Alert, Chip, IconButton, Typography } from '@mui/material'
import Tooltip from '@mui/material/Tooltip'
import { Box } from '@mui/system'

export interface TradeDetailsProps {
  tradeParams?: OnTradeParamsPayload
}

const formatter = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
})

export function TradeDetails({ tradeParams }: TradeDetailsProps) {
  if (!tradeParams) {
    return
  }

  const {
    sellToken,
    buyToken,
    sellTokenAmount,
    buyTokenAmount,
    orderType,
    orderKind,
    sellTokenBalance,
    sellTokenFiatAmount,
    buyTokenBalance,
    buyTokenFiatAmount,
    recipient,
    maximumSendSellAmount,
    minimumReceiveBuyAmount,
  } = tradeParams

  return (
    <Box sx={{ my: 2 }}>
      <Alert icon={<Check fontSize="inherit" />} severity="success">
        <strong>Trade details</strong> <DetailsTooltip />:
        <ul>
          <OrderType orderKind={orderKind} orderType={orderType} />
          <Currency label="Sell" currency={sellToken} />
          <Amount label="Sell amount" amount={sellTokenAmount} fiatAmount={sellTokenFiatAmount} />
          <Currency label="Buy" currency={buyToken} />
          <Amount label="Buy amount" amount={buyTokenAmount} fiatAmount={buyTokenFiatAmount} />
          <Recipient recipient={recipient} />
        </ul>
        <strong>Balances</strong>:
        <ul>
          <Balance label="Sell balance" amount={sellTokenBalance} />
          <Balance label="Buy balance" amount={buyTokenBalance} />
        </ul>
        <strong>Limit Order</strong> (include slippage tolerance and fees):
        <ul>
          <Amount label="Sell amount" amount={maximumSendSellAmount} />
          <Amount label="Buy amount" amount={minimumReceiveBuyAmount} />
        </ul>
      </Alert>
    </Box>
  )
}

function Currency({ currency, label }: { currency?: TokenInfo; label: string }) {
  if (!currency) {
    return
  }

  const { symbol, address, logoURI, decimals } = currency
  return (
    <li>
      {logoURI && <img src={logoURI} />}
      <strong>{label}</strong>: <Chip label={symbol} variant="outlined" /> &nbsp; (address=<code>{address}</code>,
      decimals=
      <code>{decimals})</code>
    </li>
  )
}

function Amount({ amount, fiatAmount, label }: { amount?: AtomsAndUnits; fiatAmount?: string; label: string }) {
  if (!amount) {
    return
  }

  return (
    <li>
      <strong>{label}</strong> &nbsp; {amount.units} <FiatAmount amount={fiatAmount} /> (
      <code>{amount.atoms.toString()}</code>)
    </li>
  )
}

function FiatAmount({ amount }: { amount?: string }) {
  if (!amount) {
    return
  }

  return (
    // <Typography component="span" variant="body2" color="blue">
    //   &nbsp;({formatter.format(Number(amount))})
    // </Typography>
    <Chip label={formatter.format(Number(amount))} color="success" size="small" variant="outlined" />
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

function Balance({ label, amount, fiatAmount }: { label: string; amount?: AtomsAndUnits; fiatAmount?: string }) {
  if (!amount) {
    return
  }

  return (
    <li>
      <strong>{label}</strong>: {amount.units} &nbsp; {fiatAmount ? <>${Number(fiatAmount).toFixed(2)}</> : ''}
    </li>
  )
}

export function DetailsTooltip() {
  return (
    <Tooltip title="You can use this info, to set your own fee based on the trade details">
      <IconButton size="small">
        <QuestionMark />
      </IconButton>
    </Tooltip>
  )
}
