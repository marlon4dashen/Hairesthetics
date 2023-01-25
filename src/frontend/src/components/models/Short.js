import { Suspense } from 'react'
import { useLoader } from '@react-three/fiber'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader'

function Short() {
  const result = useLoader(GLTFLoader, "/scene.gltf")
  return (
    <Suspense fallback={null}>
      <primitive object={result.scene} />
    </Suspense>
  )
}
export default Short;