import { useMemo } from 'react';
import * as THREE from 'three';
import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';

export const LowPolyGround = ({
  position,
  paused,
}: {
  position: [number, number, number];
  paused?: boolean;
}) => {
  const meshRefs = [useRef<THREE.Mesh>(null), useRef<THREE.Mesh>(null)];
  // Генерируем массив высот для X-координат (края совпадают)
  const geometry = useMemo(() => {
    const width = 17;
    const widthSegments = 34;
    const height = 2;
    const heightSegments = 8;
    // Сначала массив высот для всех X (по ширине)
    const edgeHeights: number[] = [];
    for (let i = 0; i <= widthSegments; i++) {
      edgeHeights.push((Math.random() - 0.5) * 0.18);
    }
    const geo = new THREE.PlaneGeometry(width, height, widthSegments, heightSegments);
    geo.rotateX(-Math.PI / 2);
    // Делаем поверхность неровной
    const pos = geo.attributes.position;
    for (let i = 0; i < pos.count; i++) {
      // Индексы по сетке
      const ix = i % (widthSegments + 1);
      const iz = Math.floor(i / (widthSegments + 1));
      // Если крайняя вершина по X — используем edgeHeights
      if (iz === 0 || iz === heightSegments) {
        pos.setY(i, edgeHeights[ix] * 2.7);
      } else {
        pos.setY(i, pos.getY(i) + (Math.random() - 0.5) * 0.5);
      }
    }
    pos.needsUpdate = true;
    // Для каждой вершины задаём насыщенный оттенок зелёного
    const colors = [];
    for (let i = 0; i < pos.count; i++) {
      const shade = 0.85 + Math.random() * 0.25; // более ярко и насыщенно
      colors.push(0.18 * shade, 0.85 * shade, 0.18 * shade);
    }
    geo.setAttribute('color', new THREE.Float32BufferAttribute(colors, 3));
    return geo;
  }, []);

  // Анимация смещения двух плиток
  useFrame((_, delta) => {
    if (paused) return;
    for (let i = 0; i < 2; i++) {
      const mesh = meshRefs[i].current;
      if (mesh) {
        mesh.position.x -= delta * 0.5;
        // Если плитка ушла влево за -16, переносим её вправо за вторую
        if (mesh.position.x < -16) {
          mesh.position.x += 32;
        }
      }
    }
  });

  return (
    <>
      <mesh ref={meshRefs[0]} geometry={geometry} position={position} receiveShadow>
        <meshStandardMaterial vertexColors flatShading />
      </mesh>
      <mesh
        ref={meshRefs[1]}
        geometry={geometry}
        position={[16, position[1], position[2]]}
        receiveShadow
      >
        <meshStandardMaterial vertexColors flatShading />
      </mesh>
    </>
  );
};
