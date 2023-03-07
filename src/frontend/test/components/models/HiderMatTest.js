import renderer from 'react-test-renderer';
import HiderMat from '../../../src/components/models/HiderMat';

it('generates the HiderMat model', () => {
  const component = renderer.create(
    <HiderMat />,
  );
  
  expect(component).not.toBeNull();
});