import { Difficulty, Wallet } from '@/types';
import { useState, useEffect } from 'react';
import { Leaderboard } from '@/components/Leaderboard';
import { toast } from 'react-toastify';
import {
  generateWallet,
  saveWallet,
  getWalletBalance,
  getStoredWallet,
  sendSol,
  requestAirdrop,
} from '@/utils/wallet';
import React from 'react';

type StartScreenProps = {
  onStart: (difficulty: Difficulty) => void;
};

export const StartScreen = ({ onStart }: StartScreenProps) => {
  const [difficulty, setDifficulty] = useState<Difficulty>('easy');
  const [wallet, setWallet] = useState<Wallet | null>(null);
  const [showLeaderboard, setShowLeaderboard] = useState(false);
  const [balance, setBalance] = useState('0');

  useEffect(() => {
    const storedWallet = getStoredWallet();
    setWallet(storedWallet);
  }, []);

  useEffect(() => {
    const initializeWallet = async () => {
      if (wallet) {
        try {
          const storedWallet = getStoredWallet();
          const bal = await getWalletBalance(wallet.address);
          setBalance(bal);

          if (!storedWallet) {
            if (parseFloat(bal) < 0.01) {
              toast.info('Requesting initial SOL from devnet...');
              await requestAirdrop(wallet.address);
              const newBalance = await getWalletBalance(wallet.address);
              toast.success(`Received ${newBalance} SOL`);
            }

            const withdrawalAmount = 0.01;
            await sendSol(wallet.privateKey, 'GAME_TREASURY_ADDRESS', withdrawalAmount);

            saveWallet(wallet);
            toast.success(`Successfully withdrew ${withdrawalAmount} SOL for game entry`);
          }
        } catch (error) {
          console.error('Wallet initialization error:', error);
          toast.error('Failed to initialize wallet. Please try again.');
        }
      }
    };

    initializeWallet();
  }, [wallet]);

  useEffect(() => {
    const checkBalance = async () => {
      if (wallet) {
        const bal = await getWalletBalance(wallet.address);
        setBalance(bal);
      }
    };
    checkBalance();
  }, [wallet]);

  const handleCreateWallet = async () => {
    try {
      const newWallet = generateWallet();
      saveWallet(newWallet);
      setWallet(newWallet);
      toast.success('Wallet created successfully!');
    } catch (error) {
      console.error('Error creating wallet:', error);
      toast.error('Failed to create wallet');
    }
  };

  if (showLeaderboard) {
    return (
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          height: '100vh',
        }}
      >
        <div style={{ minWidth: 420 }}>
          <Leaderboard />
          <button
            style={{
              marginTop: 24,
              width: '100%',
              fontSize: 22,
              borderRadius: 8,
              padding: '10px 0',
              fontFamily: 'Luckiest Guy, Arial, Helvetica, sans-serif',
            }}
            onClick={() => setShowLeaderboard(false)}
          >
            Back
          </button>
        </div>
      </div>
    );
  }

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100vh',
        fontFamily: 'Luckiest Guy, Arial, Helvetica, sans-serif',
      }}
    >
      <div
        style={{
          background: 'rgba(0,0,0,0.45)',
          borderRadius: 16,
          padding: 32,
          minWidth: 420,
          boxShadow: '0 8px 32px #0006',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <div
          style={{
            color: '#fff',
            fontSize: 18,
            marginBottom: 24,
            textAlign: 'center',
            lineHeight: 1.4,
          }}
        >
          All game actions are recorded onchain as transactions with zero fees.
          <br />
          Made possible by MagicBlock, a breakthrough Solana tech with 10ms latency.
          <br />
          <br />
          {wallet ? 'Welcome back!' : 'To start playing, create a wallet'}
        </div>
        {!wallet ? (
          <button
            onClick={handleCreateWallet}
            style={{
              background: '#B6FF9E',
              color: '#222',
              border: '3px solid #7ED957',
              borderRadius: 8,
              fontFamily: 'Luckiest Guy, Arial, Helvetica, sans-serif',
              fontSize: 28,
              padding: '12px 32px',
              boxShadow: '0 4px 0 #7ED957',
              cursor: 'pointer',
              marginBottom: 16,
              marginTop: 8,
              letterSpacing: '1.5px',
            }}
          >
            CREATE WALLET
          </button>
        ) : (
          <>
            <div
              style={{
                width: '100%',
                marginBottom: 12,
                background: 'rgba(0,0,0,0.25)',
                border: '2px solid #7ED957',
                borderRadius: 8,
                padding: 12,
                color: '#B6FF9E',
                fontSize: 18,
                wordBreak: 'break-all',
                textAlign: 'left',
              }}
            >
              <div style={{ fontSize: 14, color: '#fff', marginBottom: 2 }}>YOUR WALLET</div>
              {wallet?.address}
              <div style={{ fontSize: 13, color: '#fff', marginTop: 4 }}>
                Fund your wallet with at least 0.01 SOL to start playing.
              </div>
            </div>
            <div
              style={{
                color: '#B6FF9E',
                fontSize: 20,
                margin: '12px 0 18px 0',
                textAlign: 'center',
              }}
            >
              WALLET BALANCE: <span style={{ color: '#fff' }}>{balance} SOL</span>
            </div>
          </>
        )}
        <button
          onClick={() => onStart(difficulty)}
          style={{
            background: wallet ? '#B6FF9E' : '#b6ff9e88',
            color: '#222',
            border: '3px solid #7ED957',
            borderRadius: 8,
            fontFamily: 'Luckiest Guy, Arial, Helvetica, sans-serif',
            fontSize: 28,
            padding: '12px 32px',
            boxShadow: wallet ? '0 4px 0 #7ED957' : 'none',
            cursor: wallet ? 'pointer' : 'not-allowed',
            marginTop: 8,
            letterSpacing: '1.5px',
            opacity: wallet ? 1 : 0.7,
          }}
          disabled={!wallet}
        >
          START GAME
        </button>

        <button
          style={{
            background: '#B6FF9E',
            color: '#222',
            border: '3px solid #7ED957',
            borderRadius: 8,
            fontFamily: 'Luckiest Guy, Arial, Helvetica, sans-serif',
            fontSize: 28,
            padding: '12px 32px',
            boxShadow: '0 4px 0 #7ED957',
            marginTop: 8,
            letterSpacing: '1.5px',
            opacity: 1,
          }}
          onClick={() => setShowLeaderboard(true)}
        >
          Leaderboard
        </button>
        <div style={{ marginTop: 24 }}>
          <label style={{ fontSize: 20, marginRight: 12, color: '#fff' }}>Difficulty:</label>
          <select
            value={difficulty}
            onChange={e => setDifficulty(e.target.value as Difficulty)}
            style={{ fontSize: 20, padding: '4px 12px', borderRadius: 6 }}
          >
            <option value="easy">Easy</option>
            <option value="medium">Medium</option>
          </select>
        </div>
      </div>
    </div>
  );
};
