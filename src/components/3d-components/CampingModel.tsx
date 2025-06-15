import { useRef, useEffect, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import { useGLTF } from "@react-three/drei";
import * as THREE from "three";

interface CampingModelProps {
  wireframe?: boolean;
  position?: [number, number, number];
}

const CampingModel = ({
  wireframe = false,
  position = [0, 0, 0],
}: CampingModelProps) => {
  const campingRef = useRef<THREE.Group>(null);
  const { scene } = useGLTF("/low_poly_forest_campfire/scene.gltf");

  // Clone the scene once
  const clonedScene = useMemo(() => scene.clone(), [scene]);

  // Wireframe toggling
  useEffect(() => {
    clonedScene.traverse((child) => {
      if (child instanceof THREE.Mesh && child.material) {
        const material = child.material.clone();
        material.wireframe = wireframe;
        child.material = material;
      }
    });
  }, [clonedScene, wireframe]);

  // Bob up and down
  useFrame(({ clock }) => {
    if (campingRef.current) {
      const t = clock.getElapsedTime();
      const amplitude = 0.3; // vertical range
      const speed = 0.3; // cycles per second
      // Add the bobbing effect to the y position
      campingRef.current.position.y =
        position[1] + Math.sin(t * speed) * amplitude;
      // Set x and z positions directly
      campingRef.current.position.x = position[0];
      campingRef.current.position.z = position[2];
    }
  });

  const scale = 0.5;

  return (
    <primitive
      ref={campingRef}
      object={clonedScene}
      scale={[scale, scale, scale]}
      rotation={[0, 0, 0]}
      position={position}
    />
  );
};

// Pre-load the model
useGLTF.preload("/low_poly_forest_campfire/scene.gltf");

export default CampingModel;
