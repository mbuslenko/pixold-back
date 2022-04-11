import { Connection, PublicKey, ConfirmedTransaction } from "@solana/web3.js";
import {SOLANA.web3 } from "@solana/web3.js";

const {struct, u32, ns64} = require("@solana/buffer-layout");
const {Buffer} = require('buffer');
const web3 = require("@solana/web3.js");

let keypair = web3.Keypair.generate();
let payer = web3.Keypair.generate();

let connection = new web3.Connection(web3.clusterApiUrl('testnet'));

let airdropSignature = await connection.requestAirdrop(
  payer.publicKey,
  web3.LAMPORTS_PER_SOL,
);

await connection.confirmTransaction(airdropSignature);

(async () => {
    
    console.log(web3.clusterApiUrl('devnet'))
    const connection = new web3.Connection(
      web3.clusterApiUrl('devnet'),
      'confirmed',
    );
   
    const from = web3.Keypair.generate();
    const airdropSignature = await connection.requestAirdrop(
      from.publicKey,
      web3.LAMPORTS_PER_SOL,
    );
    await connection.confirmTransaction(airdropSignature);
  
    // Generate a new random public key
    const to = web3.Keypair.generate();
  
  
    const transaction = new web3.Transaction().add(
      web3.SystemProgram.transfer({
        fromPubkey: from.publicKey,
        toPubkey: to.publicKey,
        lamports: web3.LAMPORTS_PER_SOL / 100,
      }),
    );
  
    
    const signature = await web3.sendAndConfirmTransaction(
      connection,
      transaction,
      [from],
    );
    console.log('SIGNATURE', signature);
  })();