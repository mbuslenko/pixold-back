import { BadRequestException } from '@nestjs/common';
import axios from 'axios';

import { STELLAR_API_URL } from '../../config';

import * as StellarNamespace from './interfaces';

export const getAccountInfo = async (
  publicKey: string,
): Promise<StellarNamespace.Account.Info> => {
  const response: StellarNamespace.Account.StellarResponse.AccountInfo =
    await axios
      .request({
        method: 'GET',
        url: STELLAR_API_URL + '/accounts/' + publicKey,
      })
      .then((response) => response.data)
      .catch(error => {
        throw new BadRequestException({ message: `The credentials provided were not found on the Stellar network` });
      });

  const balances = parseBalances(response.balances);

  return {
    accountId: response.account_id,
    balanceInUSD: balances.usd,
    balanceInXLM: balances.xlm,
    sequence: +response.sequence,
    rawData: response,
  };
};

const parseBalances = (
  balances: StellarNamespace.Account.StellarResponse.BalancesEntity[],
): { usd: number; xlm: number } => {
  const result = {
    xlm: 0,
    usd: 0,
  };

  if (!balances.length) {
    return result;
  }

  balances.forEach((el) => {
    if (el.is_authorized === true && el.asset_code === 'USD') {
      result.usd += +el.balance;
    } else if (el.asset_type === 'native') {
      result.xlm += +el.balance;
    }
  });

  return result;
};
