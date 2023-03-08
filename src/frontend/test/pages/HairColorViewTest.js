import renderer from 'react-test-renderer';
import HairColorView from '../../src/pages/HairColorView';

it('generates the HairColorView', () => {
  const component = renderer.create(
    <HairColorView />,
  );
  
  expect(component).not.toBeNull();
});

