import { ThreeFiberHelper } from '../helpers/ThreeFiberHelper.js'
import { useFrame, useThree } from '@react-three/fiber'

const FaceFollower = (props) => {
    // This reference will give us direct access to the mesh
    const objRef = useRef()
    useEffect(() => {
      const threeObject3D = objRef.current
      _faceFollowers[props.faceIndex] = threeObject3D
    })

    return (
      <object3D ref={objRef}>
      </object3D>
    )
}
const _maxFacesDetected = 1 // max number of detected faces
const _faceFollowers = new Array(_maxFacesDetected)
let _expressions = null
let _threeFiber = null
const ThreeGrabber = (props) => {
  _threeFiber = useThree()
  useFrame(ThreeFiberHelper.update_camera.bind(null, props.sizing, _threeFiber.camera))
  return null
}

ThreeFiberHelper.init(spec, _faceFollowers, callbackDetect)

describe("detect function", () => {
    test("it should return true", () => {
        const input =
        {0:
            {detected: 0.001390292301840632,
            x:0,y:0,s:1,xRaw:0,yRaw:0,
            expressions:{
            0:0,1:0,2:0,3:
            0.005928249564021826,
            buffer:{
            byteLength: 16, byteOffset:
            0, length: 4 }
                }
            }
        };

        expect(detect(input)).not.toEqual(true);

    });
});

describe("detect function", () => {
    test("it should return false", () => {
        const input =
        {0:
            {detected: 0.002507539441007983,
            x:0,y:0,s:1,xRaw:0,yRaw:0,
            expressions:{
            0:0,1:0,2:0,3:0,
            buffer:{
            byteLength: 16, byteOffset:
            0, length: 4 }
                }
            }
        };

        expect(detect(input)).toEqual(false);

    });
});

describe("update_poses function", () => {
    test("it should return (-0.132, -0.087, -3.376)", () => {

        const ds =
        {0:
            {detected: 0.002507539441007983,
            x:0,y:0,s:1,xRaw:0,yRaw:0,
            expressions:{
            0:0,1:0,2:0,3:0,
            buffer:{
            byteLength: 16, byteOffset:
            0, length: 4 }
                }
            }
        };

        expect(update_poses(ds,_threeFiber.camera)).toEqual((-0.132, -0.087, -3.376));

    });
});

describe("function create_occluder", () => {
    test("it should return a mesh if given a geometry, else null", () => {
        const geometry = new THREE.BoxGeometry( 1, 1, 1 );

        expect(create_occluder(geometry)).toBeInstanceOf(Mesh);
        expect(create_occluder(null)).toBeNull(null);

    });
});

describe("update_camera function", () => {
    test("it should return camera view offset(583.3, 437.5,117.7, 0, 347.9,437.5) ", () => {
        const sizing = {width: 347.9, height:437.5, top: 50, left: 74.55}

        expect(update_camera(sizing,_threeFiber.camera)).toEqual((583.3, 437.5,117.7, 0, 347.9,437.5));

    });
});