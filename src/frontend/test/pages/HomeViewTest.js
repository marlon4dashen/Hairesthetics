import renderer from 'react-test-renderer';
import HomeView from '../../src/pages/HomeView';

it('generates the HomeView', () => {
  const component = renderer.create(
    <HomeView />,
  );
  
  expect(component).not.toBeNull();
});

