'use client';

import { useState } from 'react';
import { Canvas } from '@react-three/fiber';
import { toast } from 'react-toastify';
import { Difficulty, PerkType } from '@/types';
import { Leaderboard, addScore } from '@/components/Leaderboard';
import { GameLogic } from '@/components/GameLogic/GameLogic';
import { PERK_SLOW_DOWN_MULTIPLIER, PERK_SPEED_UP_MULTIPLIER } from '@/constants';
import { LowPolyGround } from '@/components/LowPolyGround';
import { CityBackground3D } from '@/components/Background';
import { StartScreen } from '@/components/Screen/StartScreen/StartScreen';
import React from 'react';
import { GameOver } from '@/components/Screen/GameOver/GameOver';

const DIFFICULTY = {
  easy: { gravity: 0.0583, jump: -1.8 },
  medium: { gravity: 0.175, jump: -3 },
};

export default function HomePage() {
  const [started, setStarted] = useState(false);
  const [difficulty, setDifficulty] = useState<Difficulty>('easy');
  const [score, setScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [restartKey, setRestartKey] = useState(0);
  const [perkActive, setPerkActive] = useState(false);
  const [perkTimer, setPerkTimer] = useState(0);
  const [activePerkType, setActivePerkType] = useState<PerkType>(null);
  const [scoreSaved, setScoreSaved] = useState(false);
  const [showLeaderboard, setShowLeaderboard] = useState(false);

  const handleGameOver = async () => {
    setGameOver(true);
    if (!scoreSaved && score > 0) {
      try {
        setScoreSaved(true);
        // Получаем адрес кошелька из localStorage
        const walletData =
          typeof window !== 'undefined' ? localStorage.getItem('gameWallet') : null;
        const wallet = walletData ? JSON.parse(walletData).address : null;
        if (wallet) {
          await addScore(wallet, score);
          toast.success('Score saved to leaderboard!');
        } else {
          toast.error('Wallet not found, score not saved');
        }
      } catch (error) {
        console.error('Error saving score:', error);
        toast.error('Failed to save score');
      }
    }
  };
  const handleScore = () => {
    setScore(s => s + 1);
  };
  const handleRestart = () => {
    setScore(0);
    setGameOver(false);
    setRestartKey(k => k + 1);
    setScoreSaved(false);
  };
  const handleMainMenu = () => {
    setScore(0);
    setGameOver(false);
    setRestartKey(0);
    setScoreSaved(false);
    setPerkActive(false);
    setPerkTimer(0);
    setActivePerkType(null);
    setStarted(false);
  };

  const { gravity, jump } = DIFFICULTY[difficulty];

  if (!started) {
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
            <button onClick={() => setShowLeaderboard(false)}>Back</button>
          </div>
        </div>
      );
    }

    return (
      <StartScreen
        onStart={d => {
          setDifficulty(d);
          setStarted(true);
        }}
      />
    );
  }

  const showPerkTimer = perkActive && activePerkType && !gameOver;

  return (
    <div
      style={{
        width: '100vw',
        height: '100vh',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      <Canvas
        camera={{ position: [0, 0, 5], fov: 60 }}
        style={{
          background: 'linear-gradient(to bottom, #A8CFD9 0%, #94B7C2 70%, #88A5B8 100%)',
        }}
        shadows
      >
        <ambientLight intensity={0.6} />
        <directionalLight position={[5, 10, 7]} intensity={1.7} castShadow />
        {/* 3D City background, but visually 2D */}
        <CityBackground3D />
        {/* Ground */}
        <LowPolyGround position={[0, -3, 0]} paused={gameOver} />
        {/* Game logic and objects (always rendered, but paused on game over) */}
        <GameLogic
          key={restartKey}
          onGameOver={handleGameOver}
          onScore={handleScore}
          gravity={gravity}
          jump={jump}
          paused={gameOver}
          onPerkStateChange={(active, timer, type) => {
            setPerkActive(active);
            setPerkTimer(timer);
            setActivePerkType(type ?? null);
          }}
        />
      </Canvas>
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: 60,
          zIndex: 2,
        }}
      >
        {/* Score слева */}
        <div
          style={{
            position: 'absolute',
            left: 24,
            top: 10,
            fontSize: 22,
            color: '#222',
            fontWeight: 700,
            fontFamily: 'Luckiest Guy, Arial, Helvetica, sans-serif',
            letterSpacing: 1.5,
            userSelect: 'none',
          }}
        >
          SCORE: {score}
        </div>
        {/* Перковый таймер по центру */}
        {showPerkTimer && (
          <div
            style={{
              position: 'absolute',
              left: '50%',
              top: 6,
              transform: 'translateX(-50%)',
              fontFamily: 'Luckiest Guy, Arial, Helvetica, sans-serif',
              fontSize: 16,
              color: '#fff',
              background: 'rgba(0,0,0,0.55)',
              borderRadius: 16,
              padding: '8px',
              fontWeight: 700,
              letterSpacing: 1.5,
              border: activePerkType === 'speedUp' ? '3px solid #7ED957' : '3px solid #7EC9FF',
              boxShadow:
                activePerkType === 'speedUp'
                  ? '0 2px 8px #222, 0 0 0 4px #b6ff9e44'
                  : '0 2px 8px #222, 0 0 0 4px #7ec9ff44',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              minWidth: 100,
              lineHeight: 1.1,
              userSelect: 'none',
            }}
          >
            {activePerkType === 'speedUp' && (
              <span
                style={{
                  fontSize: 16,
                  color: '#B6FF9E',
                }}
              >
                +{PERK_SPEED_UP_MULTIPLIER * 100 - 100}% SPEED
              </span>
            )}
            {activePerkType === 'slowDown' && (
              <span
                style={{
                  fontSize: 16,
                  color: '#7EC9FF',
                }}
              >
                -{PERK_SLOW_DOWN_MULTIPLIER * 100}% SPEED
              </span>
            )}

            {activePerkType === 'invert' && (
              <span
                style={{
                  fontSize: 16,
                  color: '#7EC9FF',
                }}
              >
                🔄 INVERTED
              </span>
            )}
            <span
              style={{
                fontSize: 16,
                color: '#fff',
                fontWeight: 900,
                marginTop: 2,
              }}
            >
              {perkTimer} sec
            </span>
          </div>
        )}
      </div>
      {gameOver && <GameOver handleRestart={handleRestart} handleMainMenu={handleMainMenu} />}
    </div>
  );
}
