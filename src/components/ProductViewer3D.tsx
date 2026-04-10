import { Canvas } from '@react-three/fiber';
import { OrbitControls, useTexture } from '@react-three/drei';
import { FrontSide, CylinderGeometry, BufferGeometry } from 'three';
import { Suspense, useMemo } from 'react';

interface ProductBodyProps {
  frontImage: string;
  backImage: string;
}

const ProductBody = ({ frontImage, backImage }: ProductBodyProps) => {
  const [frontTex, backTex] = useTexture([frontImage, backImage]);

  const { frontGeo, backGeo } = useMemo(() => {
    const radiusTop = 1.35;
    const radiusBottom = 1.1;
    const height = 4;
    const radialSegs = 32;
    const heightSegs = 1;

    // Front half-cylinder: theta 0 → π
    const front = new CylinderGeometry(
      radiusTop, radiusBottom, height, radialSegs, heightSegs, true,
      Math.PI / 2, Math.PI
    );
    // Back half-cylinder: theta π → 2π
    const back = new CylinderGeometry(
      radiusTop, radiusBottom, height, radialSegs, heightSegs, true,
      -Math.PI / 2, Math.PI
    );

    return { frontGeo: front as BufferGeometry, backGeo: back as BufferGeometry };
  }, []);

  return (
    <group>
      <mesh geometry={frontGeo}>
        <meshStandardMaterial map={frontTex} side={FrontSide} transparent />
      </mesh>
      <mesh geometry={backGeo}>
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
        <ambientLight intensity={1.0} />
        <directionalLight position={[2, 3, 5]} intensity={0.8} />
        <pointLight position={[0, 1, -4]} intensity={0.5} color="#c0c8ff" />
        <Suspense fallback={null}>
          <ProductBody frontImage={frontImage} backImage={backImage} />
        </Suspense>
        <OrbitControls
          enableZoom={false}
          enablePan={false}
          autoRotate
          autoRotateSpeed={1.5}
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
