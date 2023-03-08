import renderer from 'react-test-renderer';
import Head from '../../../src/components/models/Head';

it('generates the Head model', () => {
  const component = renderer.create(
    <Head />,
  );
  
  expect(component).not.toBeNull();
});
