import React, { useRef, useState } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { Canvas } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import { View, StyleSheet, Text } from "react-native";
import Slider from "@react-native-community/slider";

interface SphereProps {
  speed: number; // Speed factor for the scaling animation
}

const GrowingShrinkingSphere: React.FC<SphereProps> = ({ speed }) => {
  const sphereRef = useRef<THREE.Mesh>(null);

  // Animation logic
  useFrame(({ clock }) => {
    const time = clock.getElapsedTime();
    const scale = 1 + 0.5 * Math.sin(speed * time); // Adjust scale based on speed
    if (sphereRef.current) {
      sphereRef.current.scale.set(scale, scale, scale);
    }
  });

  return (
    <mesh ref={sphereRef} castShadow receiveShadow>
      {/* Sphere geometry */}
      <sphereGeometry args={[1, 64, 64]} />
      {/* Material */}
      <meshStandardMaterial color="royalblue" metalness={0.6} roughness={0.4} />
    </mesh>
  );
};

const SpherePage: React.FC = () => {
  const [speed, setSpeed] = useState(1); // Default speed is 1

  return (
    <View style={styles.container}>
      {/* Canvas for 3D Scene */}
      <Canvas
        shadows
        camera={{ position: [3, 3, 3], fov: 50 }}
        style={styles.canvas}
      >
        {/* Lighting */}
        <ambientLight intensity={0.3} />
        <spotLight
          position={[5, 5, 5]}
          angle={0.3}
          penumbra={1}
          intensity={1.5}
          castShadow
        />
        <directionalLight position={[-5, 5, 5]} intensity={1} castShadow />

        {/* Ground Plane */}
        <mesh
          receiveShadow
          rotation={[-Math.PI / 2, 0, 0]}
          position={[0, -1, 0]}
        >
          <planeGeometry args={[10, 10]} />
          <shadowMaterial opacity={0.2} />
        </mesh>

        {/* Growing and Shrinking Sphere */}
        <GrowingShrinkingSphere speed={speed} />

        {/* Camera Controls */}
        <OrbitControls enableZoom enablePan />
      </Canvas>

      {/* Slider for Speed Control */}
      <View style={styles.sliderContainer}>
        <Text style={styles.label}>Animation Speed: {speed.toFixed(2)}</Text>
        <Slider
          style={styles.slider}
          minimumValue={0.1}
          maximumValue={3}
          step={0.1}
          value={speed}
          onValueChange={(value) => setSpeed(value)}
          minimumTrackTintColor="#1E90FF"
          maximumTrackTintColor="#FFFFFF"
          thumbTintColor="#1E90FF"
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000",
  },
  canvas: {
    flex: 1,
  },
  sliderContainer: {
    padding: 10,
    backgroundColor: "#222",
  },
  label: {
    color: "#fff",
    textAlign: "center",
    marginBottom: 5,
  },
  slider: {
    width: "100%",
    height: 40,
  },
});

export default SpherePage;
