import React from 'react';
import PropTypes from 'prop-types';
import { Modal, Button, Dimmer, Loader, Icon } from 'semantic-ui-react'; // eslint-disable-line

export default class FileView extends React.Component {
  static get propTypes () {
    return {
      header: PropTypes.string,
      className: PropTypes.string,
      url: PropTypes.string,
      print: PropTypes.bool,
      children: PropTypes.object
    };
  }
  
  constructor () {
    super();
    this.state = {
      open: false,
      loading: false,
      stamp: 0
    };
  };
  
  openLink = () => {
    this.setState({ open: true, loading: true, stamp: +Date.now() });
  };
  
  close = () => {
    this.setState({ open: false, loading: false });
  };
  
  handleLoaded = () => {
    const { print } = this.props;
    this.setState({ loading: false });
    if (print) {
      this.handlePrint();
    }
  };
  
  handlePrint = () => {
    const { stamp } = this.state;
    const id = `frame-${stamp}`;
    const frame = document.frames ? window.frames.frames[id] : document.getElementById(id);
    const win = frame.contentWindow || frame;
    try {
      win.focus();// focus on contentWindow is needed on some ie versions
      win.print();
    } catch (e) {
      console.error('Error on print', e.toString());
    }
  };
  
  render () {
    const { header, url, print, className, children } = this.props;
    const { open, loading, stamp } = this.state;
    
    return (
      <div className={ className }>
        
        <div className="" onClick={ this.openLink }>
          {
            loading
              ? <Icon name="circle notched" loading />
              : children
          }
        </div>
        
        {
          open && (
            print
              ? (
                <iframe
                  id={ `frame-${stamp}` }
                  src={ `${url}${url.indexOf('?') > -1 ? '&' : '?'}t=${stamp}` }
                  onLoad={ this.handleLoaded }
                  style={ { visibility: 'hidden', display: 'none' } }
                />
              )
              : (
                <Modal
                  open closeIcon
                  dimmer="blurring"
                  closeOnEscape={ true }
                  closeOnDimmerClick={ false }
                  onClose={ this.close }
                  size="fullscreen">
                  {
                    header &&
                    <Modal.Header>
                      { header }
                    </Modal.Header>
                  }
                  <Modal.Content>
                    <div className="ui embed">
                      <Dimmer active={ loading } inverted>
                        <Loader content="Loading" />
                      </Dimmer>
                      <iframe
                        id="fileFrame"
                        src={ url }
                        onLoad={ this.handleLoaded }
                      />
                    </div>
                  </Modal.Content>
                  <Modal.Actions>
                    <Button onClick={ this.close } inverted>
                      CLOSE
                    </Button>
                  </Modal.Actions>
                </Modal>
              )
          )
        }
      </div>
    );
  }
}
