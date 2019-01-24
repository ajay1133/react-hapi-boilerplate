import React from 'react';
import PropTypes from 'prop-types';
import { Progress } from 'reactstrap'; // eslint-disable-line

export default class ProgressBar extends React.Component {
  static get propTypes () {
    return {
      progressValue: PropTypes.number
    };
  }
  render () {
    const { progressValue } = this.props;
    return (
      <div>
        <div className="text-center">{ progressValue }%</div>
        <Progress value={ progressValue } />
      </div>
    );
  }
}
