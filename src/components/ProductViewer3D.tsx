import { Canvas } from '@react-three/fiber';
import { OrbitControls, useGLTF, Center } from '@react-three/drei';
import { Suspense } from 'react';

interface GLBModelProps {
  modelUrl: string;
}

const GLBModel = ({ modelUrl }: GLBModelProps) => {
  const { scene } = useGLTF(modelUrl);
  return (
    <Center>
      <primitive object={scene} />
    </Center>
  );
};

interface ProductViewer3DProps {
  modelUrl: string;
  autoRotate?: boolean;
  cameraPosition?: [number, number, number];
}

const ProductViewer3D = ({ modelUrl, autoRotate = true, cameraPosition = [0, 0, 3] }: ProductViewer3DProps) => {
  return (
    <div className="relative w-full aspect-square rounded-lg overflow-hidden bg-muted">
      <Canvas
        camera={{ position: cameraPosition, fov: 45 }}
        style={{ background: 'transparent' }}
        gl={{ alpha: true }}
      >
        <ambientLight intensity={1.2} />
        <directionalLight position={[3, 3, 5]} intensity={0.9} />
        <directionalLight position={[-3, 2, -4]} intensity={0.4} />
        <pointLight position={[0, 1, -4]} intensity={0.5} color="#c0c8ff" />
        <Suspense fallback={null}>
          <GLBModel modelUrl={modelUrl} />
        </Suspense>
        <OrbitControls
          enableZoom={false}
          enablePan={false}
          autoRotate={autoRotate}
          autoRotateSpeed={1.5}
        />
      </Canvas>
      <div className="absolute bottom-3 left-1/2 -translate-x-1/2 bg-background/80 backdrop-blur-sm text-muted-foreground text-xs px-3 py-1.5 rounded-full pointer-events-none">
        Перетащите для вращения
      </div>
    </div>
  );
};

export default ProductViewer3D;
