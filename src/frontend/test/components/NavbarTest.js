import renderer from 'react-test-renderer';
import Navbar from '../../src/components/Navbar';

it('generates the Navbar', () => {
  const component = renderer.create(
    <Navbar />,
  );
  
  expect(component).not.toBeNull();
});
