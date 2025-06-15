import { useControls, folder, button } from "leva";
import { useThree, useFrame } from "@react-three/fiber";

interface DebugControlsProps {
  onModelChange?: (position: [number, number, number]) => void;
}

const DebugControls = ({ onModelChange }: DebugControlsProps) => {
  const { camera } = useThree();

  // Create Leva controls
  const controls = useControls({
    // Model controls
    modelX: { value: 0, min: -10, max: 10, step: 0.1 },
    modelY: { value: 0, min: -10, max: 10, step: 0.1 },
    modelZ: { value: 0, min: -10, max: 10, step: 0.1 },
    resetModel: button(() => {
      onModelChange?.([0, 0, 0]);
    }),
    logModelValues: button(() => {
      if (!controls) return;
      console.log("Current Model Position:");
      console.log(
        `Position: [${controls.modelX.toFixed(2)}, ${controls.modelY.toFixed(
          2
        )}, ${controls.modelZ.toFixed(2)}]`
      );
    }),

    // Camera controls
    cameraX: { value: -16.41, min: -80, max: 80, step: 0.1 },
    cameraY: { value: 12.42, min: -60, max: 80, step: 0.1 },
    cameraZ: { value: -15.3, min: -80, max: 80, step: 0.1 },
    resetCamera: button(() => {
      camera.position.set(-16.41, 12.42, -15.3);
    }),
    logCameraValues: button(() => {
      if (!controls) return;
      console.log("Current Camera Position:");
      console.log(
        `Position: [${camera.position.x.toFixed(
          2
        )}, ${camera.position.y.toFixed(2)}, ${camera.position.z.toFixed(2)}]`
      );
    }),
  }) as any;

  // Update positions on every frame
  useFrame(() => {
    if (controls) {
      // Update model position
      onModelChange?.([controls.modelX, controls.modelY, controls.modelZ]);
      // Update camera position directly
      camera.position.set(controls.cameraX, controls.cameraY, controls.cameraZ);
    }
  });

  return null;
};

export default DebugControls;
