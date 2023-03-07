import renderer from 'react-test-renderer';
import ShortHair from '../../../src/components/models/ShortHair';

it('generates the ShortHair model', () => {
  const component = renderer.create(
    <ShortHair />,
  );
  
  expect(component).not.toBeNull();
});


