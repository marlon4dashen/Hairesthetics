describe("ThreeGrabber function", () => {
    test("it should return null", () => {
        const input = null;

        const output = null;

        expect(ThreeGrabber(input)).toEqual(output);

    });
});

describe("compute_sizing function", () => {
    test("it should return object { width, height, top, left }", () => {
        const height = window.innerHeight * 7 / 10
        const width = window.innerWidth * 7 / 10
        const top = window.innerHeight * 8 / 100
        const left = window.innerWidth * 1.5 / 10
        const output = { width, height, top, left };

        expect(compute_sizing()).toEqual(output);

    });
});

describe("ARCanvas component", () => {
    test("it should return not null", () => {
        const input = null;

        expect(ARCanvas(input)).not.toBeNull();

    });
});
