import { Canvas } from '@react-three/fiber';
import { OrbitControls, useTexture } from '@react-three/drei';
import { FrontSide, PlaneGeometry, BufferGeometry } from 'three';
import { Suspense, useMemo } from 'react';

function createCurvedPlane(width: number, height: number, depth: number, segments: number): BufferGeometry {
  const geo = new PlaneGeometry(width, height, segments, 1);
  const pos = geo.attributes.position;
  for (let i = 0; i < pos.count; i++) {
    const x = pos.getX(i);
    const u = (x / width) + 0.5; // 0→1
    pos.setZ(i, depth * Math.sin(u * Math.PI));
  }
  pos.needsUpdate = true;
  geo.computeVertexNormals();
  return geo as BufferGeometry;
}

interface ProductBodyProps {
  frontImage: string;
  backImage: string;
}

const ProductBody = ({ frontImage, backImage }: ProductBodyProps) => {
  const [frontTex, backTex] = useTexture([frontImage, backImage]);

  const { frontGeo, backGeo } = useMemo(() => {
    const w = 2.8, h = 3.6, depth = 0.45, segs = 32;
    return {
      frontGeo: createCurvedPlane(w, h, depth, segs),
      backGeo: createCurvedPlane(w, h, depth, segs),
    };
  }, []);

  return (
    <group>
      <mesh geometry={frontGeo}>
        <meshStandardMaterial map={frontTex} side={FrontSide} transparent />
      </mesh>
      <mesh geometry={backGeo} rotation={[0, Math.PI, 0]}>
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
