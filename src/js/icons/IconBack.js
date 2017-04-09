import React from 'react';
import DefaultIcon from './DefaultIcon';

export default class IconBack extends DefaultIcon {

  render() {
    return (
      <svg fill={this.props.fill} height={this.props.height} viewBox="0 0 24 24" width={this.props.width} xmlns="http://www.w3.org/2000/svg">
        <path d="M0 0h24v24H0z" fill="none"/>
        <path d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z"/>
      </svg>
    )
  }
}
