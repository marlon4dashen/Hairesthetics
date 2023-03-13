import React, { useState, useEffect, useRef, Suspense } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { OrbitControls, Environment, Loader } from "@react-three/drei"

// import main script and neural network model from  FaceFilter NPM package
import { JEELIZFACEFILTER, NN_4EXPR } from 'facefilter'

// import THREE.js helper, useful to compute pose
// The helper is not minified, feel free to customize it (and submit pull requests bro):
import { ThreeFiberHelper } from '../helpers/ThreeFiberHelper.js'
import { ShortHair } from './Models/ShortHair.js'
import { Braids } from './models/Braids.js'
import { Braids2 } from './models/Braids2.js'
import { Ponytails } from './models/Ponytails.js'
import { Head } from './Models/Head.js'
import { MarilynMonroe } from './Models/MarilynMonroe.js'
import { LowpolyHead } from './Models/LowpolyHead'
import { Hat } from './Models/Hat.js'

const _maxFacesDetected = 1 // max number of detected faces
const _faceFollowers = new Array(_maxFacesDetected)
let _expressions = null


// This mesh follows the face. put stuffs in it.
// Its position and orientation is controlled by  THREE.js helper
const FaceFollower = (props) => {
  // This reference will give us direct access to the mesh
  const objRef = useRef()
  useEffect(() => {
    const threeObject3D = objRef.current
    _faceFollowers[props.faceIndex] = threeObject3D
  })


  console.log('RENDER FaceFollower component')
  return (
    <object3D ref={objRef}>


        {/* <mesh name="mainCube">
          <boxBufferGeometry args={[1, 1, 1]} />
          <meshNormalMaterial />
        </mesh> */}
        {props.selectedHair.selectedHair == 0 &&
          <ShortHair
          rotation={[-Math.PI/2, 0, 0]}
          position={[0, 0.45, -0.2]}
          scale={[80, 80, 80]}
          renderOrder={2}
          />
        }
        {props.selectedHair.selectedHair == 1 &&
          <Hat
          rotation={[0, -Math.PI, 0]}
          position={[0, 1.825, -0.17]}
          scale={[1.9, 1.9, 1.9]}
          renderOrder={2}
          />
        }
        {props.selectedHair.selectedHair == 2 &&
          <MarilynMonroe
          rotation={[Math.PI/2, 0, 0]}
          position={[0, 0.45, -0.2]}
          scale={[0.3, 0.3, 0.3]}
          renderOrder={2}
          />
        }

        {props.selectedHair.selectedHair == 3 &&
          <Braids2
          rotation={[0, Math.PI, 0]}
          position={[0, 0.45, -0.2]}
          scale={[2, 2, 2]}
          renderOrder={2}
          />
        }
        {props.selectedHair.selectedHair == 4 &&
          <Ponytails
          rotation={[0, 0, 0]}
          position={[0, 0.3, -0.8]}
          scale={[0.12, 0.12, 0.12]}
          renderOrder={2}
          />
        }
        <Head
          position={[0, -1.0, 0]}
          scale={[0.5, 0.45, 0.45]}
          renderOrder={-1}
        />
        {/* <LowpolyHead
          position={[0, -0.35, -0.1]}
          scale={[0.60, 0.50, 0.5]}
          renderOrder={-1}
        /> */}

    </object3D>
  )
}

// const FaceFollower = (props) => {
//   const objRef = useRef();
//   useEffect(() => {
//     const threeObject3D = objRef.current;
//     _faceFollowers[props.faceIndex] = threeObject3D;
//   });

//   console.log('RENDER FaceFollower component')
//   return (
//     <object3D ref={objRef}>
//       <Suspense fallback={null}>
//         <Hat
//           rotation={[0, -Math.PI, 0]}
//           position={[0, 1.825, 0]}
//           scale={[1.5, 1.5, 1.5]}
//           renderOrder={2}
//         />
//         {/* <Head position={[0, -0.1435, 0]} scale={[1.125, 1, 1.125]} /> */}
//       </Suspense>
//     </object3D>
//   );
// };


// fake component, display nothing
// just used to get the Camera and the renderer used by React-fiber:
let _threeFiber = null
const ThreeGrabber = (props) => {
  _threeFiber = useThree()
  useFrame(ThreeFiberHelper.update_camera.bind(null, props.sizing, _threeFiber.camera))
  return null
}


const compute_sizing = () => {
  // compute  size of the canvas:
  const height = window.innerHeight * 7/10
  const width = window.innerWidth *7/10
  // const width = Math.min(wWidth, height)
  // compute position of the canvas:
  const top = window.innerHeight * 8/100
  const left = window.innerWidth *1.5/10
  return {width, height, top, left}
}


const ARCanvas = (selectedHair) => {

  // init state:
  _expressions = []
  for (let i = 0; i<_maxFacesDetected; ++i){
    _expressions.push({
      mouthOpen: 0,
      mouthSmile: 0,
      eyebrowFrown: 0,
      eyebrowRaised: 0
    })
  }
  const [sizing, setSizing] = useState(compute_sizing())
  const [isInitialized] = useState(true)

  let _timerResize = null
  const handle_resize = () => {
    // do not resize too often:
    if (_timerResize){
      clearTimeout(_timerResize)
    }
    _timerResize = setTimeout(do_resize, 200)
  }


  const do_resize = () => {
    _timerResize = null
    const newSizing = compute_sizing()
    setSizing(newSizing)
  }


  useEffect(() => {
    if (!_timerResize) {
      JEELIZFACEFILTER.resize()
    }
  }, [sizing])


  const callbackReady = (errCode, spec) => {
    if (errCode){
      console.log('AN ERROR HAPPENS. ERR =', errCode)
      return
    }

    console.log('INFO: FACEFILTER IS READY')
    // there is only 1 face to track, so 1 face follower:
    ThreeFiberHelper.init(spec, _faceFollowers, callbackDetect)
  }


  const callbackTrack = (detectStatesArg) => {
    // if 1 face detection, wrap in an array:
    const detectStates = (detectStatesArg.length) ? detectStatesArg : [detectStatesArg]

    // update video and THREE faceFollowers poses:
    ThreeFiberHelper.update(detectStates, _threeFiber.camera)

    // render the video texture on the faceFilter canvas:
    JEELIZFACEFILTER.render_video()

    // get expressions factors:
    detectStates.forEach((detectState, faceIndex) => {
      const exprIn = detectState.expressions
      const expression = _expressions[faceIndex]
      expression.mouthOpen = exprIn[0]
      expression.mouthSmile = exprIn[1]
      expression.eyebrowFrown = exprIn[2] // not used here
      expression.eyebrowRaised = exprIn[3] // not used here
    })
  }


  const callbackDetect = (faceIndex, isDetected) => {
    if (isDetected) {
      console.log('DETECTED')
    } else {
      console.log('LOST')
    }
  }

  const faceFilterCanvasRef = useRef(null)
  useEffect(() => {
    window.addEventListener('resize', handle_resize)
    window.addEventListener('orientationchange', handle_resize)

    JEELIZFACEFILTER.init({
      canvas: faceFilterCanvasRef.current,
      NNC: NN_4EXPR,
      maxFacesDetected: 1,
      followZRot: true,
      callbackReady,
      callbackTrack
    })
    return JEELIZFACEFILTER.destroy
  }, [isInitialized])

  console.log('RENDER ARCanvas component')
  return (
    <div>
      <Suspense fallback={null}>
      {/* Canvas managed by three fiber, for AR: */}
      <Canvas className='mirrorX' style={{
        position: 'fixed',
        zIndex: 2,
        ...sizing
      }}
      gl={{
        preserveDrawingBuffer: true // allow image capture
      }}
      updateDefaultCamera = {false}
      >
        <ambientLight />
        <ThreeGrabber sizing={sizing} />
        <FaceFollower faceIndex={0} expression={_expressions[0]} selectedHair={selectedHair}/>
      </Canvas>



    {/* Canvas managed by FaceFilter, just displaying the video (and used for WebGL computations) */}
      <canvas className='mirrorX' ref={faceFilterCanvasRef} style={{
        position: 'fixed',
        zIndex: 1,
        ...sizing
      }} width = {sizing.width} height = {sizing.height} />
      </Suspense>
      <Loader
        styles={{
          "backgroundColor": 'black',
        }}
      />
    </div>
  )
}

export default ARCanvas
