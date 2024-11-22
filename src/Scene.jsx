import { Canvas } from '@react-three/fiber';
import { OrbitControls, Box } from '@react-three/drei';
import { useRef, useEffect } from 'react';

function Scene({ sceneState, onSceneStateChange }) {
  const orbitControlsRef = useRef();
  const boxRef = useRef();

  useEffect(() => {
    if (!orbitControlsRef.current) return;

    const controls = orbitControlsRef.current;
    controls.addEventListener('change', handleSceneChange);

    return () => {
      controls.removeEventListener('change', handleSceneChange);
    };
  }, [orbitControlsRef.current]);

  const handleSceneChange = () => {
    if (!orbitControlsRef.current || !boxRef.current) return;

    const newState = {
      cameraPosition: orbitControlsRef.current.object.position.toArray(),
      cameraTarget: orbitControlsRef.current.target.toArray(),
      boxRotation: boxRef.current.rotation.toArray(),
      boxPosition: boxRef.current.position.toArray(),
      lighting: sceneState.lighting,
    };

    onSceneStateChange(newState);
  };

  return (
    <div className="scene-container">
      <Canvas
        camera={{ position: sceneState.cameraPosition, fov: 75 }}
        style={{ width: '100%', height: '100%' }}
      >
        <OrbitControls 
          ref={orbitControlsRef}
          target={sceneState.cameraTarget || [0, 0, 0]}
        />
        <ambientLight intensity={sceneState.lighting.ambientIntensity} />
        <pointLight position={sceneState.lighting.pointLightPosition} />
        <Box 
          ref={boxRef}
          position={sceneState.boxPosition}
          rotation={sceneState.boxRotation || [0, 0, 0]}
          args={[2, 2, 2]}
          onPointerDown={handleSceneChange}
        >
          <meshStandardMaterial attach="material" color="orange" />
        </Box>
      </Canvas>
    </div>
  );
}

export default Scene;