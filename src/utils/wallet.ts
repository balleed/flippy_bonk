import { Keypair, Connection, LAMPORTS_PER_SOL, PublicKey, Transaction, SystemProgram } from '@solana/web3.js';

const connection = new Connection('https://api.devnet.solana.com', 'confirmed');

// Add this helper function
const isBrowser = () => typeof window !== 'undefined';

export const generateWallet = () => {
  const keypair = Keypair.generate();
  
  return {
    address: keypair.publicKey.toString(),
    privateKey: Buffer.from(keypair.secretKey).toString('base64')
  };
};

// Reconstruct keypair from private key
export const getKeypairFromPrivateKey = (privateKey: string) => {
  const secretKey = Buffer.from(privateKey, 'base64');
  return Keypair.fromSecretKey(secretKey);
};

// Get wallet balance
export const getWalletBalance = async (address: string) => {
  try {
    const publicKey = new PublicKey(address);
    const balance = await connection.getBalance(publicKey);
    return (balance / LAMPORTS_PER_SOL).toString(); // Convert lamports to SOL
  } catch (error) {
    console.error('Error getting balance:', error);
    return '0';
  }
};

// Request airdrop (devnet only)
export const requestAirdrop = async (address: string) => {
  try {
    const publicKey = new PublicKey(address);
    const signature = await connection.requestAirdrop(
      publicKey,
      LAMPORTS_PER_SOL // Request 1 SOL
    );
    await connection.confirmTransaction(signature);
    return signature;
  } catch (error) {
    console.error('Error requesting airdrop:', error);
    throw error;
  }
};

// Send SOL to another address
export const sendSol = async (
  fromPrivateKey: string,
  toAddress: string,
  amount: number
) => {
  try {
    const fromKeypair = getKeypairFromPrivateKey(fromPrivateKey);
    const toPublicKey = new PublicKey(toAddress);
    
    const transaction = new Transaction().add(
      SystemProgram.transfer({
        fromPubkey: fromKeypair.publicKey,
        toPubkey: toPublicKey,
        lamports: amount * LAMPORTS_PER_SOL
      })
    );

    const signature = await connection.sendTransaction(
      transaction,
      [fromKeypair]
    );
    
    await connection.confirmTransaction(signature);
    return signature;
  } catch (error) {
    console.error('Error sending SOL:', error);
    throw error;
  }
};

// Get transaction history
export const getTransactionHistory = async (address: string) => {
  try {
    const publicKey = new PublicKey(address);
    const signatures = await connection.getSignaturesForAddress(publicKey);
    return signatures;
  } catch (error) {
    console.error('Error getting transaction history:', error);
    return [];
  }
};

// Update storage functions
export const saveWallet = (walletData: { address: string, privateKey: string }) => {
  if (isBrowser()) {
    localStorage.setItem('gameWallet', JSON.stringify(walletData));
  }
};

export const getStoredWallet = () => {
  if (!isBrowser()) {
    return null;
  }
  const data = localStorage.getItem('gameWallet');
  return data ? JSON.parse(data) : null;
};

export const deleteStoredWallet = () => {
  if (isBrowser()) {
    localStorage.removeItem('gameWallet');
  }
};

// Validate Solana address
export const isValidSolanaAddress = (address: string) => {
  try {
    new PublicKey(address);
    return true;
  } catch {
    return false;
  }
};

// Add this to your existing wallet.ts file
export const addScore = async (address: string, score: number) => {
  try {
    // For now, just store in localStorage as example
    const scores = JSON.parse(localStorage.getItem('gameScores') || '{}');
    scores[address] = Math.max(score, scores[address] || 0);
    localStorage.setItem('gameScores', JSON.stringify(scores));
    
    // Here you would typically make an API call to store the score
    // return await fetch('/api/scores', {
    //   method: 'POST',
    //   body: JSON.stringify({ address, score })
    // });
  } catch (error) {
    console.error('Error saving score:', error);
    throw error;
  }
}; 