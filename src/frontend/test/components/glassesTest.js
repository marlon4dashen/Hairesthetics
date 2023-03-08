import {Glasses} from '../../src/components/glasses';

describe("loadModel function", () => {
    test("it should return not null", () => {
        const input = null;

        expect(loadModel(input)).not.toBeNull();

    });
});

scene = "url";
width = 100;
height = 100;
testObj = new Glasses(scene, width, height);

describe("Glasses constructor", () => {
    test("it should return Glasses object wth scene=url, width=100, height=100, needsUpdate=false, landmarks=null", () => {

        expect(testObj.scene).toEqual(scene);
        expect(testObj.width).toEqual(width);
        expect(testObj.height).toEqual(height);
        expect(testObj.needsUpdate).toEqual(false);
        expect(testObj.landmarks).toEqual(null);

    });
});

describe("Glasses updateDimension function", () => {
    test("it should update Glasses object wth width=120, height=120, needsUpdate=true, landmarks remains null", () => {

        glasses.updateDimensions(120, 120);
        expect(testObj.width).toEqual(120);
        expect(testObj.height).toEqual(120);
        expect(testObj.needsUpdate).toEqual(true);
        expect(testObj.landmarks).toEqual(null);

    });
});

describe("Glasses updateLandMarks function", () => {
    test("it should update Glasses object wth landmarks=100, needsUpdate=true", () => {

        glasses.updateLandmarks(100);
        expect(testObj.landmarks).toEqual(100);
        expect(testObj.needsUpdate).toEqual(true);

    });
});