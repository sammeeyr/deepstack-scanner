import { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Text } from '@react-three/drei';

const CHARS = 'アァカサタナハマヤャラワガザダバパイィキシチニヒミリヰギジヂビピウゥクスツヌフムユュルグズブヅプエェケセテネヘメレゲゼデベペオォコソトノホモヨョロゴゾドボポヴッン0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ';

function MatrixStrand({ position, speed, length, size }: any) {
  const ref = useRef<any>(null);
  const text = useMemo(() => {
    let str = '';
    for (let i = 0; i < length; i++) {
      str += CHARS[Math.floor(Math.random() * CHARS.length)] + '\n';
    }
    return str;
  }, [length]);

  useFrame((_state, delta) => {
    if (ref.current) {
      ref.current.position.y -= speed * delta;
      // Reset position when it falls below screen
      if (ref.current.position.y < -15) {
        ref.current.position.y = 15 + Math.random() * 10;
        // Optionally scramble text on reset
      }
    }
  });

  return (
    <Text
      ref={ref}
      position={position}
      fontSize={size}
      color="#00ff41"
      anchorX="center"
      anchorY="top"
      lineHeight={0.8}
      material-toneMapped={false}
    >
      {text}
    </Text>
  );
}

function MatrixRain() {
  const strands = useMemo(() => {
    const temp = [];
    for (let i = 0; i < 80; i++) {
      temp.push({
        position: [
          (Math.random() - 0.5) * 40, // x spread
          Math.random() * 30 - 15,    // y spread
          (Math.random() - 0.5) * 30 - 5, // z depth
        ],
        speed: 3 + Math.random() * 6,
        length: 8 + Math.floor(Math.random() * 20),
        size: 0.3 + Math.random() * 0.5,
      });
    }
    return temp;
  }, []);

  return (
    <group>
      {strands.map((props, i) => (
        <MatrixStrand key={i} {...props} />
      ))}
    </group>
  );
}

export default function Background3D() {
  return (
    <div className="fixed inset-0 z-[-1] bg-[#030303]">
      <Canvas camera={{ position: [0, 0, 5], fov: 75 }}>
        <fog attach="fog" args={['#030303', 5, 30]} />
        <MatrixRain />
      </Canvas>
    </div>
  );
}
