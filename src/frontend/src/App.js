import React from 'react'
import './App.css';
import HomeView from "./pages/HomeView"
import HairStyleView from "./pages/HairStyleView"
import HairColorView from "./pages/HairColorView"
import FaceView from "./pages/FaceView"
import SalonRecommendationView from './pages/SalonRecommendationView';
import { BrowserRouter, Switch, Route } from "react-router-dom";
import Header from './components/Navbar';

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Header />
        <Switch>
          <Route path="/" component={HomeView} exact={true}/>
          <Route path="/face" component={FaceView}/>
          <Route path="/style" component={HairStyleView}/>
          <Route path="/color" component={HairColorView}/>
          <Route path="/salon" component={SalonRecommendationView} />
        </Switch>
      </BrowserRouter>
    </div>
  );
}

export default App;