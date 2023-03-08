import renderer from 'react-test-renderer';
import Footer from '../../src/components/Footer';

it('generates the Footer', () => {
  const component = renderer.create(
    <Footer />,
  );
  
  expect(component).not.toBeNull();
});
