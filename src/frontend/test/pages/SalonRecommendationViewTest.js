import renderer from 'react-test-renderer';
import SalonRecommendationView from '../../src/pages/SalonRecommendationView';

it('generates the SalonRecommendationView', () => {
  const component = renderer.create(
    <SalonRecommendationView />,
  );
  
  expect(component).not.toBeNull();
});

