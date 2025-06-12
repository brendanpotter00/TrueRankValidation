import { useEffect, useRef } from "react";
import { useThree, useFrame } from "@react-three/fiber";
import { GUI } from "lil-gui";

interface DebugControlsProps {
  onCameraChange?: (position: [number, number, number], fov: number) => void;
}

const DebugControls = ({ onCameraChange }: DebugControlsProps) => {
  const { camera } = useThree();
  const guiRef = useRef<GUI | null>(null);
  const settingsRef = useRef({
    positionX: camera.position.x,
    positionY: camera.position.y,
    positionZ: camera.position.z,
    fov: (camera as any).fov || 45,
  });

  // Use frame loop to ensure smooth updates
  useFrame(() => {
    // Sync camera position with settings
    if (settingsRef.current) {
      camera.position.set(
        settingsRef.current.positionX,
        settingsRef.current.positionY,
        settingsRef.current.positionZ
      );

      if ("fov" in camera) {
        (camera as any).fov = settingsRef.current.fov;
        camera.updateProjectionMatrix();
      }
    }
  });

  useEffect(() => {
    // Create GUI
    const gui = new GUI();
    guiRef.current = gui;

    // Camera position controls
    const cameraFolder = gui.addFolder("Camera");

    // Initialize settings with current camera values
    settingsRef.current = {
      positionX: camera.position.x,
      positionY: camera.position.y,
      positionZ: camera.position.z,
      fov: (camera as any).fov || 45,
    };

    // Position controls
    const posXController = cameraFolder
      .add(settingsRef.current, "positionX", -10, 10, 0.1)
      .name("Position X")
      .onChange((value: number) => {
        settingsRef.current.positionX = value;
        onCameraChange?.(
          [
            settingsRef.current.positionX,
            settingsRef.current.positionY,
            settingsRef.current.positionZ,
          ],
          settingsRef.current.fov
        );
      });

    const posYController = cameraFolder
      .add(settingsRef.current, "positionY", -10, 10, 0.1)
      .name("Position Y")
      .onChange((value: number) => {
        settingsRef.current.positionY = value;
        onCameraChange?.(
          [
            settingsRef.current.positionX,
            settingsRef.current.positionY,
            settingsRef.current.positionZ,
          ],
          settingsRef.current.fov
        );
      });

    const posZController = cameraFolder
      .add(settingsRef.current, "positionZ", -10, 10, 0.1)
      .name("Position Z")
      .onChange((value: number) => {
        settingsRef.current.positionZ = value;
        onCameraChange?.(
          [
            settingsRef.current.positionX,
            settingsRef.current.positionY,
            settingsRef.current.positionZ,
          ],
          settingsRef.current.fov
        );
      });

    let fovController: any = null;
    // FOV control (only for PerspectiveCamera)
    if ("fov" in camera) {
      fovController = cameraFolder
        .add(settingsRef.current, "fov", 10, 120, 1)
        .name("Field of View")
        .onChange((value: number) => {
          settingsRef.current.fov = value;
          onCameraChange?.(
            [
              settingsRef.current.positionX,
              settingsRef.current.positionY,
              settingsRef.current.positionZ,
            ],
            value
          );
        });
    }

    cameraFolder.open();

    // Add a button to log current values
    const actions = {
      logCurrentValues: () => {
        console.log("Current Camera Settings:");
        console.log(
          `Position: [${settingsRef.current.positionX.toFixed(
            2
          )}, ${settingsRef.current.positionY.toFixed(
            2
          )}, ${settingsRef.current.positionZ.toFixed(2)}]`
        );
        console.log(`FOV: ${settingsRef.current.fov}`);
      },
      resetCamera: () => {
        settingsRef.current.positionX = 0;
        settingsRef.current.positionY = 1;
        settingsRef.current.positionZ = 5;
        settingsRef.current.fov = 45;

        // Update individual controllers
        posXController.updateDisplay();
        posYController.updateDisplay();
        posZController.updateDisplay();
        if (fovController) {
          fovController.updateDisplay();
        }

        onCameraChange?.(
          [
            settingsRef.current.positionX,
            settingsRef.current.positionY,
            settingsRef.current.positionZ,
          ],
          settingsRef.current.fov
        );
      },
    };

    gui.add(actions, "logCurrentValues").name("Log Current Values");
    gui.add(actions, "resetCamera").name("Reset Camera");

    return () => {
      gui.destroy();
    };
  }, [camera, onCameraChange]);

  return null; // This component doesn't render anything visually
};

export default DebugControls;
