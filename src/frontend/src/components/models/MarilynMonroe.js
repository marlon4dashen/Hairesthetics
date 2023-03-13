/*
Auto-generated by: https://github.com/pmndrs/gltfjsx
Command: npx gltfjsx@6.1.4 marilyn_monroe.gltf --transform
Author: 3FERRETS (https://sketchfab.com/3ferrets)
License: CC-BY-4.0 (http://creativecommons.org/licenses/by/4.0/)
Source: https://sketchfab.com/3d-models/marilyn-monroe-hair-940da1cc70cb48fb864f08113a74d8e4
Title: Marilyn Monroe Hair
*/

import React, { useRef } from 'react'
import { useGLTF } from '@react-three/drei'
import url from "../../../public/marilyn_monroe-transformed.glb"

export function MarilynMonroe(props) {
  const { nodes, materials } = useGLTF(url)
  return (
    <group {...props} dispose={null}>
      <group position={[2.04, 2.97, 3.69]} rotation={[-Math.PI / 2, 0, 0]}>
        <group rotation={[Math.PI / 2, 0, 0]}>
          <group position={[3.42, 31.24, 5.24]} rotation={[0.7, 0.32, 1.32]} scale={[101.73, 120.74, 102.19]}>
            <mesh geometry={nodes.hair_monroe_HairMatAniso_mesh_0.geometry} material={materials.HairMatAniso_mesh} />
            <mesh geometry={nodes.hair_monroe_HairMatAniso_mesh_0_1.geometry} material={materials.HairMatAniso_mesh} />
            <mesh geometry={nodes.hair_monroe_HairMatAniso_mesh_0_2.geometry} material={materials.HairMatAniso_mesh} />
          </group>
        </group>
      </group>
    </group>
  )
}

useGLTF.preload(url)
