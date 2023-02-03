/*
Auto-generated by: https://github.com/pmndrs/gltfjsx
Command: npx gltfjsx@6.1.4 scene.gltf --transform
Author: Paulina (https://sketchfab.com/Byakko)
License: CC-BY-NC-4.0 (http://creativecommons.org/licenses/by-nc/4.0/)
Source: https://sketchfab.com/3d-models/wizards-hat-68a9fb2dbd8442a5bacf9c0141320308
Title: Wizard's hat
*/

import React, { useRef } from 'react'
import { useGLTF } from '@react-three/drei'

export function Model(props) {
  const { nodes, materials } = useGLTF('/scene-transformed.glb')
  return (
    <group {...props} dispose={null}>
      <group rotation={[-Math.PI / 2, 0, 0]}>
        <group rotation={[Math.PI / 2, 0, 0]}>
          <mesh geometry={nodes.defaultMaterial.geometry} material={materials.lambert21} />
          <mesh geometry={nodes.defaultMaterial_1.geometry} material={materials.lambert21} />
          <mesh geometry={nodes.defaultMaterial_2.geometry} material={materials.lambert21} />
          <mesh geometry={nodes.defaultMaterial_3.geometry} material={materials.lambert21} />
          <mesh geometry={nodes.defaultMaterial_4.geometry} material={materials.lambert21} />
          <mesh geometry={nodes.defaultMaterial_5.geometry} material={materials.lambert21} />
        </group>
      </group>
    </group>
  )
}

useGLTF.preload('/scene-transformed.glb')