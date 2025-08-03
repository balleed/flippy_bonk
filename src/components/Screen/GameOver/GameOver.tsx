import { ArrowPathIcon, HomeIcon } from '@heroicons/react/24/solid';
import { useEffect } from 'react';

export const GameOver = ({
  handleRestart,
  handleMainMenu,
}: {
  handleRestart: () => void;
  handleMainMenu: () => void;
}) => {
  useEffect(() => {
    const keydownHandler = (e: KeyboardEvent) => {
      if (e.code === 'Space' || e.key === ' ' || e.key === 'Spacebar') {
        handleRestart();
      }
    };
    window.addEventListener('keydown', keydownHandler);
    return () => {
      window.removeEventListener('keydown', keydownHandler);
    };
  }, [handleRestart]);
  return (
    <div
      style={{
        position: 'absolute',
        top: '40%',
        left: 0,
        width: '100%',
        textAlign: 'center',
      }}
    >
      <div
        style={{
          fontSize: 36,
          fontWeight: 700,
          color: '#c62828',
          marginBottom: 16,
        }}
      >
        Game Over
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', alignItems: 'center' }}>
        <button
          onClick={handleRestart}
          style={{
            fontSize: 24,
            padding: '12px 32px',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: 8,
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <ArrowPathIcon width={24} height={24} style={{ paddingBottom: 4 }} />
            <div style={{ fontSize: 24, lineHeight: '24px' }}>Restart</div>
          </div>
        </button>
        <button
          onClick={handleMainMenu}
          style={{
            cursor: 'pointer',
            gap: 8,
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <HomeIcon width={24} height={24} style={{ paddingBottom: 4 }} />
            <div style={{ fontSize: 24, lineHeight: '24px' }}>Main Menu</div>
          </div>
        </button>
      </div>
    </div>
  );
};
