import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { useGLTF } from "@react-three/drei";
import * as THREE from "three";

const EarthModel = () => {
  const earthRef = useRef<THREE.Group>(null);
  const { scene } = useGLTF("/earth/low_poly_planet_earth/scene.gltf");

  // Rotate the earth
  useFrame(() => {
    if (earthRef.current) {
      earthRef.current.rotation.y += 0.001;
    }
  });

  const scale = 2;
  return (
    <primitive
      ref={earthRef}
      object={scene}
      scale={[scale, scale, scale]}
      position={[0, -2, 0]}
    />
  );
};

// Pre-load the model
useGLTF.preload("/earth/low_poly_planet_earth/scene.gltf");

export default EarthModel;
