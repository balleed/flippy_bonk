import { useFrame } from '@react-three/fiber';
import { useRef, useMemo, useState, forwardRef } from 'react';
import * as THREE from 'three';
import { PerkType } from '@/types';

const BIRD_COLORS = {
  default: { body: '#FFD700', beak: '#FF9800' },
  speedUp: { body: '#FF3B3B', beak: '#B80000' },
  slowDown: { body: '#7EC9FF', beak: '#5BA3D9' },
  invert: { body: '#8A2BE2', beak: '#4B0082' },
};

export const Bird3D = ({
  y,
  velocity,
  gameOver,
  activePerkType,
  perkTimer,
}: {
  y: number;
  velocity: number;
  gameOver?: boolean;
  activePerkType?: PerkType;
  perkTimer?: number;
}) => {
  // Animate wing flapping
  const rightWingRef = useRef<THREE.Mesh>(null);
  // Tilt the bird depending on velocity
  const groupRef = useRef<THREE.Group>(null);
  // Состояние моргания
  const [isBlinking, setIsBlinking] = useState(false);
  // Таймер для моргания
  const blinkTimer = useRef(0);
  // Состояние мигания цветом
  const [isColorBlinking, setIsColorBlinking] = useState(false);

  // Определяем цвет птицы в зависимости от активного перка
  const { body: birdColor, beak: beakColor } = useMemo(() => {
    // Если осталось 3 секунды или меньше и перк активен - мигаем цветом
    if (perkTimer !== undefined && perkTimer <= 3 && perkTimer > 0) {
      return isColorBlinking
        ? BIRD_COLORS.default
        : BIRD_COLORS[(activePerkType as keyof typeof BIRD_COLORS) || 'default'];
    }
    return (
      BIRD_COLORS[(activePerkType as keyof typeof BIRD_COLORS) || 'default'] || BIRD_COLORS.default
    );
  }, [activePerkType, perkTimer, isColorBlinking]);

  useFrame((state, delta) => {
    const t = state.clock.getElapsedTime();
    let flapSpeed = 6;
    if (activePerkType === 'speedUp') flapSpeed = 20;
    else if (activePerkType === 'slowDown') flapSpeed = 2;
    const flap = Math.sin(t * flapSpeed) * 0.5 + 0.5;
    if (!gameOver) {
      if (rightWingRef.current) {
        rightWingRef.current.rotation.x = -0.5 - flap * 0.7;
      }
    }
    // Bird tilt: up when going up, down when falling
    if (groupRef.current) {
      // Clamp angle between -0.7 (up) and 1.2 (down)
      const angle = Math.max(-0.7, Math.min(1.2, velocity * 0.24));
      groupRef.current.rotation.z = angle;
    }

    // Мигание цветом в последние 3 секунды
    if (perkTimer !== undefined && perkTimer <= 3 && perkTimer > 0) {
      // Мигаем каждые 0.2 секунды
      if (Math.floor(t * 5) % 2 === 0) {
        if (!isColorBlinking) setIsColorBlinking(true);
      } else {
        if (isColorBlinking) setIsColorBlinking(false);
      }
    } else if (isColorBlinking) {
      setIsColorBlinking(false);
    }

    // Моргание: случайный интервал 2-4 сек, длительность 0.12 сек
    if (activePerkType !== 'speedUp' && activePerkType !== 'invert') {
      blinkTimer.current -= delta;
      if (blinkTimer.current <= 0) {
        if (!isBlinking) {
          setIsBlinking(true);
          blinkTimer.current = 0.12; // длительность моргания
        } else {
          setIsBlinking(false);
          blinkTimer.current = 2 + Math.random() * 2; // следующий морг
        }
      }
    } else {
      // Если speedUp — глаза всегда открыты, если invert — всегда закрыты
      if (activePerkType === 'speedUp' && isBlinking) {
        setIsBlinking(false);
      } else if (activePerkType === 'invert' && !isBlinking) {
        setIsBlinking(true);
      }
    }
  });

  return (
    <group ref={groupRef} position={[-0.8, y, 0]} castShadow receiveShadow>
      {/* Корпус */}
      <mesh castShadow>
        <sphereGeometry args={[0.25, 10, 7, 2]} />
        <meshStandardMaterial color={birdColor} flatShading />
      </mesh>
      {/* Клюв */}
      <mesh position={[0.28, 0, 0]} rotation={[0, 0, 300]}>
        <coneGeometry args={[0.07, 0.18, 8]} />
        <meshStandardMaterial color={beakColor} flatShading />
      </mesh>

      {/* Правое крыло — 3D ромб */}
      <DiamondWing
        ref={rightWingRef}
        color={birdColor}
        position={[-0.18, 0.03, 0.22]}
        rotation={[0, 0, -Math.PI / 15.5]}
      />
      {/* Хвост */}
      <mesh position={[-0.23, 0.08, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <coneGeometry args={[0.06, 0.13, 6]} />
        <meshStandardMaterial color={beakColor} />
      </mesh>
      {/* Левый глаз (белый) */}
      {!isBlinking && !gameOver ? (
        <mesh position={[0.17, 0.09, 0.13]}>
          <sphereGeometry args={[0.045, 8, 6]} />
          <meshStandardMaterial color="#fff" />
        </mesh>
      ) : (
        // Моргающий или закрытый глаз — чёрная полоска
        <mesh position={[0.17, 0.09, 0.13]}>
          <boxGeometry args={[0.045, 0.012, 0.045]} />
          <meshStandardMaterial color="#222" />
        </mesh>
      )}
      {/* Правый глаз (белый) */}
      {!isBlinking && !gameOver ? (
        <mesh position={[0.17, 0.09, -0.13]}>
          <sphereGeometry args={[0.045, 8, 6]} />
          <meshStandardMaterial color="#fff" />
        </mesh>
      ) : (
        <mesh position={[0.17, 0.09, -0.13]}>
          <boxGeometry args={[0.045, 0.012, 0.045]} />
          <meshStandardMaterial color="#222" />
        </mesh>
      )}
      {/* Левый зрачок */}
      <mesh position={[0.21, 0.09, 0.13]}>
        <sphereGeometry args={[0.018, 6, 4]} />
        <meshStandardMaterial color="#222" />
      </mesh>
      {/* Правый зрачок */}
      <mesh position={[0.21, 0.09, -0.13]}>
        <sphereGeometry args={[0.018, 6, 4]} />
        <meshStandardMaterial color="#222" />
      </mesh>
    </group>
  );
};

// Вспомогательный компонент для 3D ромбовидного крыла (6 граней) с поддержкой ref
const DiamondWing = forwardRef<
  THREE.Mesh,
  { color: string; position: [number, number, number]; rotation: [number, number, number] }
>(({ color, position, rotation }, ref) => {
  const geometry = useMemo(() => {
    const geom = new THREE.BufferGeometry();
    const vertices = new Float32Array([
      0, 0, 0, 0.22, 0.09, 0, 0.22, -0.09, 0, 0.11, 0, 0.08, 0.11, 0, -0.08, 0.33, 0, 0,
    ]);
    const indices = [0, 1, 3, 0, 3, 2, 0, 2, 4, 0, 4, 1, 1, 3, 5, 3, 2, 5, 2, 4, 5, 4, 1, 5];
    geom.setIndex(indices);
    geom.setAttribute('position', new THREE.BufferAttribute(vertices, 3));
    geom.computeVertexNormals();
    return geom;
  }, []);
  return (
    <mesh ref={ref} position={position} rotation={rotation} geometry={geometry}>
      <meshStandardMaterial color={color} flatShading side={THREE.DoubleSide} />
    </mesh>
  );
});

DiamondWing.displayName = 'DiamondWing';
