import renderer from 'react-test-renderer';
import Hat from '../../../src/components/models/Hat';

it('generates the Hat model', () => {
  const component = renderer.create(
    <Hat />,
  );
  
  expect(component).not.toBeNull();
});
