import React, {Component} from 'react';
import { Link, Redirect } from 'react-router-dom';
import IconSearch from '../icons/IconSearch';

export default class Search extends Component {

  constructor(props) {
    super(props);
    this.state = {
      city: '',
      shouldSearch: false
    }
  }

  handleCityChange(e) {

    this.setState({
      city: e.target.value
    });
  }

  handleSubmit(e) {
    e.preventDefault();
    this.setState({
      shouldSearch: true
    });
  }

  render() {

    if (this.state.shouldSearch) {
        return <Redirect to={`results/city/${this.state.city}`} />;
    }

    return (
      <div className="search--container">
        <div className="search-input--container">
          <form onSubmit={this.handleSubmit.bind(this)} method="GET">
              <input className="input--search"
                     value={this.state.city}
                     onChange={this.handleCityChange.bind(this)}
                     type="text"
                     placeholder="city"/>
              <button className="btn btn--search">
                <IconSearch />
              </button>
          </form>
        </div>
        <p>or</p>
        <p>use my <Link to="/results/current">current position</Link></p>
      </div>
    )
  }
}