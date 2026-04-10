import { Canvas } from '@react-three/fiber';
import { OrbitControls, useTexture } from '@react-three/drei';
import { DoubleSide, FrontSide, BackSide } from 'three';
import { Suspense } from 'react';

interface ProductPlaneProps {
  frontImage: string;
  backImage: string;
}

const ProductPlane = ({ frontImage, backImage }: ProductPlaneProps) => {
  const [frontTex, backTex] = useTexture([frontImage, backImage]);

  return (
    <group>
      {/* Front side */}
      <mesh>
        <planeGeometry args={[3, 4]} />
        <meshStandardMaterial map={frontTex} side={FrontSide} transparent />
      </mesh>
      {/* Back side — flipped plane */}
      <mesh rotation={[0, Math.PI, 0]}>
        <planeGeometry args={[3, 4]} />
        <meshStandardMaterial map={backTex} side={FrontSide} transparent />
      </mesh>
    </group>
  );
};

interface ProductViewer3DProps {
  frontImage: string;
  backImage: string;
}

const ProductViewer3D = ({ frontImage, backImage }: ProductViewer3DProps) => {
  return (
    <div className="relative w-full aspect-square rounded-lg overflow-hidden bg-muted">
      <Canvas
        camera={{ position: [0, 0, 5], fov: 45 }}
        style={{ background: 'transparent' }}
        gl={{ alpha: true }}
      >
        <ambientLight intensity={1.2} />
        <directionalLight position={[2, 3, 5]} intensity={0.8} />
        <Suspense fallback={null}>
          <ProductPlane frontImage={frontImage} backImage={backImage} />
        </Suspense>
        <OrbitControls
          enableZoom={false}
          enablePan={false}
          autoRotate
          autoRotateSpeed={2}
          minPolarAngle={Math.PI / 2}
          maxPolarAngle={Math.PI / 2}
        />
      </Canvas>
      <div className="absolute bottom-3 left-1/2 -translate-x-1/2 bg-background/80 backdrop-blur-sm text-muted-foreground text-xs px-3 py-1.5 rounded-full pointer-events-none">
        Перетащите для вращения
      </div>
    </div>
  );
};

export default ProductViewer3D;
