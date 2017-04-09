import React, {Component} from 'react';
import Search from './js/views/Search';
import Results from './js/views/Results';
import { Route, BrowserRouter as Router } from 'react-router-dom';

import './App.css';

class App extends Component {

  render() {
    return (<Router>
      <div className="app--container">
        <div className="view--container">
          <Route exact path="/" component={Search}/>
          <Route path="/results/:method/:query?" component={Results}/>
        </div>
      </div>
      </Router>
    );
  }
}

export default App;
