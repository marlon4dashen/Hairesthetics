import renderer from 'react-test-renderer';
import HairColorView_delay from '../../src/pages/HairColorView_delay';

it('generates the HairColorView_delay', () => {
  const component = renderer.create(
    <HairColorView_delay />,
  );
  
  expect(component).not.toBeNull();
});

