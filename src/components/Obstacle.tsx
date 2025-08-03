export const Obstacle3D = ({
  position,
  height,
}: {
  position: [number, number, number];
  height: number;
}) => {
  return (
    <>
      {/* Основная полая труба */}
      <mesh position={position} castShadow>
        <cylinderGeometry args={[0.22, 0.22, height, 12, 1, true]} />
        <meshStandardMaterial color="#6EC16E" flatShading side={2} />
      </mesh>
      {/* Внутренняя чёрная труба */}
      <mesh position={position}>
        <cylinderGeometry args={[0.2, 0.2, height * 0.98, 12, 1, true]} />
        <meshStandardMaterial color="#111" flatShading side={2} />
      </mesh>
      {/* Верхний торец — объёмная шапка */}
      <mesh position={[position[0], position[1] + height / 2 + 0.12, position[2]]}>
        <cylinderGeometry args={[0.25, 0.25, 0.24, 12]} />
        <meshStandardMaterial color="#4E9A4E" flatShading />
      </mesh>
      {/* Нижний торец — объёмная шапка */}
      <mesh position={[position[0], position[1] - height / 2 - 0.12, position[2]]}>
        <cylinderGeometry args={[0.25, 0.25, 0.24, 12]} />
        <meshStandardMaterial color="#4E9A4E" flatShading />
      </mesh>
    </>
  );
};
