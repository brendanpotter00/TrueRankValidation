import { Suspense, useRef, useState } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import {
  StatsGl,
  OrbitControls,
  Sky as SkyImpl,
  Clouds,
  Cloud,
} from "@react-three/drei";
import CampingModel from "./CampingModel";
import DebugControls from "../dev-components/DebugControls";

function CampfireLight() {
  const light = useRef<THREE.PointLight>(null);
  const baseIntensity = 5;
  const flickerAmp = 2;
  const { camera } = useThree();

  useFrame(() => {
    if (light.current) {
      // wildly random intensity each frame
      light.current.intensity =
        baseIntensity + (Math.random() - 0.5) * flickerAmp;
      // slight hue shift around orange
      const h = 0.08 + (Math.random() - 0.5) * 0.02;
      light.current.color.setHSL(h, 1, 0.5);
    }
  });

  return (
    <pointLight
      ref={light}
      position={[0, 1, 0]}
      distance={20}
      decay={2}
      castShadow
      shadow-mapSize-width={256}
      shadow-mapSize-height={256}
    />
  );
}

const Camping3D = () => {
  // Development mode flag - you can control this through your app's context or environment
  const [isDevMode] = useState(true); // Force dev mode for testing
  const [modelPosition, setModelPosition] = useState<[number, number, number]>([
    -16.41, 2.4, 0.7,
  ]);

  const handleModelChange = (position: [number, number, number]) => {
    console.log("Model position updated:", position);
    setModelPosition(position);
  };

  return (
    <div className="world3d-wrapper">
      <Canvas
        camera={{
          position: [-16.41, 12.42, -15.3],
          fov: 50,
          near: 0.1,
          far: 1000,
        }}
        shadows
        gl={{
          alpha: true,
          antialias: true,
          preserveDrawingBuffer: true,
          premultipliedAlpha: false,
        }}
        style={{ background: "transparent" }}
      >
        <Suspense fallback={null}>
          {/* Debug overlay */}
          {isDevMode && (
            <>
              <StatsGl />
              <DebugControls onModelChange={handleModelChange} />
            </>
          )}

          {/* Fill lights */}
          <ambientLight intensity={0.3} />
          <hemisphereLight
            color={0xeeeeff}
            groundColor={0x222222}
            intensity={0.2}
          />

          {/* Directional "sun" */}
          <directionalLight
            position={[10, 10, 5]}
            intensity={0.5}
            castShadow
            shadow-mapSize-width={1024}
            shadow-mapSize-height={1024}
            shadow-camera-far={50}
            shadow-camera-left={-10}
            shadow-camera-right={10}
            shadow-camera-top={10}
            shadow-camera-bottom={-10}
          />

          {/* Spotlight under model */}
          <spotLight
            position={[0, -5, 0]}
            angle={0.4}
            penumbra={0.5}
            intensity={100}
            castShadow
            shadow-mapSize-width={512}
            shadow-mapSize-height={512}
          />

          {/* 🌟 Spastic campfire light */}
          <CampfireLight />

          {/* Your model */}
          <CampingModel wireframe={false} position={modelPosition} />

          {/* Orbit controls with adjusted settings */}
          <OrbitControls
            enableZoom={true}
            enablePan={true}
            enableRotate={true}
            rotateSpeed={0.5}
            panSpeed={0.5}
            zoomSpeed={0.5}
            minDistance={2}
            maxDistance={100}
            minPolarAngle={0}
            maxPolarAngle={Math.PI / 2}
            target={[0, 0, 0]}
            autoRotate={false}
            makeDefault
          />
        </Suspense>
      </Canvas>
    </div>
  );
};

export default Camping3D;
