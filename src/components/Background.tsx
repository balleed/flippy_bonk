import { useLoader, useFrame } from '@react-three/fiber';
import { useRef } from 'react';
import * as THREE from 'three';

export const CityBackground3D = () => {
  // Загружаем текстуру
  const texture = useLoader(THREE.TextureLoader, '/sky.png');
  const meshRefs = [useRef<THREE.Mesh>(null), useRef<THREE.Mesh>(null)];
  const width = 18;
  // Анимация движения фона
  useFrame((_, delta) => {
    for (let i = 0; i < 2; i++) {
      const mesh = meshRefs[i].current;
      if (mesh) {
        mesh.position.x -= delta * 0.12; // скорость движения
        if (mesh.position.x < -width) {
          mesh.position.x += width * 2;
        }
      }
    }
  });
  return (
    <>
      <mesh ref={meshRefs[0]} position={[0, 0, -2]}>
        <planeGeometry args={[width, 9]} />
        <meshBasicMaterial map={texture} toneMapped={false} />
      </mesh>
      <mesh ref={meshRefs[1]} position={[width, 0, -2]}>
        <planeGeometry args={[width, 9]} />
        <meshBasicMaterial map={texture} toneMapped={false} />
      </mesh>
    </>
  );
};
