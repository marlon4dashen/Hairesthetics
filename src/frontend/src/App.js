//This file renders the main web application
import './App.css';
import HomeView from "./pages/HomeView"
import HairStyleView from "./pages/HairStyleView"
import HairColorView from "./pages/HairColorView"
import SalonRecommendationView from './pages/SalonRecommendationView';
import { BrowserRouter, Switch, Route } from "react-router-dom";
import Header from './components/Navbar';
import Footer from './components/Footer';

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Header />
        <Switch>
          <Route path="/" component={HomeView} exact={true}/>
          <Route path="/style" component={HairStyleView}/>
          <Route path="/color" component={HairColorView}/>
          <Route path="/salon" component={SalonRecommendationView} />
        </Switch>
        <Footer />
      </BrowserRouter>
    </div>
  );
}

export default App;