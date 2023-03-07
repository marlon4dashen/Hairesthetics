import renderer from 'react-test-renderer';
import FaceView from '../../src/pages/FaceView';

it('generates the FaceView', () => {
  const component = renderer.create(
    <FaceView />,
  );
  
  expect(component).not.toBeNull();
});

