import renderer from 'react-test-renderer';
import Short from '../../../src/components/models/Short';

it('generates the Short model', () => {
  const component = renderer.create(
    <Short />,
  );
  
  expect(component).not.toBeNull();
});

