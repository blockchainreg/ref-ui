import React, {
  useState,
  useEffect,
  useContext,
  createContext,
  useReducer,
} from 'react';
import {
  REF_FARM_CONTRACT_ID,
  wallet as webWallet,
  wallet,
} from '../services/near';

import { getAmount, RefFiFunctionCallOptions, getGas } from '../services/near';
import { scientificNotationToString } from './numbers';

export const SENDER_WALLET_SIGNEDIN_STATE_KEY =
  'SENDER_WALLET_SIGNEDIN_STATE_VALUE';

export const getSenderLoginRes = () => {
  return localStorage.getItem(SENDER_WALLET_SIGNEDIN_STATE_KEY);
};

export const saveSenderLoginRes = (accountId?: string) => {
  localStorage.setItem(
    SENDER_WALLET_SIGNEDIN_STATE_KEY,
    SENDER_WALLET_SIGNEDIN_STATE_KEY + ': ' + accountId ||
      window.near.getAccountId()
  );
};

export const removeSenderLoginRes = () => {
  localStorage.removeItem(SENDER_WALLET_SIGNEDIN_STATE_KEY);
};

//@ts-ignore
export enum WALLET_TYPE {
  WEB_WALLET = 'near-wallet',
  SENDER_WALLET = 'sender-wallet',
}

export const LOCK_INTERVAL = 1000 * 60 * 20;
// export const LOCK_INTERVAL = 1000 * 60;

function senderWalletFunc(window: Window) {
  this.requestSignIn = async function (contractId: string) {
    return window.near
      .requestSignIn({
        contractId,
      })
      .then((res: any) => {
        !res?.error && saveSenderLoginRes();
      });
  };

  this.signOut = function () {
    removeSenderLoginRes();
    return window.near.signOut();
  };

  this.requestSignTransactions = async function (
    transactions: any,
    callbackUrl?: string
  ) {
    if (!senderWallet.isSignedIn()) {
      await this.requestSignIn(REF_FARM_CONTRACT_ID);
    }

    const senderTransaction = transactions.map((item: any) => {
      return {
        ...item,
        actions: item.functionCalls.map((fc: any) => ({
          ...fc,
          deposit: scientificNotationToString(getAmount(fc.amount).toString()),
          gas: scientificNotationToString(getGas(fc.gas).toString()),
        })),
      };
    });

    return window.near
      .requestSignTransactions({
        transactions: senderTransaction,
      })
      .then(() => window.location.reload());
  };

  this.sendTransactionWithActions = async function (
    receiverId: string,
    functionCalls: RefFiFunctionCallOptions[]
  ) {
    if (!senderWallet.isSignedIn()) {
      await this.requestSignIn(REF_FARM_CONTRACT_ID);
    }

    return window.near
      .signAndSendTransaction({
        receiverId,
        actions: functionCalls.map((fc) => {
          return {
            ...fc,
            deposit: scientificNotationToString(
              getAmount(fc.amount).toString()
            ),
            gas: scientificNotationToString(getGas(fc.gas).toString()),
          };
        }),
      })
      .then(() => window.location.reload());
  };

  this.walletType = WALLET_TYPE.SENDER_WALLET;
}

senderWalletFunc.prototype = window.near;

export const senderWallet = new (senderWalletFunc as any)();

export const getSenderWallet = (window: Window) => {
  senderWalletFunc.prototype = window.near;

  return new (senderWalletFunc as any)(window);
};

export const getAccountName = (accountId: string) => {
  const [account, network] = accountId.split('.');
  const niceAccountId = `${account.slice(0, 10)}...${network || ''}`;

  return account.length > 10 ? niceAccountId : accountId;
};

export const getCurrentWallet = () => {
  const SENDER_LOGIN_RES = getSenderLoginRes();

  if (window.near && SENDER_LOGIN_RES && !webWallet.isSignedIn()) {
    senderWalletFunc.prototype = window.near;

    return {
      wallet: new (senderWalletFunc as any)(window),
      wallet_type: WALLET_TYPE.SENDER_WALLET,
      accountName: getAccountName(window.near.getAccountId()),
    };
  }

  return {
    wallet: webWallet,
    wallet_type: WALLET_TYPE.WEB_WALLET,

    accountName: getAccountName(webWallet.getAccountId()),
  };
};

export const WalletContext = createContext(null);

export const signedInStateReducer = (
  state: { isSignedIn: boolean },
  action: { type: 'signIn' | 'signOut' }
) => {
  switch (action.type) {
    case 'signIn':
      return {
        isSignedIn: true,
      };
    case 'signOut':
      return {
        isSignedIn: false,
      };
  }
};
