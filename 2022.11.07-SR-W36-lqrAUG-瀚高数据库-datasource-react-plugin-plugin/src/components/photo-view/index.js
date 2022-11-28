import React, { Component } from 'react';
import PropTypes from 'prop-types';

import './index.less';

class PhotoView extends Component {
  static propTypes = {
    url: PropTypes.string,
    close: PropTypes.func,
  };

  render() {
    const { url, close } = this.props;
    return (
      <div className="photo-view" onClick={() => close()}>
        <img src={url} alt="" onClick={e => e.stopPropagation()} />
      </div>
    );
  }
}

export default PhotoView;
