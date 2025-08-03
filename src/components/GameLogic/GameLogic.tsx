import { Fragment, useEffect, useRef, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import { Html } from '@react-three/drei';
import { Bird3D, Obstacle3D } from '@/components';
import { PerkType } from '@/types';
import {
  PERK_SPEED_UP_MULTIPLIER,
  PERK_SLOW_DOWN_MULTIPLIER,
  PERK_DURATION,
  IS_DEV_MODE,
  PERK_SPAWN_MIN_FRAMES,
  PERK_SPAWN_MAX_FRAMES,
} from '@/constants';

type Props = {
  onGameOver: () => void;
  onScore: () => void;
  gravity: number;
  jump: number;
  paused?: boolean;
  onPerkStateChange?: (
    active: boolean,
    timer: number,
    type?: 'speedUp' | 'slowDown' | 'invert' | null
  ) => void;
};

export const GameLogic = ({
  onGameOver,
  onScore,
  gravity,
  jump,
  paused,
  onPerkStateChange,
}: Props) => {
  const gameHeight = 4.5;
  const gapSize = 1.2;
  const birdX = -0.8;
  const birdRadius = 0.25;
  const groundY = -3;

  // Generate a random gapY for obstacles
  const margin = 0.7;
  function randomGapY() {
    const max = gameHeight / 2 - gapSize / 2 - margin;
    const min = -max;
    return Math.max(min, Math.min(max, (Math.random() * 2 - 1) * max));
  }

  // Pre-start state
  const [started, setStarted] = useState(false);
  const [showStartMsg, setShowStartMsg] = useState(true);

  // State
  const [birdY, setBirdY] = useState(0);
  const velocity = useRef(0);
  const minY = -2.5;
  const maxY = 2.5;
  const [obstacles, setObstacles] = useState<{ x: number; gapY: number; passed: boolean }[]>([]);
  const frame = useRef(0);
  const obstacleCount = useRef(0); // Добавляем счетчик препятствий
  const nextPerkAt = useRef(4 + Math.floor(Math.random() * 7)); // Случайное число от 4 до 10

  console.log(obstacleCount.current);

  // ПЕРКИ
  type Perk = {
    x: number;
    y: number;
    type: PerkType;
    active?: boolean;
    collected?: boolean;
    timer?: number;
  };
  const [perks, setPerks] = useState<Perk[]>([]);
  const [perkActive, setPerkActive] = useState(false);
  const [perkTimer, setPerkTimer] = useState(0);
  const baseObstacleSpeed = 0.03;
  const [obstacleSpeed, setObstacleSpeed] = useState(baseObstacleSpeed);
  const [activePerkType, setActivePerkType] = useState<'speedUp' | 'slowDown' | 'invert' | null>(
    null
  );
  const [invertControl, setInvertControl] = useState(false);

  // Start game on first click/tap or spacebar
  useEffect(() => {
    if (started) return;
    const startHandler = () => {
      setStarted(true);
      setShowStartMsg(false);
      setObstacles([
        { x: 2.5, gapY: randomGapY(), passed: false },
        { x: 5, gapY: randomGapY(), passed: false },
      ]);
      velocity.current = 0;
      setBirdY(0);
      setPerks([]);
      obstacleCount.current = 0; // Сбрасываем счетчик препятствий
    };
    window.addEventListener('mousedown', startHandler);
    const keydownHandler = (e: KeyboardEvent) => {
      if (e.code === 'Space' || e.key === ' ' || e.key === 'Spacebar') {
        startHandler();
      }
    };
    window.addEventListener('keydown', keydownHandler);
    return () => {
      window.removeEventListener('mousedown', startHandler);
      window.removeEventListener('keydown', keydownHandler);
    };
  }, [started]);

  // Handle jump (only after start)
  useEffect(() => {
    if (!started) return;
    const handler = () => {
      velocity.current = invertControl ? -jump : jump;
    };
    window.addEventListener('mousedown', handler);
    const keydownHandler = (e: KeyboardEvent) => {
      if (e.code === 'Space' || e.key === ' ' || e.key === 'Spacebar') {
        handler();
      }
    };
    window.addEventListener('keydown', keydownHandler);
    return () => {
      window.removeEventListener('mousedown', handler);
      window.removeEventListener('keydown', keydownHandler);
    };
  }, [jump, started, invertControl]);

  // Движение перков и коллизия
  useFrame(() => {
    if (paused || !started) return;
    setPerks(prev =>
      prev
        .map(perk => ({ ...perk, x: perk.x - obstacleSpeed }))
        .filter(perk => perk.x > -2.5 && !perk.collected)
    );
    // Проверка коллизии с птицей
    perks.forEach((perk, i) => {
      if (!perk.collected && Math.abs(perk.x - birdX) < 0.22 && Math.abs(perk.y - birdY) < 0.32) {
        // Собрали перк
        setPerks(prev => prev.map((p, idx) => (idx === i ? { ...p, collected: true } : p)));
        setPerkActive(true);
        setPerkTimer(PERK_DURATION);
        setActivePerkType(perk.type);
        if (perk.type === 'speedUp') {
          setObstacleSpeed(baseObstacleSpeed * PERK_SPEED_UP_MULTIPLIER);
          setInvertControl(false);
        } else if (perk.type === 'slowDown') {
          setObstacleSpeed(baseObstacleSpeed * PERK_SLOW_DOWN_MULTIPLIER);
          setInvertControl(false);
        } else if (perk.type === 'invert') {
          setObstacleSpeed(baseObstacleSpeed);
          setInvertControl(true);
        }
      }
    });
  });

  // Таймер действия перка
  useEffect(() => {
    if (!perkActive) return;
    if (perkTimer <= 0) {
      setPerkActive(false);
      setObstacleSpeed(baseObstacleSpeed);
      setActivePerkType(null);
      setInvertControl(false);
      return;
    }
    const t = setTimeout(() => setPerkTimer(perkTimer - 1), 1000);
    return () => clearTimeout(t);
  }, [perkActive, perkTimer]);

  // Notify parent about perk state
  useEffect(() => {
    if (onPerkStateChange) {
      onPerkStateChange(perkActive, perkTimer, activePerkType);
    }
  }, [perkActive, perkTimer, activePerkType, onPerkStateChange]);

  // Main game loop
  useFrame(() => {
    if (paused) return;
    if (!started) return;
    frame.current++;
    // Bird physics
    if (invertControl) {
      velocity.current -= gravity;
    } else {
      velocity.current += gravity;
    }
    let nextY = birdY - velocity.current * 0.03;
    if (nextY < minY) {
      nextY = minY;
      velocity.current = 0;
    }
    if (nextY > maxY) {
      nextY = maxY;
      velocity.current = 0;
    }
    setBirdY(nextY);

    // Obstacles movement and generation
    setObstacles(prev => {
      let next = prev.map(o => ({ ...o, x: o.x - obstacleSpeed, passed: o.passed }));
      next = next.filter(o => o.x > -2.5);
      if (frame.current % 180 === 0) {
        const gapY = randomGapY();
        next.push({ x: 2.5, gapY, passed: false });
        obstacleCount.current++; // Увеличиваем счетчик при создании нового препятствия

        // Создаем перк после случайного количества препятствий
        if (obstacleCount.current === nextPerkAt.current) {
          const spawnX = 2.5 + Math.random() * 3.5; // Случайное число от 2.5 до 6
          // Сдвигаем область появления перков чуть выше, сохраняя размер в 2/3
          const centralMinY = minY + (maxY - minY) / 6; // Начинаем с 1/6 от низа
          const centralMaxY = minY + ((maxY - minY) * 5) / 6; // Заканчиваем на 5/6 от низа
          let attempts = 0;
          let placed = false;
          while (attempts < 5 && !placed) {
            const y = Math.random() * (centralMaxY - centralMinY) + centralMinY;
            // Проверяем все трубы, которые близко к spawnX
            const isInAnyPipeOrGap = obstacles.some(o => {
              // Увеличиваем зону проверки для труб
              if (Math.abs(o.x - spawnX) < 1.5) {
                const gapCenter = o.gapY;
                const gapHalf = gapSize / 2;
                // Верхняя труба
                const topPipeYMin = gapCenter + gapHalf;
                const topPipeYMax = maxY;
                // Нижняя труба
                const botPipeYMax = gapCenter - gapHalf;
                const botPipeYMin = minY;
                // Добавляем небольшой отступ от труб для безопасности
                const SAFETY_MARGIN = 0.2;
                // Если y попадает в gap или в область любой трубы (с учетом отступа) — не спаунить
                if (
                  (y >= gapCenter - gapHalf - SAFETY_MARGIN &&
                    y <= gapCenter + gapHalf + SAFETY_MARGIN) ||
                  (y >= topPipeYMin - SAFETY_MARGIN && y <= topPipeYMax) ||
                  (y >= botPipeYMin && y <= botPipeYMax + SAFETY_MARGIN)
                ) {
                  return true;
                }
              }
              return false;
            });
            if (!isInAnyPipeOrGap) {
              // Вероятности: invert — 2/10, speedUp — 4/10, slowDown — 4/10
              const r = Math.random();
              let type: PerkType;
              if (r < 0.4) type = 'speedUp';
              else if (r < 0.8) type = 'slowDown';
              else type = 'invert';
              setPerks(prev => [...prev, { x: spawnX, y, type }]);
              placed = true;
              // Генерируем новое случайное число для следующего перка
              nextPerkAt.current = obstacleCount.current + 4 + Math.floor(Math.random() * 7);
            }
            attempts++;
          }
        }
      }
      return next;
    });

    // Collision detection
    for (const o of obstacles) {
      // Top obstacle
      const topY = o.gapY + gapSize / 2 + gameHeight / 2;
      const topHeight = gameHeight - o.gapY - gapSize / 2;
      // Bottom obstacle
      const botY = o.gapY - gapSize / 2 - gameHeight / 2;
      const botHeight = gameHeight + o.gapY - gapSize / 2;
      // Check collision (AABB vs circle) только если не в режиме разработки
      if (
        !IS_DEV_MODE &&
        Math.abs(o.x - birdX) < 0.2 + birdRadius &&
        (nextY + birdRadius > topY - topHeight / 2 || nextY - birdRadius < botY + botHeight / 2)
      ) {
        onGameOver();
      }
      // Score
      if (!o.passed && o.x < birdX) {
        o.passed = true;
        onScore();
      }
    }
    // Ground collision только если не в режиме разработки
    if (!IS_DEV_MODE && nextY - birdRadius <= groundY + 0.25) {
      onGameOver();
    }
  });

  // Render
  return (
    <>
      {/* Obstacles (only after start) */}
      {started &&
        obstacles.map((o, i) => {
          // Clamp gapY just in case
          const maxGap = gameHeight / 2 - gapSize / 2 - margin;
          const gapY = Math.max(-maxGap, Math.min(maxGap, o.gapY));
          // Calculate heights, always positive
          const topHeight = Math.max(0.1, gameHeight - gapY - gapSize / 2);
          const botHeight = Math.max(0.1, gameHeight + gapY - gapSize / 2);
          return (
            <Fragment key={i}>
              <Obstacle3D
                position={[o.x, gapY + gapSize / 2 + gameHeight / 2, 0]}
                height={topHeight}
              />
              <Obstacle3D
                position={[o.x, gapY - gapSize / 2 - gameHeight / 2, 0]}
                height={botHeight}
              />
            </Fragment>
          );
        })}
      {/* PERKS */}
      {started &&
        perks.map(
          (perk, i) =>
            !perk.collected && (
              <Html
                key={i}
                position={[perk.x, perk.y, 0]}
                center
                style={{
                  pointerEvents: 'none',
                  fontSize: 32,
                  filter: 'drop-shadow(0 2px 6px #fff8)',
                }}
              >
                {perk.type === 'speedUp' && (
                  <img src="/speed.png" alt="speed" style={{ height: 32 }} />
                )}
                {perk.type === 'slowDown' && (
                  <img src="/slow.png" alt="slow" style={{ height: 32 }} />
                )}
                {perk.type === 'invert' && (
                  <img src="/invert.png" alt="invert" style={{ height: 32 }} />
                )}
              </Html>
            )
        )}
      {/* Bird (always rendered) */}
      <Bird3D
        y={birdY}
        velocity={velocity.current}
        gameOver={paused}
        activePerkType={activePerkType}
        perkTimer={perkTimer}
      />
      {/* Start message */}
      {showStartMsg && (
        <Html
          center
          style={{
            pointerEvents: 'none',
            fontSize: 32,
            color: '#333',
            fontWeight: 700,
          }}
        >
          Click to start
        </Html>
      )}
      {/* DEBUG: perk spawn zone boundaries */}
      {IS_DEV_MODE && (
        <>
          <Html
            position={[0, minY + (maxY - minY) / 6, 0]}
            center
            style={{
              width: 400,
              height: 0,
              borderTop: '3px solid red',
              position: 'absolute',
              left: 0,
              zIndex: 10,
              pointerEvents: 'none',
            }}
          />
          <Html
            position={[0, minY + ((maxY - minY) * 5) / 6, 0]}
            center
            style={{
              width: 400,
              height: 0,
              borderTop: '3px solid red',
              position: 'absolute',
              left: 0,
              zIndex: 10,
              pointerEvents: 'none',
            }}
          />
        </>
      )}
    </>
  );
};
