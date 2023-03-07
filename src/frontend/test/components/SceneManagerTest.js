import {cameraDistance} from '../../src/components/SceneManager'

describe("cameraDistance function", () => {
  test("it should return the expected output", () => {
      height = 100;
      fov = 100;

      output = (height / 2) / Math.tan((fov/2) * Math.PI / 180)

      expect(cameraDistance(height, fov)).toEqual(output);

  });
});

const cameraDistance = (height, fov) => {
  return (height / 2) / Math.tan((fov/2) * Math.PI / 180);
}
