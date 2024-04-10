# 🐷 Your Safe App

This repository contains some boilerplate code to get you started with building a Safe App with built-in swap support.

Read the related tutorial on how to do your own CoW Powered Safe Dapp:

- <https://docs.cow.fi/cow-protocol/tutorials/swap-in-safe-app>

The example app embeds the CoW Swap widget in a Safe App, and allows to change some of the configuration, such as the partner fee, token lists, or theming.

It also show how to handle events happening inside CoW Swap, like the notification on a new trade.

![Swap](./docs/swap.png)

![Limit Orders](./docs/limit-orders.png)

## Demo

1. Go to <https://app.safe.global>.
2. Then navigate to: `Apps` > `My Custom Dapps`.
3. Click on `Add custom Safe App`
4. Enter the URL of the Safe App: `https://safe.widget.cow.fi`

## Getting Started

Install dependencies and start a local dev server.

```
yarn install
cp .env.sample .env
yarn start
```

Read the tutorial for more information <https://docs.cow.fi/cow-protocol/tutorials/swap-in-safe-app>

## Related

- [Tutorial for CoW powered Safe Dapps](https://docs.cow.fi/cow-protocol/tutorials/safe-app)
- [Widget Landing](https://cow.fi/widget)
- [Widget Configurator](https://widget.cow.fi/)
- [Widget Docs](https://docs.cow.fi/cow-protocol/tutorials/widget)
