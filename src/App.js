import React, {Component} from 'react';
import Search from './js/views/Search';
import Results from './js/views/Results';
import { Route, BrowserRouter as Router } from 'react-router-dom';

import './App.css';

class App extends Component {

  constructor() {
    super();
    this.state = {
      renderModule: this.getSearchView(),
      geoLocationAvailable: this.geoLocationAvailable(),
      results: {}
    };
  }

  geoLocationAvailable() {
    return ("geolocation" in navigator);
  }

  search() {
    this.setState({
      renderModule: this.getResultsView()
    });
  }


  goBackToSearch() {
    this.setState({
      renderModule: this.getSearchView()
    });
  }

  goToResults(results) {
    this.setState({
      results
    });

    this.search();
  }

  getSearchView() {
    return (<Search goToResults={this.goToResults.bind(this)} />);
  }

  getResultsView() {
    return (<Results results={this.state.results} goBackToSearch={this.goBackToSearch.bind(this)} />)
  }

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
