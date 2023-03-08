import renderer from 'react-test-renderer';
import Braids from '../../../src/components/models/Braids';

it('generates the Braid model', () => {
  const component = renderer.create(
    <Braids />,
  );
  
  expect(component).not.toBeNull();
});

