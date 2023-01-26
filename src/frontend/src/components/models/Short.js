/*
Auto-generated by: https://github.com/pmndrs/gltfjsx
*/

import React, { useRef } from "react";
import { useGLTF } from "@react-three/drei";

function Short(props) {
  const { nodes, materials } = useGLTF("/scene.gltf");
  return (
    <group {...props} dispose={null}>
      <group position={[0, -1.02, 0.09]}>
        <group position={[0, -0.06, 0]}>
          <group rotation={[Math.PI / 2, 0, -1.58]}>
            <group rotation={[Math.PI / 2, 0, 0]}>
              <group position={[0, -1.04, 0]} rotation={[0, 0, -Math.PI / 2]}>
                <group position={[0, 1.99, -2.74]} scale={[0.07, 3.69, 0.06]}>
                  <mesh
                    castShadow
                    receiveShadow
                    geometry={nodes.pCube2_Copper_0.geometry}
                    material={materials.Copper}
                  />
                </group>
                <group
                  position={[0, 1.99, 2.74]}
                  rotation={[-Math.PI, 0, Math.PI]}
                  scale={[-0.07, 3.69, 0.06]}
                >
                  <mesh
                    castShadow
                    receiveShadow
                    geometry={nodes.pCube4_Copper_0.geometry}
                    material={materials.Copper}
                  />
                </group>
                <group
                  position={[0, 0, 1.49]}
                  rotation={[-Math.PI, 0, Math.PI]}
                  scale={[-1, 0.03, 1]}
                >
                  <mesh
                    castShadow
                    receiveShadow
                    geometry={nodes.polySurface2_Glass_0.geometry}
                    material={materials.Glass}
                  />
                </group>
                <group
                  position={[0, -0.01, 2.76]}
                  rotation={[-Math.PI, 0, Math.PI]}
                  scale={[-0.09, 0.17, 0.47]}
                >
                  <mesh
                    castShadow
                    receiveShadow
                    geometry={nodes.pCube1_Copper_0.geometry}
                    material={materials.Copper}
                  />
                </group>
                <group
                  position={[0, 0.96, 1.49]}
                  rotation={[-Math.PI, 0, Math.PI]}
                  scale={[-1, 0.07, 1]}
                >
                  <mesh
                    castShadow
                    receiveShadow
                    geometry={nodes.polySurface1_Copper_0.geometry}
                    material={materials.Copper}
                  />
                </group>
                <group position={[0, -0.04, 0]} scale={[0.19, 0.11, 0.89]}>
                  <mesh
                    castShadow
                    receiveShadow
                    geometry={nodes.pCube3_Copper_0.geometry}
                    material={materials.Copper}
                  />
                </group>
                <group
                  position={[0, 0, -1.49]}
                  rotation={[Math.PI, 0, 0]}
                  scale={[1, 0.03, 1]}
                >
                  <mesh
                    castShadow
                    receiveShadow
                    geometry={nodes.polySurface3_Glass_0.geometry}
                    material={materials.Glass}
                  />
                </group>
                <group position={[0, -0.01, -2.76]} scale={[0.09, 0.17, 0.47]}>
                  <mesh
                    castShadow
                    receiveShadow
                    geometry={nodes.pCube5_Copper_0.geometry}
                    material={materials.Copper}
                  />
                </group>
                <group position={[0, 0.96, -1.49]} scale={[1, 0.07, 1]}>
                  <mesh
                    castShadow
                    receiveShadow
                    geometry={nodes.polySurface4_Copper_0.geometry}
                    material={materials.Copper}
                  />
                </group>
                <group
                  position={[-0.05, 0.16, -2.74]}
                  rotation={[0, 0, Math.PI / 2]}
                  scale={[0.03, 0.01, 0.03]}
                >
                  <mesh
                    castShadow
                    receiveShadow
                    geometry={nodes.pCylinder3_Copper_0.geometry}
                    material={materials.Copper}
                  />
                </group>
                <group
                  position={[0.05, 0.16, -2.74]}
                  rotation={[-Math.PI, 0, -Math.PI / 2]}
                  scale={[0.03, 0.01, 0.03]}
                >
                  <mesh
                    castShadow
                    receiveShadow
                    geometry={nodes.pCylinder4_Copper_0.geometry}
                    material={materials.Copper}
                  />
                </group>
                <group position={[0, -1.39, 0.49]} rotation={[2.48, 0, 0]}>
                  <group
                    position={[-0.05, 0.16, -2.74]}
                    rotation={[0, 0, Math.PI / 2]}
                    scale={[0.03, 0.01, 0.03]}
                  >
                    <mesh
                      castShadow
                      receiveShadow
                      geometry={nodes.pCylinder3_Copper_0_1.geometry}
                      material={materials.Copper}
                    />
                  </group>
                  <group
                    position={[0.05, 0.16, -2.74]}
                    rotation={[2.4, 0, -Math.PI / 2]}
                    scale={[0.03, 0.01, 0.03]}
                  >
                    <mesh
                      castShadow
                      receiveShadow
                      geometry={nodes.pCylinder4_Copper_0_1.geometry}
                      material={materials.Copper}
                    />
                  </group>
                </group>
              </group>
            </group>
          </group>
        </group>
      </group>
    </group>
  );
}
export default Short;
useGLTF.preload("/scene.gltf");



