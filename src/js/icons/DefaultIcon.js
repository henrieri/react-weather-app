import React, {Component} from 'react';

export default class DefaultIcon extends Component {

  static propTypes = {
    width: React.PropTypes.string,
    height: React.PropTypes.string,
    fill: React.PropTypes.string
  };

  static get defaultProps() {
    return {
      width: '48',
      height: '48',
      fill: '#4F646E'
    }
  }


  render() {
    return(<div></div>)
  }
}
