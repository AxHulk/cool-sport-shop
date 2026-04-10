import { Canvas } from '@react-three/fiber';
import { OrbitControls, useTexture } from '@react-three/drei';
import { FrontSide, DoubleSide, Shape, ExtrudeGeometry } from 'three';
import { Suspense, useMemo } from 'react';

// Garment silhouette points (normalized -1 to 1 range, will be scaled)
// Simplified rashguard/jacket shape: shoulders, sleeves, torso, waist
function createGarmentShape(width: number, height: number): Shape {
  const w = width / 2;
  const h = height / 2;
  const shape = new Shape();

  // Start bottom-left, go clockwise
  // Bottom hem
  shape.moveTo(-w * 0.45, -h);
  shape.lineTo(w * 0.45, -h);

  // Right side up to armpit
  shape.lineTo(w * 0.48, -h * 0.3);

  // Right sleeve out
  shape.lineTo(w, -h * 0.15);
  shape.lineTo(w * 0.95, h * 0.15);

  // Back to right shoulder
  shape.lineTo(w * 0.5, h * 0.35);

  // Right shoulder up
  shape.lineTo(w * 0.45, h * 0.75);

  // Neckline
  shape.quadraticCurveTo(w * 0.2, h, 0, h * 0.9);
  shape.quadraticCurveTo(-w * 0.2, h, -w * 0.45, h * 0.75);

  // Left shoulder
  shape.lineTo(-w * 0.5, h * 0.35);

  // Left sleeve
  shape.lineTo(-w * 0.95, h * 0.15);
  shape.lineTo(-w, -h * 0.15);

  // Left side down
  shape.lineTo(-w * 0.48, -h * 0.3);

  shape.lineTo(-w * 0.45, -h);

  return shape;
}

interface ProductBodyProps {
  frontImage: string;
  backImage: string;
}

const ProductBody = ({ frontImage, backImage }: ProductBodyProps) => {
  const [frontTex, backTex] = useTexture([frontImage, backImage]);

  const { geometry, frontUVs, backUVs } = useMemo(() => {
    const w = 2.8, h = 3.6;
    const depth = 0.35; // thickness of the garment

    const shape = createGarmentShape(w, h);

    const extrudeSettings = {
      depth: depth,
      bevelEnabled: true,
      bevelThickness: 0.08,
      bevelSize: 0.06,
      bevelOffset: 0,
      bevelSegments: 3,
      curveSegments: 12,
    };

    const geo = new ExtrudeGeometry(shape, extrudeSettings);

    // Center the geometry
    geo.computeBoundingBox();
    const bb = geo.boundingBox!;
    const cx = (bb.max.x + bb.min.x) / 2;
    const cy = (bb.max.y + bb.min.y) / 2;
    const cz = (bb.max.z + bb.min.z) / 2;
    geo.translate(-cx, -cy, -cz);
    geo.computeBoundingBox();

    // We need to assign groups and fix UVs
    // ExtrudeGeometry creates groups: 0=front face, 1=back face, 2=sides
    // Fix UVs for front and back faces to map the texture properly
    const pos = geo.attributes.position;
    const uv = geo.attributes.uv;
    const bb2 = geo.boundingBox!;
    const rangeX = bb2.max.x - bb2.min.x;
    const rangeY = bb2.max.y - bb2.min.y;

    // Remap UVs for all vertices based on their x,y position
    for (let i = 0; i < pos.count; i++) {
      const x = pos.getX(i);
      const y = pos.getY(i);
      const u = (x - bb2.min.x) / rangeX;
      const v = (y - bb2.min.y) / rangeY;
      uv.setXY(i, u, v);
    }

    return { geometry: geo, frontUVs: null, backUVs: null };
  }, []);

  return (
    <group>
      <mesh geometry={geometry}>
        {/* Material index 0: front face */}
        <meshStandardMaterial
          attach="material-0"
          map={frontTex}
          side={FrontSide}
          transparent
          roughness={0.7}
          metalness={0.0}
        />
        {/* Material index 1: back face */}
        <meshStandardMaterial
          attach="material-1"
          map={backTex}
          side={FrontSide}
          transparent
          roughness={0.7}
          metalness={0.0}
        />
        {/* Material index 2: sides */}
        <meshStandardMaterial
          attach="material-2"
          color="#1a1a1a"
          side={DoubleSide}
          roughness={0.8}
          metalness={0.0}
        />
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
        <directionalLight position={[3, 3, 5]} intensity={0.9} />
        <directionalLight position={[-3, 2, -4]} intensity={0.4} />
        <pointLight position={[0, 1, -4]} intensity={0.5} color="#c0c8ff" />
        <pointLight position={[2, 0, 0]} intensity={0.3} color="#ffffff" />
        <pointLight position={[-2, 0, 0]} intensity={0.3} color="#ffffff" />
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
