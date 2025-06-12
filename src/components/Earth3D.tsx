import { Suspense } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import EarthModel from "./EarthModel";

const Earth3D = () => {
  return (
    <div className="earth-container">
      <Canvas
        style={{ touchAction: "pan-y" }}
        camera={{
          position: [0, 0, 10],
          fov: 55,
          near: 0.1,
          far: 1000,
        }}
        shadows
      >
        <Suspense fallback={null}>
          {/* Debug Controls */}
          {/* {true && <DebugControls />} */}

          {/* Lighting */}
          <ambientLight intensity={0.9} />
          <pointLight position={[-5, 0, 10]} intensity={2} castShadow />
          <pointLight position={[-10, -10, -10]} intensity={5} castShadow />

          {/* Spotlight */}
          <spotLight
            position={[5, 10, 5]}
            angle={0.4}
            penumbra={0.5}
            intensity={8}
            castShadow
            shadow-mapSize-width={1024}
            shadow-mapSize-height={1024}
          />

          <EarthModel />

          {/* Controls */}
          <OrbitControls
            enableZoom={false}
            enablePan={false}
            rotateSpeed={0.4}
            autoRotate={true}
            autoRotateSpeed={0.5}
          />
        </Suspense>
      </Canvas>
    </div>
  );
};

export default Earth3D;
