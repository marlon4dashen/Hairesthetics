import renderer from 'react-test-renderer';
import HairStyleView from '../../src/pages/HairStyleView';

it('generates the HairStyleView', () => {
  const component = renderer.create(
    <HairStyleView />,
  );
  
  expect(component).not.toBeNull();
});

