import React, { useRef, useEffect } from "react";
import { useGLTF, useAnimations } from "@react-three/drei";
import plantModel from "./assets/plant.glb";

export default function Model({ running }) {
  const group = useRef();
  const { nodes, materials, animations } = useGLTF(plantModel);
  const { actions, names } = useAnimations(animations, group);

  useEffect(() => {
    if (running) {
      names.forEach((name) => {
        actions[name].paused = false;
        actions[name].play();
      })
    } else {
      names.forEach((name) => {
        actions[name].paused = true;
      })
    }
    // eslint-disable-next-line
  }, [running]);

  return (
    <group ref={group} dispose={null}>
      <group name="Scene">
        <group
          name="Cylinder"
          position={[-0.166, -0.151, 0.155]}
          rotation={[Math.PI, -0.817, Math.PI]}
        >
          <mesh
            name="Cylinder_1"
            castShadow
            receiveShadow
            geometry={nodes.Cylinder_1.geometry}
            material={materials["Material.001"]}
          />
          <mesh
            name="Cylinder_2"
            castShadow
            receiveShadow
            geometry={nodes.Cylinder_2.geometry}
            material={materials["Material.002"]}
          />
        </group>
        <mesh
          name="Vert"
          castShadow
          receiveShadow
          geometry={nodes.Vert.geometry}
          material={materials["Material.003"]}
          position={[-0.166, 1.907, 0.155]}
          rotation={[Math.PI, -0.817, Math.PI]}
          scale={1.187}
        />
        <mesh
          name="Plane"
          castShadow
          receiveShadow
          geometry={nodes.Plane.geometry}
          material={materials["Material.004"]}
          position={[0.521, 3.477, 0.303]}
          rotation={[Math.PI, -0.817, Math.PI]}
          scale={0.674}
        />
        <mesh
          name="Plane002"
          castShadow
          receiveShadow
          geometry={nodes.Plane002.geometry}
          material={materials["Material.004"]}
          position={[-0.09, 3.808, -0.869]}
          rotation={[0, -0.765, 0]}
          scale={0.502}
        />
        <mesh
          name="Plane004"
          castShadow
          receiveShadow
          geometry={nodes.Plane004.geometry}
          material={materials["Material.004"]}
          position={[0.018, 4.646, 0.881]}
          rotation={[-Math.PI, 0.371, -Math.PI]}
          scale={0.708}
        />
        <mesh
          name="Plane005"
          castShadow
          receiveShadow
          geometry={nodes.Plane005.geometry}
          material={materials["Material.004"]}
          position={[-0.316, 4.794, -0.368]}
          rotation={[0, -0.45, 0]}
          scale={0.692}
        />
        <mesh
          name="Icosphere"
          castShadow
          receiveShadow
          geometry={nodes.Icosphere.geometry}
          material={materials["Material.005"]}
          position={[0.572, 3.373, 0.33]}
          scale={0}
        />
        <mesh
          name="Icosphere001"
          castShadow
          receiveShadow
          geometry={nodes.Icosphere001.geometry}
          material={materials["Material.005"]}
          position={[-0.06, 3.746, -0.873]}
          scale={0}
        />
        <mesh
          name="Icosphere002"
          castShadow
          receiveShadow
          geometry={nodes.Icosphere002.geometry}
          material={materials["Material.005"]}
          position={[-0.683, 3.923, 0.137]}
          scale={0}
        />
      </group>
    </group>
  );
}

useGLTF.preload("/plant.glb");
