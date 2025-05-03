<!-- omit from toc -->
# Venn DApp SDK

[![NPM Version](https://img.shields.io/npm/v/@vennbuild/cli?style=for-the-badge)](https://www.npmjs.com/~vennbuild)
![TypeScript](https://img.shields.io/badge/typescript-%23007ACC.svg?style=for-the-badge&logo=typescript&logoColor=white)
![Jest](https://img.shields.io/badge/-jest-%23C21325?style=for-the-badge&logo=jest&logoColor=white)
![ESLint](https://img.shields.io/badge/ESLint-4B3263?style=for-the-badge&logo=eslint&logoColor=white)  
[![Discord](https://img.shields.io/badge/Discrd-blue?logo=discord&logoColor=white&style=for-the-badge)](https://discord.com/channels/1065679814289268929)
[![X](https://img.shields.io/badge/@VennBuild-gray?style=for-the-badge&logo=x)](https://twitter.com/VennBuild)
[![License](https://img.shields.io/badge/License-MIT-green.svg?style=for-the-badge)](https://opensource.org/licenses/MIT)

SDK for easy DApp integrations with Venn Security Network

👉 [**What is Venn?**](https://docs.venn.build/)

<!-- omit from toc -->
## Table of Contents

- [🚀 Quick Start](#-quick-start)
- [📦 Installation](#-installation)
- [📚 Usage](#-usage)
  - [Approving Transactions](#approving-transactions)
  - [Venn Client](#venn-client)
  - [Security Nodes](#security-nodes)
  - [Strict Mode](#strict-mode)
- [⚙️ Configuration](#️-configuration)
- [💬 Support \& Documentation](#-support--documentation)
- [📜 License](#-license)

## 🚀 Quick Start

Follow these steps to protect your DApp with Venn:

1. Install the SDK in your project:

    ```shell
    npm i @vennbuild/venn-dapp-sdk
    ```

2. Instantiate a new **`VennClient`**:

    ```typescript
    import { VennClient } from '@vennbuild/venn-dapp-sdk';

    const vennURL           = process.env.VENN_NODE_URL;
    const vennPolicyAddress = process.env.VENN_POLICY_ADDRESS;

    const vennClient = new VennClient({ vennURL, vennPolicyAddress });
    ```

3. Approve your users transactions with Venn:

    ```typescript
    const approvedTransaction = await vennClient.approve({
        from,
        to,
        data,
        value,
        chainId // optional. If omitted, the chain ID currently set in the user's wallet will be used
    });
    ```

4. Finally, send the approved transaction onchain as your DApp normally would

    ```typescript
    const receipt = await wallet.sendTransaction(approvedTransaction);
    ```

## 📦 Installation

<!-- omit from toc -->
### Prerequisites

- You have integrated the [**Firewall SDK**](https://www.npmjs.com/package/@vennbuild/cli#firewall-integration) into your smart contracts
- You have the address of your [**Venn Policy**](https://www.npmjs.com/package/@vennbuild/cli#venn-integration)

<!-- omit from toc -->
### Install

```shell
npm install @vennbuild/venn-dapp-sdk
```

## 📚 Usage

Use this SDK to easily integrate your DApp with Venn.  
First, make sure you have integrated your smart contracts with the  [**Firewall SDK**](https://www.npmjs.com/package/@vennbuild/cli#firewall-integration), and that you have your [**Venn Policy**](https://www.npmjs.com/package/@vennbuild/cli#venn-integration) address readily available.

### Approving Transactions

Once your smart contracts protected by Venn, only approved transactions will be allowed to go through. Transactions that are not approved will be reverted onchain.

This SDK will ensure your DApp's Frontend approves transactions with Venn before sending them onchain.

### Venn Client

The **`VennClient`** is your DApp's entry point for interacting with Venn.  
It provides a simple transaction approval interface that seamlessly integrates with your existing DApp's code:

```typescript
import { VennClient } from '@ironblocks/venn-dapp-sdk';

const vennURL           = process.env.VENN_NODE_URL;
const vennPolicyAddress = process.env.VENN_POLICY_ADDRESS;

const vennClient = new VennClient({ vennURL, vennPolicyAddress });
const approvedTx = await vennClient.approve({ from, to, data, value });
```

The approved transactions has the same **`to`**, **`from`**, and **`value`**, with an updated **`data`** field that now includes a secure signature that will allow the transaction to go through the onchain Firewall

You can optionally pass a **`chainId`** to the **`approve`** method 
```typescript
const approvedTx = await vennClient.approve({ from, to, data, value, chainId });
``` 
If omitted, the chain ID currently set in the user's wallet will be used. If unavailable, the transaction will fail

```typescript
console.log(approvedTx);

/**
 * {
 *      from: original from
 *      to: original to
 *      data: <SECURE SIGNATURE + ORIGINAL DATA> (hex string)
 *      value: original value
 * }
```

### Security Nodes

Venn protects your protocol by leveraging collective intelligence of multiple security node operators, all at once, in real time.

When the **`VennClient`** approves a transaction, it takes the original user transaction *(in the form of `{ from, to, data, value }`)* and sends it to any one of it's security nodes for inspection.

The security nodes propagate the transaction to all nodes on the network via P2P, and responds back with a signed transaction *(in the form of `{ from, to, data, value }`)* that your DApp can now submit onchain.

### Strict Mode

By default, the SDK runs with **strict mode enabled**.

<!-- omit from toc -->
#### Enabled

In strict mode, if an error occurs while trying to approve the transaction, or if the transaction was not approved by Venn - the SDK will throw an error.

Your DApp will need to handle this gracefully handle this error:
> The signed transactions has the same **`to`**, **`from`**, and **`value`**, with an updated **`data`** field that now includes a secure signature that will allow the transaction to go through the onchain Firewall

```typescript
import { errors } from '@ironblocks/venn-dapp-sdk'

try {
    const approvedTx = await vennClient.approve({
        from,
        to,
        data,
        value,
        chainId // optional
    });
}
catch (e) {
    // handle errors and unapproved transactions
    //
    // for example, alert the user that the transaction did not pass security checks etc

    if (!(e instanceof Error)) return alert(e)

    switch(error.constructor) {
        case errors.InvalidInitParamsError:
            return alert(`Invalid params: ${error.message}`)
        case errors.ConnectionRefused:
            return alert(`Network error: ${error.message}`)
        case errors.TxRejectedError:
            return alert(`Venn Error: Tx Not Approved: ${error.message}`)
        default:
            return alert('Something wrong...')
    }
}
```

<!-- omit from toc -->
#### Disabled

When strict mode is disabled, the SDK will gracefully handle any errors internally - **including ignoring unapproved transactions**.

> ⚠️  
> **IMPORTANT:** While it may make sense for certain DApps to disable strict mode, we strongly encourage you to **keep strict mode enabled**

## ⚙️ Configuration

- `vennURL: string`  
    the Venn security node to connect the client to

- `vennPolicyAddress: string`  
    the address of your  [**Venn Policy**](https://www.npmjs.com/package/@vennbuild/cli#venn-integration)

- `strict: boolean`  
    whether or not to enable strict mode *(default: `true`)*

## 💬 Support & Documentation

We're here to help.  

- Join the discussion on Discord: [Venn Discord](https://discord.gg/97cg6Qhg)

- Read the docs: [Venn Documentation](https://docs.venn.build)

## 📜 License

Venn DApp SDK is released under the [MIT License](LICENSE).

This SDK demonstrates how to integrate DApps with Venn Network together with Ironblocks Firewall
