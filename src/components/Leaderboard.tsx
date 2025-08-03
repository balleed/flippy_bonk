import { useEffect, useState } from 'react';
import {
  collection,
  query,
  orderBy,
  limit,
  getDocs,
  addDoc,
  where,
  startAfter,
  getCountFromServer,
} from 'firebase/firestore';
import { db } from '../lib/firebase';
import { getStoredWallet } from '../utils/wallet';

interface LeaderboardEntry {
  wallet: string;
  score: number;
  timestamp: number;
}

const storedWallet = getStoredWallet();

export const addScore = async (wallet: string, score: number) => {
  try {
    await addDoc(collection(db, 'leaderboard'), {
      wallet,
      score,
      timestamp: Date.now(),
    });
  } catch (error) {
    console.error('Error adding score:', error);
  }
};

export const Leaderboard = () => {
  const [entries, setEntries] = useState<LeaderboardEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [userBestScore, setUserBestScore] = useState<LeaderboardEntry | null>(null);
  const [userRank, setUserRank] = useState<number | null>(null);

  useEffect(() => {
    const wallet = getStoredWallet();
    console.log('Текущий кошелек:', wallet?.address);
    fetchLeaderboard();
  }, []);

  const fetchLeaderboard = async () => {
    try {
      const leaderboardRef = collection(db, 'leaderboard');

      // Получаем топ-10
      const topQuery = query(leaderboardRef, orderBy('score', 'desc'), limit(10));
      const topSnapshot = await getDocs(topQuery);
      const topEntries = topSnapshot.docs.map(doc => ({
        wallet: doc.data().wallet,
        score: doc.data().score,
        timestamp: doc.data().timestamp,
      }));
      console.log('Топ-10 игроков:', { topEntries, storedWallet });

      // Если есть текущий кошелек, получаем его лучший результат и ранг
      if (storedWallet) {
        const userQuery = query(
          leaderboardRef,
          where('wallet', '==', storedWallet.address),
          orderBy('score', 'desc'),
          limit(1)
        );
        const userSnapshot = await getDocs(userQuery);

        if (!userSnapshot.empty) {
          const userBest = {
            wallet: userSnapshot.docs[0].data().wallet,
            score: userSnapshot.docs[0].data().score,
            timestamp: userSnapshot.docs[0].data().timestamp,
          };
          console.log('Лучший результат пользователя:', userBest);
          setUserBestScore(userBest);

          // Получаем количество игроков с лучшим результатом
          const betterScoresQuery = query(
            leaderboardRef,
            where('score', '>', userBest.score),
            orderBy('score', 'desc')
          );
          const betterScoresSnapshot = await getCountFromServer(betterScoresQuery);
          const rank = betterScoresSnapshot.data().count + 1;
          console.log('Место пользователя:', rank);
          setUserRank(rank);
        } else {
          console.log('Пользователь не найден в лидерборде');
        }
      }

      setEntries(topEntries);
    } catch (error) {
      console.error('Error fetching leaderboard:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div style={{ color: '#fff', textAlign: 'center' }}>Loading...</div>;
  }

  return (
    <div
      style={{
        background: 'rgba(0,0,0,0.25)',
        border: '2px solid #7ED957',
        borderRadius: 8,
        padding: 16,
        width: '100%',
      }}
    >
      <h2
        style={{
          color: '#B6FF9E',
          fontSize: 24,
          marginBottom: 16,
          textAlign: 'center',
          fontFamily: 'Luckiest Guy, Arial, Helvetica, sans-serif',
        }}
      >
        Leaderboard
      </h2>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        {entries.map((entry, index) => (
          <div
            key={index}
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              padding: '8px 12px',
              background: 'rgba(0,0,0,0.2)',
              borderRadius: 6,
              border: '1px solid rgba(126, 217, 87, 0.3)',
            }}
          >
            <span
              style={{
                color: entry.wallet === storedWallet ? '#B6FF9E' : '#fff',
                fontSize: 16,
                fontFamily: 'Luckiest Guy, Arial, Helvetica, sans-serif',
              }}
            >
              {index + 1}.{' '}
              {entry.wallet === storedWallet
                ? 'You'
                : `${entry.wallet.slice(0, 4)}...${entry.wallet.slice(-4)}`}
            </span>
            <span
              style={{
                color: '#B6FF9E',
                fontSize: 18,
                fontWeight: 'bold',
                fontFamily: 'Luckiest Guy, Arial, Helvetica, sans-serif',
              }}
            >
              {entry.score}
            </span>
          </div>
        ))}

        {userBestScore && userRank && userRank > 10 && (
          <>
            <div
              style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                padding: '8px 12px',
                color: '#fff',
                fontSize: 16,
                fontFamily: 'Luckiest Guy, Arial, Helvetica, sans-serif',
              }}
            >
              ...
            </div>
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: '8px 12px',
                background: 'rgba(0,0,0,0.2)',
                borderRadius: 6,
                border: '1px solid rgba(126, 217, 87, 0.3)',
              }}
            >
              <span
                style={{
                  color: '#B6FF9E',
                  fontSize: 16,
                  fontFamily: 'Luckiest Guy, Arial, Helvetica, sans-serif',
                }}
              >
                {userRank}. You
              </span>
              <span
                style={{
                  color: '#B6FF9E',
                  fontSize: 18,
                  fontWeight: 'bold',
                  fontFamily: 'Luckiest Guy, Arial, Helvetica, sans-serif',
                }}
              >
                {userBestScore.score}
              </span>
            </div>
          </>
        )}
      </div>
    </div>
  );
};
