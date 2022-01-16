import { InternalServerErrorException } from '@nestjs/common';
import * as StellarSdk from 'stellar-sdk';

import {
  STELLAR_API_URL,
  STELLAR_DISTRIBUTOR_SECRET_KEY,
  STELLAR_ISSUER_SECRET_KEY,
  STELLAR_USER_PUBLIC_KEY,
} from '../../config';

export const sendTransactionToUser = async (
  destinationPublicKey: string,
  amount: string,
): Promise<void> => {
  const server = new StellarSdk.Server(STELLAR_API_URL);
  const issuerKeys = StellarSdk.Keypair.fromSecret(STELLAR_ISSUER_SECRET_KEY);
  const distributorKeys = StellarSdk.Keypair.fromSecret(
    STELLAR_DISTRIBUTOR_SECRET_KEY,
  );

  // Transaction will hold a built transaction we can resubmit if the result is unknown.
  let transaction;

  // First, check to make sure that the destination account exists.
  // You could skip this, but if the account does not exist, you will be charged
  // the transaction fee when the transaction fails.
  server
    .loadAccount(destinationPublicKey)
    // If the account is not found, surface a nicer error message for logging.
    .catch(function (error) {
      if (error instanceof StellarSdk.NotFoundError) {
        throw new InternalServerErrorException(`Destination wasn't found`);
      } else throw new InternalServerErrorException(error);
    })
    // If there was no error, load up-to-date information on your account.
    .then(function () {
      return server.loadAccount(distributorKeys.publicKey());
    })
    .then(function (sourceAccount) {
      // Start building the transaction.
      transaction = new StellarSdk.TransactionBuilder(sourceAccount, {
        fee: StellarSdk.BASE_FEE,
        networkPassphrase: StellarSdk.Networks.TESTNET, // TODO: change to production
      })
        .addOperation(
          StellarSdk.Operation.payment({
            destination: destinationPublicKey,
            // Because Stellar allows transaction in many currencies, you must
            // specify the asset type. The special "native" asset represents Lumens.
            asset: new StellarSdk.Asset('PXL', issuerKeys.publicKey()),
            amount: amount,
          }),
        )
        // A memo allows you to add your own metadata to a transaction. It's
        // optional and does not affect how Stellar treats the transaction.
        .addMemo(StellarSdk.Memo.text('Pixold Transaction'))
        // Wait a maximum of three minutes for the transaction
        .setTimeout(180)
        .build();
      // Sign the transaction to prove you are actually the person sending it.
      transaction.sign(distributorKeys);
      // And finally, send it off to Stellar!
      return server.submitTransaction(transaction);
    })
    .catch(function (error) {
      throw new InternalServerErrorException(error);
      // If the result is unknown (no response body, timeout etc.) we simply resubmit
      // already built transaction:
      // server.submitTransaction(transaction);
    });
};

export const sendTransactionToPixold = async (
  sourceSecretKey: string,
  amount: string,
) => {
  const server = new StellarSdk.Server(STELLAR_API_URL);
  const issuerKeys = StellarSdk.Keypair.fromSecret(STELLAR_ISSUER_SECRET_KEY);
  const senderKeys = StellarSdk.Keypair.fromSecret(sourceSecretKey);

  // Transaction will hold a built transaction we can resubmit if the result is unknown.
  let transaction;

  // First, check to make sure that the destination account exists.
  // You could skip this, but if the account does not exist, you will be charged
  // the transaction fee when the transaction fails.
  server
    .loadAccount(STELLAR_USER_PUBLIC_KEY)
    // If the account is not found, surface a nicer error message for logging.
    .catch(function (error) {
      if (error instanceof StellarSdk.NotFoundError) {
        throw new InternalServerErrorException(`Destination wasn't found`);
      } else throw new InternalServerErrorException(error);
    })
    // If there was no error, load up-to-date information on your account.
    .then(function () {
      return server.loadAccount(senderKeys.publicKey());
    })
    .then(function (sourceAccount) {
      // Start building the transaction.
      transaction = new StellarSdk.TransactionBuilder(sourceAccount, {
        fee: StellarSdk.BASE_FEE,
        networkPassphrase: StellarSdk.Networks.TESTNET, // TODO: change to production
      })
        .addOperation(
          StellarSdk.Operation.payment({
            destination: STELLAR_USER_PUBLIC_KEY,
            // Because Stellar allows transaction in many currencies, you must
            // specify the asset type. The special "native" asset represents Lumens.
            asset: new StellarSdk.Asset('PXL', issuerKeys.publicKey()),
            amount: amount,
          }),
        )
        // A memo allows you to add your own metadata to a transaction. It's
        // optional and does not affect how Stellar treats the transaction.
        .addMemo(StellarSdk.Memo.text('Pixold Transaction'))
        // Wait a maximum of three minutes for the transaction
        .setTimeout(180)
        .build();
      // Sign the transaction to prove you are actually the person sending it.
      transaction.sign(senderKeys);
      // And finally, send it off to Stellar!
      return server.submitTransaction(transaction);
    })
    .catch(function (error) {
      throw new InternalServerErrorException(error);
      // If the result is unknown (no response body, timeout etc.) we simply resubmit
      // already built transaction:
      // server.submitTransaction(transaction);
    });
};
