import React from 'react'
import './App.css';
import HomeView from "./pages/HomeView"
import HairStyleView from "./pages/HairStyleView"
import HairColorView from "./pages/HairColorView"
import FaceView from "./pages/FaceView"
import { BrowserRouter, Switch, Route } from "react-router-dom";

function App() {
  return (
    <div className="App">
      <BrowserRouter>
          <Switch>
            <Route path="/" component={HomeView} exact={true}/>
            <Route path="/face" component={FaceView}/>
            <Route path="/style" component={HairStyleView}/>
            <Route path="/color" component={HairColorView}/>
          </Switch>
      </BrowserRouter>
      </div>
  );
}

export default App;