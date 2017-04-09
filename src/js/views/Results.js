import React, {Component} from 'react';
import moment from 'moment';
import {Link} from 'react-router-dom';
import axios from 'axios';
const API_URL = 'http://api.openweathermap.org/data/2.5/';
const APPID = 'fa81ac63f3b40e8dee3ac434e926ed0d';
import ToggleButton from 'react-toggle-button';
import IconBack from '../icons/IconBack';

export default class Results extends Component {

  constructor(props) {
    super(props);

    if (typeof localStorage.resultsState !== 'undefined') {
      this.state = JSON.parse(localStorage.resultsState);
    }
    else {
      this.state = {
        fahrenheit: false,
        currentWeatherData: {},
        weekWeatherData: [],
        isError: false,
        errorMessage: null,
        city: null,
        isCurrentDataLoaded: false,
        isWeekDataLoaded: false
      };
    }
  }

  getApiParams() {
    return {
      APPID: 'fa81ac63f3b40e8dee3ac434e926ed0d',
      mode: 'json',
      units: 'metric'
    }
  }

  componentDidUpdate(prevProps, prevState) {
    localStorage.resultsState = JSON.stringify(this.state);
  }

  componentDidMount() {

    if (this.props.match.params.method === 'city') {
      this.getDataFromCity(this.props.match.params.query);
      this.setState({
        city: this.props.match.params.query
      });
    }
    else {
      this.getDataFromCurrentLocation();
    }
  }


  setWeekData(response) {

    this.setState({
      weekWeatherData: response.list,
      isWeekDataLoaded: true
    });
  }

  setCurrentData(response) {

    this.setState({
      currentWeatherData: response,
      isCurrentDataLoaded: true
    });
  }

  handleError(error) {
    this.setState({
      error: true,
      errorMessage: error
    });
  }

  getFromApi(path, params, success, failure = (error) => this.handleError(error)) {

    if (path === 'forecast/daily') {
      success(this.mockDailyData());
    }
    else {
      success(this.mockCurrentData());
    }
    return;


    params = {
      ...this.getApiParams(),
      ...params
    };

    axios.get(API_URL + path, {
        params
      })
      .then((response) => success(response))
      .catch((error) => failure(error))
  }

  getDataFromCity(city) {

    // Get weather data for 7 days

    this.getFromApi('forecast/daily', {
      q: city,
      cnt: 7
    }, (response) => this.setWeekData(response));

    // Get today's weather data

    this.getFromApi('weather', {
      q: city
    }, (response) => this.setCurrentData(response));

  }

  getDataFromCurrentLocation() {

    if ("geolocation" in navigator === false) {
      this.handleError('Geo location is not available');
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {

        let lat = position.coords.latitude;
        let lon = position.coords.longitude;

        this.getFromApi('forecast/daily', {
          lat,
          lon
        }, (response) => this.setWeekData(response));

        // Get today's weather data

        this.getFromApi('weather', {
          lat,
          lon
        }, (response) => this.setCurrentData(response));

      },
      (error) => {
        this.handleError(error.message)
      }
    );

    // Get weather data for 7 days


  }

  getCurrentlyActiveDateString() {
    return moment.unix(this.state.currentWeatherData.dt).format('dddd, MMMM Do YYYY');
  }

  degrees(celcius) {
    return this.state.fahrenheit ? `${Math.round(celcius * 1.8 + 32)}ºF` : `${Math.round(celcius)}ºC`;
  }


  getWeatherTimeTable() {

    let map = {
      morn: 'Morning',
      day: 'Day',
      eve: 'Evening',
      night: 'Night'
    };

    let trs = [];

    Object.keys(map).map((key) => {
      trs.push(<tr key={key}>
        <td>{map[key]}</td>
        <td>{this.degrees(this.state.weekWeatherData[0].temp[key])}</td>
      </tr>);
    });

    return (
      <table className="weather-timetable">
        <tbody>
        {trs}
        </tbody>
      </table>);
  }

  mockCurrentData() {
    return {
      "coord": {"lon": 24.75, "lat": 59.44},
      "weather": [{"id": 800, "main": "Clear", "description": "clear sky", "icon": "01d"}],
      "base": "stations",
      "main": {"temp": 4, "pressure": 1015, "humidity": 64, "temp_min": 4, "temp_max": 4},
      "visibility": 10000,
      "wind": {"speed": 7.7, "deg": 260},
      "clouds": {"all": 0},
      "dt": 1491666600,
      "sys": {"type": 1, "id": 5014, "message": 0.0035, "country": "EE", "sunrise": 1491621861, "sunset": 1491672145},
      "id": 588409,
      "name": "Tallinn",
      "cod": 200
    };
  }

  mockDailyData() {
    return {
      "city": {
        "id": 588409,
        "name": "Tallinn",
        "coord": {"lon": 24.7535, "lat": 59.437},
        "country": "EE",
        "population": 0
      },
      "cod": "200",
      "message": 58.817535,
      "cnt": 7,
      "list": [{
        "dt": 1491645600,
        "temp": {"day": 4, "min": 1.78, "max": 4, "night": 1.78, "eve": 4, "morn": 4},
        "pressure": 1026.19,
        "humidity": 79,
        "weather": [{"id": 800, "main": "Clear", "description": "sky is clear", "icon": "01d"}],
        "speed": 7.91,
        "deg": 272,
        "clouds": 36,
        "snow": 0.02
      }, {
        "dt": 1491732000,
        "temp": {"day": 6.29, "min": 1.98, "max": 8.25, "night": 4.03, "eve": 8.05, "morn": 1.98},
        "pressure": 1023.59,
        "humidity": 87,
        "weather": [{"id": 500, "main": "Rain", "description": "light rain", "icon": "10d"}],
        "speed": 4.01,
        "deg": 204,
        "clouds": 44
      }, {
        "dt": 1491818400,
        "temp": {"day": 9.64, "min": 2.99, "max": 10.45, "night": 5.23, "eve": 10.22, "morn": 2.99},
        "pressure": 1013.76,
        "humidity": 69,
        "weather": [{"id": 500, "main": "Rain", "description": "light rain", "icon": "10d"}],
        "speed": 7.73,
        "deg": 208,
        "clouds": 12,
        "rain": 0.39
      }, {
        "dt": 1491904800,
        "temp": {"day": 5.31, "min": 1.69, "max": 5.31, "night": 2.01, "eve": 3.7, "morn": 1.69},
        "pressure": 1008.05,
        "humidity": 90,
        "weather": [{"id": 500, "main": "Rain", "description": "light rain", "icon": "10d"}],
        "speed": 3.09,
        "deg": 280,
        "clouds": 88,
        "rain": 1.28
      }, {
        "dt": 1491991200,
        "temp": {"day": 8.82, "min": 3.71, "max": 8.82, "night": 5.5, "eve": 6.69, "morn": 3.71},
        "pressure": 1008.45,
        "humidity": 0,
        "weather": [{"id": 501, "main": "Rain", "description": "moderate rain", "icon": "10d"}],
        "speed": 3.88,
        "deg": 195,
        "clouds": 21,
        "rain": 3.66
      }, {
        "dt": 1492077600,
        "temp": {"day": 6.95, "min": 3.42, "max": 6.95, "night": 3.42, "eve": 5.75, "morn": 5.2},
        "pressure": 995.29,
        "humidity": 0,
        "weather": [{"id": 501, "main": "Rain", "description": "moderate rain", "icon": "10d"}],
        "speed": 6.73,
        "deg": 138,
        "clouds": 79,
        "rain": 6.8
      }, {
        "dt": 1492164000,
        "temp": {"day": 5.08, "min": 1.42, "max": 5.08, "night": 1.42, "eve": 3, "morn": 3.62},
        "pressure": 990.55,
        "humidity": 0,
        "weather": [{"id": 800, "main": "Clear", "description": "sky is clear", "icon": "01d"}],
        "speed": 9.08,
        "deg": 232,
        "clouds": 69,
        "rain": 3.2,
        "snow": 0.02
      }]
    };
  }


  renderDays() {

    let days = [];

    this.state.weekWeatherData.forEach((item, index) => {

      days.push(
        <div key={index} className="day--container">
          <div className="day--name">
            {moment.unix(item.dt).format('dddd')}
          </div>
          <div className={`day--icon weather-code weather-code-${item.weather[0].icon}`}></div>
          <div className="day--temp">{this.degrees(item.temp.day)}</div>
        </div>
      )
    });

    return (<div className="days--container">
      {days}
    </div>);
  }

  isLoaded() {
    return this.state.isCurrentDataLoaded && this.state.isWeekDataLoaded;
  }

  render() {

    if (this.state.isError) {
      return (<div className="error">
        <h1>
          Error! {this.state.errorMessage}
        </h1>
      </div>)
    }

    if (!this.isLoaded()) {
      return (<div className="loading"><h1>Loading...</h1></div>);
    }

    return (
      <div className="results--container">
        <div className="results--header">
          <Link className="btn btn--back" to="/">
            <IconBack />
          </Link>
          <h1 className="city">{this.state.city}</h1>
          <div className="toggle-metrics">
            {this.renderToggleButton()}
          </div>
        </div>
        <div className="detailed-description--container">
          <div className="weather-date">{this.getCurrentlyActiveDateString()}</div>
          <div className="weather-text">{this.state.currentWeatherData.weather[0].description}</div>
          <div className="weather-description">
            <div className="weather-col-left">
              <span className="degrees">{this.degrees(this.state.currentWeatherData.main.temp)}</span>
              <div className={`weather-icon weather-code weather-code-${this.state.currentWeatherData.weather[0].icon}`}>
              </div>
            </div>
            <div className="weather-col-right">
              {this.getWeatherTimeTable()}
            </div>
          </div>
        </div>
        {this.renderDays()}
      </div>
    )
  }

  renderToggleButton() {
    return (
      <ToggleButton
        activeLabel="°C"
        inactiveLabel="°F"
        activeLabelStyle = {{
          color: 'black'
        }}
        inactiveLabelStyle = {{
          color: 'black'
        }}
        containerStyle = {{
          border: '1px solid black',
          borderRadius: '10px'
        }}
        colors={{
          activeThumb: {
            base: '#FFFFFF'
          },
          inactiveThumb: {
            base: '#FFFFFF'
          },
          active: {
            base: '#FFFFFF',
            hover: '#FFFFFF'
          },
          inactive: {
            base: '#FFFFFF',
            hover: '#FFFFFF'
          }
        }}
        value={ !this.state.fahrenheit }
        onToggle={(value) => {
                this.setState({
                  fahrenheit: value
                })
              }}
      />
    );
  }
}
