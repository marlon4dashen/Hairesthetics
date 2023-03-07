import renderer from 'react-test-renderer';
import ScrollBar from '../../src/components/Scrollbar';

it('generates the ScrollBar', () => {
  const component = renderer.create(
    <ScrollBar />,
  );
  
  expect(component).not.toBeNull();
});
