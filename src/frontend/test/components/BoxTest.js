import renderer from 'react-test-renderer';
import Box from '../../src/components/Box';

it('generates the Box', () => {
  const component = renderer.create(
    <Box />,
  );
  
  expect(component).not.toBeNull();
});
